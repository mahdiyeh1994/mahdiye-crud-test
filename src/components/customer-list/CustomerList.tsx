import React from "react";
import { CustomerListProps } from "../../types/customer";

const CustomersList: React.FC<CustomerListProps> = ({
  customers,
  onEditClick,
  onDelete,
}) => {
  if (customers.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mt-8 p-4 bg-white rounded shadow">
        <p className="text-gray-700 text-center">No customers found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Customers List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">First Name</th>
              <th className="px-4 py-2 border">Last Name</th>
              <th className="px-4 py-2 border">Date of Birth</th>
              <th className="px-4 py-2 border">Phone Number</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Bank Account #</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((item, index) => (
              <tr key={item.email} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.firstName}</td>
                <td className="px-4 py-2 border">{item.lastName}</td>
                <td className="px-4 py-2 border">{item.dateOfBirth}</td>
                <td className="px-4 py-2 border">{item.phoneNumber}</td>
                <td className="px-4 py-2 border">{item.email}</td>
                <td className="px-4 py-2 border">{item.bankAccountNumber}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => onEditClick(index)}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => onDelete(index)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersList;
