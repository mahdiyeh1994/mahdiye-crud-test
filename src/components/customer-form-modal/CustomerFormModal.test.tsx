import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CustomerFormModal from "./CustomerFormModal";
import { Customer } from "../../types/customer";

describe("CustomerFormModal Component", () => {
  const emptyCustomers: Customer[] = [];
  const existingCustomers: Customer[] = [
    {
      firstName: "Alice",
      lastName: "Smith",
      dateOfBirth: "1985-05-05",
      phoneNumber: "+14155550000",
      email: "alice@example.com",
      bankAccountNumber: "87654321",
    },
    {
      firstName: "Bob",
      lastName: "Jones",
      dateOfBirth: "1992-03-10",
      phoneNumber: "+14155559876",
      email: "bob@example.com",
      bankAccountNumber: "12345678",
    },
  ];

  let onSaveMock: jest.Mock;
  let onCloseMock: jest.Mock;

  beforeEach(() => {
    onSaveMock = jest.fn();
    onCloseMock = jest.fn();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("does not render when open is false", () => {
    render(
      <CustomerFormModal
        open={false}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={emptyCustomers}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Create New Customer")).not.toBeInTheDocument();
  });

  test("renders empty form when open is true and no initialCustomer provided", () => {
    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={emptyCustomers}
      />
    );
    expect(screen.getByText("Create New Customer")).toBeInTheDocument();
    expect(
      (screen.getByLabelText(/First Name/i) as HTMLInputElement).value
    ).toBe("");
    expect(
      (screen.getByLabelText(/Last Name/i) as HTMLInputElement).value
    ).toBe("");
    expect(
      (screen.getByLabelText(/Date of Birth/i) as HTMLInputElement).value
    ).toBe("");
    expect(
      (screen.getByLabelText(/Phone Number/i) as HTMLInputElement).value
    ).toBe("");
    expect((screen.getByLabelText(/Email/i) as HTMLInputElement).value).toBe(
      ""
    );
    expect(
      (screen.getByLabelText(/Bank Account Number/i) as HTMLInputElement).value
    ).toBe("");
  });

  test("pre-fills form when initialCustomer is provided", () => {
    const initial: Customer = {
      firstName: "Charlie",
      lastName: "Brown",
      dateOfBirth: "2000-10-10",
      phoneNumber: "+14155551234",
      email: "charlie@example.com",
      bankAccountNumber: "87654321",
    };

    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={existingCustomers}
        initialCustomer={initial}
        editingIndex={1}
      />
    );

    expect(screen.getByText("Edit Customer")).toBeInTheDocument();
    expect(
      (screen.getByLabelText(/First Name/i) as HTMLInputElement).value
    ).toBe("Charlie");
    expect(
      (screen.getByLabelText(/Last Name/i) as HTMLInputElement).value
    ).toBe("Brown");
    expect(
      (screen.getByLabelText(/Date of Birth/i) as HTMLInputElement).value
    ).toBe("2000-10-10");
    expect(
      (screen.getByLabelText(/Phone Number/i) as HTMLInputElement).value
    ).toBe("+14155551234");
    expect((screen.getByLabelText(/Email/i) as HTMLInputElement).value).toBe(
      "charlie@example.com"
    );
    expect(
      (screen.getByLabelText(/Bank Account Number/i) as HTMLInputElement).value
    ).toBe("87654321");
  });

  test("shows validation errors when fields are empty and Save pressed", async () => {
    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={emptyCustomers}
      />
    );
    const saveBtn = screen.getByRole("button", { name: /Create Customer/i });
    await userEvent.click(saveBtn);

    expect(
      await screen.findByText("First name is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Last name is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Date of birth is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Phone number is required")
    ).toBeInTheDocument();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(
      await screen.findByText("Bank account number is required")
    ).toBeInTheDocument();
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  test("shows error for invalid phone and email formats", async () => {
    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={emptyCustomers}
      />
    );

    await userEvent.type(screen.getByLabelText(/First Name/i), "Dave");
    await userEvent.type(screen.getByLabelText(/Last Name/i), "Thomas");
    await userEvent.type(screen.getByLabelText(/Date of Birth/i), "1995-07-07");
    await userEvent.type(screen.getByLabelText(/Phone Number/i), "abcdef"); // invalid
    await userEvent.type(screen.getByLabelText(/Email/i), "not-an-email"); // invalid
    await userEvent.type(
      screen.getByLabelText(/Bank Account Number/i),
      "12345678"
    );

    const saveBtn = screen.getByRole("button", { name: /Create Customer/i });
    await userEvent.click(saveBtn);

    expect(
      await screen.findByText("Invalid mobile number")
    ).toBeInTheDocument();
    expect(await screen.findByText("Invalid email format")).toBeInTheDocument();
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  test("shows error when bank account contains non-digits or is wrong length", async () => {
    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={emptyCustomers}
      />
    );

    await userEvent.type(screen.getByLabelText(/First Name/i), "Eve");
    await userEvent.type(screen.getByLabelText(/Last Name/i), "Adams");
    await userEvent.type(screen.getByLabelText(/Date of Birth/i), "1988-08-08");
    await userEvent.type(
      screen.getByLabelText(/Phone Number/i),
      "+14155556789"
    );
    await userEvent.type(screen.getByLabelText(/Email/i), "eve@example.com");

    // Non-digit bank account
    await userEvent.type(
      screen.getByLabelText(/Bank Account Number/i),
      "abc123"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Create Customer/i })
    );
    expect(
      await screen.findByText("Bank account must contain only digits")
    ).toBeInTheDocument();

    // Too short
    await userEvent.clear(screen.getByLabelText(/Bank Account Number/i));
    await userEvent.type(
      screen.getByLabelText(/Bank Account Number/i),
      "1234567"
    ); // 7 digits
    await userEvent.click(
      screen.getByRole("button", { name: /Create Customer/i })
    );
    expect(
      await screen.findByText("Bank account must be at least 8 digits")
    ).toBeInTheDocument();

    // Too long
    await userEvent.clear(screen.getByLabelText(/Bank Account Number/i));
    const longAcct = "1".repeat(21);
    await userEvent.type(
      screen.getByLabelText(/Bank Account Number/i),
      longAcct
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Create Customer/i })
    );
    expect(
      await screen.findByText("Bank account must not exceed 20 digits")
    ).toBeInTheDocument();

    expect(onSaveMock).not.toHaveBeenCalled();
  });

  test("prevents duplicate email when editing or creating", async () => {
    // Case: creating new, duplicate with existingCustomers[0].email
    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={existingCustomers}
      />
    );
    await userEvent.type(screen.getByLabelText(/First Name/i), "New");
    await userEvent.type(screen.getByLabelText(/Last Name/i), "User");
    await userEvent.type(screen.getByLabelText(/Date of Birth/i), "2001-01-01");
    await userEvent.type(
      screen.getByLabelText(/Phone Number/i),
      "+14155550001"
    );
    await userEvent.type(screen.getByLabelText(/Email/i), "alice@example.com"); // duplicate
    await userEvent.type(
      screen.getByLabelText(/Bank Account Number/i),
      "12345678"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Create Customer/i })
    );

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "Email already exists for another customer"
      )
    );
    expect(onSaveMock).not.toHaveBeenCalled();

    // Case: editing index 0 but using existingCustomers[0].email (should allow)
    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={existingCustomers}
        initialCustomer={existingCustomers[0]}
        editingIndex={0}
      />
    );
    expect((screen.getByLabelText(/Email/i) as HTMLInputElement).value).toBe(
      "alice@example.com"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Save Changes/i })
    );
    await waitFor(() => expect(onSaveMock).toHaveBeenCalled());
  });

  test("prevents duplicate firstName+lastName+dateOfBirth", async () => {
    // Trying to create a new customer matching existingCustomers[1]
    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={existingCustomers}
      />
    );
    await userEvent.type(screen.getByLabelText(/First Name/i), "Bob");
    await userEvent.type(screen.getByLabelText(/Last Name/i), "Jones");
    await userEvent.type(screen.getByLabelText(/Date of Birth/i), "1992-03-10"); // matches index 1
    await userEvent.type(
      screen.getByLabelText(/Phone Number/i),
      "+14155559999"
    );
    await userEvent.type(screen.getByLabelText(/Email/i), "newbob@example.com");
    await userEvent.type(
      screen.getByLabelText(/Bank Account Number/i),
      "12345678"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Create Customer/i })
    );

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "A customer with this first name, last name, and date of birth already exists"
      )
    );
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  test("calls onSave and onClose with trimmed data on successful create", async () => {
    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={emptyCustomers}
      />
    );
    await userEvent.type(screen.getByLabelText(/First Name/i), "John");
    await userEvent.type(screen.getByLabelText(/Last Name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/Date of Birth/i), "1990-01-01");
    await userEvent.type(
      screen.getByLabelText(/Phone Number/i),
      "+14155551234"
    );
    await userEvent.type(screen.getByLabelText(/Email/i), "john@example.com");
    await userEvent.type(
      screen.getByLabelText(/Bank Account Number/i),
      "12345678"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Create Customer/i })
    );

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith(
        {
          firstName: "John",
          lastName: "Doe",
          dateOfBirth: "1990-01-01",
          phoneNumber: "+14155551234",
          email: "john@example.com",
          bankAccountNumber: "12345678",
        },
        undefined
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  test("calls onSave and onClose with trimmed data on successful edit", async () => {
    const initial: Customer = {
      firstName: "David",
      lastName: "Clark",
      dateOfBirth: "1991-11-11",
      phoneNumber: "+14155557890",
      email: "david@example.com",
      bankAccountNumber: "87654321",
    };

    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={existingCustomers}
        initialCustomer={initial}
        editingIndex={2}
      />
    );
    // Change phone, trim whitespace
    await userEvent.clear(screen.getByLabelText(/Phone Number/i));
    await userEvent.type(
      screen.getByLabelText(/Phone Number/i),
      "  +14155550000  "
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Save Changes/i })
    );

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith(
        {
          firstName: "David",
          lastName: "Clark",
          dateOfBirth: "1991-11-11",
          phoneNumber: "+14155550000",
          email: "david@example.com",
          bankAccountNumber: "87654321",
        },
        2
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  test("Cancel button resets form and calls onClose without saving", async () => {
    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={emptyCustomers}
      />
    );
    await userEvent.type(screen.getByLabelText(/First Name/i), "Zoe");
    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(onCloseMock).toHaveBeenCalled();
    expect(onSaveMock).not.toHaveBeenCalled();
    // Re-open with no initialCustomer to confirm form reset
    render(
      <CustomerFormModal
        open={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customers={emptyCustomers}
      />
    );
    expect(
      (screen.getByLabelText(/First Name/i) as HTMLInputElement).value
    ).toBe("");
  });
});
