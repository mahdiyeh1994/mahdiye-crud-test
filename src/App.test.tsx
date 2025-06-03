import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "./App";
import { Customer } from "./types/customer";

describe("App Component Integration", () => {
  const sampleCustomer: Customer = {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-01-01",
    phoneNumber: "+14155551234",
    email: "john@example.com",
    bankAccountNumber: "12345678",
  };

  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(window, "confirm").mockImplementation(() => true);
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("initially shows 'No customers found.'", () => {
    render(<App />);
    expect(screen.getByText("No customers found.")).toBeInTheDocument();
  });

  test("creates a new customer and displays it in the list", async () => {
    render(<App />);

    // Click "New Customer" to open modal
    userEvent.click(screen.getByRole("button", { name: /New Customer/i }));

    // Wait for form inputs to appear
    const firstNameInput = await screen.findByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const dobInput = screen.getByLabelText(/Date of Birth/i);
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const bankInput = screen.getByLabelText(/Bank Account Number/i);

    // Fill out the form
    await userEvent.type(firstNameInput, sampleCustomer.firstName);
    await userEvent.type(lastNameInput, sampleCustomer.lastName);
    await userEvent.type(dobInput, sampleCustomer.dateOfBirth);
    await userEvent.type(phoneInput, sampleCustomer.phoneNumber);
    await userEvent.type(emailInput, sampleCustomer.email);
    await userEvent.type(bankInput, sampleCustomer.bankAccountNumber);

    // Submit
    userEvent.click(screen.getByRole("button", { name: /Create Customer/i }));

    // Wait for modal to close and list to update
    await waitFor(() => {
      expect(screen.queryByText(/Create New Customer/i)).not.toBeInTheDocument();
    });

    // The new customer should appear in the table
    expect(screen.getByText(sampleCustomer.firstName)).toBeInTheDocument();
    expect(screen.getByText(sampleCustomer.lastName)).toBeInTheDocument();
    expect(screen.getByText(sampleCustomer.dateOfBirth)).toBeInTheDocument();
    expect(screen.getByText(sampleCustomer.phoneNumber)).toBeInTheDocument();
    expect(screen.getByText(sampleCustomer.email)).toBeInTheDocument();
    expect(screen.getByText(sampleCustomer.bankAccountNumber)).toBeInTheDocument();

    // localStorage should contain the new customer
    const stored = JSON.parse(localStorage.getItem("customers") || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].email).toBe(sampleCustomer.email);
  });

  test("edits an existing customer and updates the list", async () => {
    // Pre-populate localStorage with one customer
    localStorage.setItem("customers", JSON.stringify([sampleCustomer]));

    render(<App />);

    // The list should show the existing customer
    expect(screen.getByText("John")).toBeInTheDocument();

    // Click "Update" on that customer row
    userEvent.click(screen.getByRole("button", { name: /Update/i }));

    // Wait for modal inputs to appear with prefilled values
    const firstNameInput = await screen.findByLabelText(/First Name/i);
    expect((firstNameInput as HTMLInputElement).value).toBe(sampleCustomer.firstName);
    expect((screen.getByLabelText(/Last Name/i) as HTMLInputElement).value).toBe(sampleCustomer.lastName);
    expect((screen.getByLabelText(/Date of Birth/i) as HTMLInputElement).value).toBe(sampleCustomer.dateOfBirth);
    expect((screen.getByLabelText(/Phone Number/i) as HTMLInputElement).value).toBe(sampleCustomer.phoneNumber);
    expect((screen.getByLabelText(/Email/i) as HTMLInputElement).value).toBe(sampleCustomer.email);
    expect((screen.getByLabelText(/Bank Account Number/i) as HTMLInputElement).value).toBe(
      sampleCustomer.bankAccountNumber
    );

    // Change the first name
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "Jonathan");

    // Submit
    userEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByText(/Edit Customer/i)).not.toBeInTheDocument();
    });

    // The updated name should appear in the list
    expect(screen.getByText("Jonathan")).toBeInTheDocument();
    expect(screen.queryByText("John")).not.toBeInTheDocument();

    // localStorage should reflect the change
    const stored = JSON.parse(localStorage.getItem("customers") || "[]");
    expect(stored[0].firstName).toBe("Jonathan");
  });

  test("deletes a customer and removes it from the list", async () => {
    // Pre-populate localStorage with one customer
    localStorage.setItem("customers", JSON.stringify([sampleCustomer]));

    render(<App />);

    // Verify the customer is in the list
    expect(screen.getByText("John")).toBeInTheDocument();

    // Click "Delete"
    userEvent.click(screen.getByRole("button", { name: /Delete/i }));

    // Wait for list to update
    await waitFor(() => {
      expect(screen.getByText("No customers found.")).toBeInTheDocument();
    });

    // localStorage should be empty
    const stored = JSON.parse(localStorage.getItem("customers") || "[]");
    expect(stored).toHaveLength(0);
  });
});