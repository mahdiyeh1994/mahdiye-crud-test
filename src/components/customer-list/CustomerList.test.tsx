import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Customer } from "../../types/customer";
import CustomersList from "./CustomerList";

describe("CustomersList Component", () => {
  const sampleCustomers: Customer[] = [
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

  test("renders 'No customers found.' when customers array is empty", () => {
    const onEditClick = jest.fn();
    const onDelete = jest.fn();

    render(
      <CustomersList
        customers={[]}
        onEditClick={onEditClick}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText("No customers found.")).toBeInTheDocument();
  });

  test("renders table with correct headers and rows when customers provided", () => {
    const onEditClick = jest.fn();
    const onDelete = jest.fn();

    render(
      <CustomersList
        customers={sampleCustomers}
        onEditClick={onEditClick}
        onDelete={onDelete}
      />
    );

    // Check table headers
    expect(screen.getByText("Customers List")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Date of Birth")).toBeInTheDocument();
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Bank Account #")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    // Check that customer data appears in rows
    sampleCustomers.forEach((cust) => {
      expect(screen.getByText(cust.firstName)).toBeInTheDocument();
      expect(screen.getByText(cust.lastName)).toBeInTheDocument();
      expect(screen.getByText(cust.dateOfBirth)).toBeInTheDocument();
      expect(screen.getByText(cust.phoneNumber)).toBeInTheDocument();
      expect(screen.getByText(cust.email)).toBeInTheDocument();
      expect(screen.getByText(cust.bankAccountNumber)).toBeInTheDocument();
    });

    // Check that there are as many "Update" and "Delete" buttons as customers
    const updateButtons = screen.getAllByRole("button", { name: /Update/i });
    const deleteButtons = screen.getAllByRole("button", { name: /Delete/i });
    expect(updateButtons).toHaveLength(sampleCustomers.length);
    expect(deleteButtons).toHaveLength(sampleCustomers.length);
  });

  test("calls onEditClick with correct index when Update button is clicked", async () => {
    const onEditClick = jest.fn();
    const onDelete = jest.fn();

    render(
      <CustomersList
        customers={sampleCustomers}
        onEditClick={onEditClick}
        onDelete={onDelete}
      />
    );

    const updateButtons = screen.getAllByRole("button", { name: "Update" });

    // Click the first Update button
    await userEvent.click(updateButtons[0]);
    expect(onEditClick).toHaveBeenCalledWith(0);

    // Click the second Update button
    await userEvent.click(updateButtons[1]);
    expect(onEditClick).toHaveBeenCalledWith(1);

    expect(onEditClick).toHaveBeenCalledTimes(2);
  });

  test("calls onDelete with correct index when Delete button is clicked", async () => {
    const onEditClick = jest.fn();
    const onDelete = jest.fn();

    render(
      <CustomersList
        customers={sampleCustomers}
        onEditClick={onEditClick}
        onDelete={onDelete}
      />
    );

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });

    // Click the first Delete button
    await userEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith(0);

    // Click the second Delete button
    await userEvent.click(deleteButtons[1]);
    expect(onDelete).toHaveBeenCalledWith(1);

    expect(onDelete).toHaveBeenCalledTimes(2);
  });
});
