import React, { useState, useEffect } from "react";
import { Customer } from "./types/customer";
import CustomersList from "./components/customer-list/CustomerList";
import CustomerFormModal from "./components/customer-form-modal/CustomerFormModal";

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("customers");
    if (stored) {
      setCustomers(JSON.parse(stored));
    }
  }, []);

  // Saves updated list to state + localStorage
  const saveList = (newList: Customer[]) => {
    localStorage.setItem("customers", JSON.stringify(newList));
    setCustomers(newList);
  };

  // Called when CustomerFormModal submits a new or edited Customer
  const handleSave = (customer: Customer, idx?: number) => {
    if (typeof idx === "number") {
      // Edit mode: replace at index
      const updated = [...customers];
      updated[idx] = { ...customer };
      saveList(updated);
    } else {
      // Create mode
      saveList([...customers, { ...customer }]);
    }
  };

  // Called when the “Update” button is clicked in the list
  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setModalOpen(true);
  };

  // Called when the “New Customer” button is clicked
  const startCreate = () => {
    setEditingIndex(undefined);
    setModalOpen(true);
  };

  // Called when “Delete” is clicked in the list
  const handleDelete = (idx: number) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }
    const updated = customers.filter((_, i) => i !== idx);
    saveList(updated);
  };

  return (
    <div>
      <header className="p-4 flex justify-between items-center bg-gray-100">
        <h1 className="text-xl font-bold">Customer Management</h1>
        <button
          onClick={startCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Customer
        </button>
      </header>

      <main className="p-4">
        <CustomersList
          customers={customers}
          onEditClick={startEdit}
          onDelete={handleDelete}
        />
      </main>

      <CustomerFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        customers={customers}
        initialCustomer={
          editingIndex !== undefined ? customers[editingIndex] : undefined
        }
        editingIndex={editingIndex}
      />
    </div>
  );
}
