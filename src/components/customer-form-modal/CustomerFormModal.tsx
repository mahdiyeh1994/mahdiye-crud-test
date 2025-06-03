import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import parsePhoneNumberFromString from "libphonenumber-js";
import { Customer, CustomerFormModalProps } from "../../types/customer";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .test("is-valid-mobile", "Invalid mobile number", (value) => {
      if (!value) return false;
      try {
        const pn = parsePhoneNumberFromString(value, "US");
        return pn?.isValid() ?? false;
      } catch {
        return false;
      }
    }),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  bankAccountNumber: yup
    .string()
    .required("Bank account number is required")
    .matches(/^[0-9]+$/, "Bank account must contain only digits")
    .min(8, "Bank account must be at least 8 digits")
    .max(20, "Bank account must not exceed 20 digits"),
});

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  open,
  onClose,
  onSave,
  customers,
  initialCustomer,
  editingIndex,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Customer>({
    resolver: yupResolver(schema),
    defaultValues: initialCustomer ?? {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      email: "",
      bankAccountNumber: "",
    },
  });

  // When modal opens or initialCustomer changes, reset form values
  useEffect(() => {
    if (open) {
      reset(
        initialCustomer ?? {
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          phoneNumber: "",
          email: "",
          bankAccountNumber: "",
        }
      );
    }
  }, [open, initialCustomer, reset]);

  if (!open) return null;

  const onSubmit = (data: Customer) => {
    const trimmed: Customer = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      dateOfBirth: data.dateOfBirth.trim(),
      phoneNumber: data.phoneNumber.trim(),
      email: data.email.trim(),
      bankAccountNumber: data.bankAccountNumber.trim(),
    };

    // Determine list to check against
    const others = customers.filter((_, idx) => idx !== editingIndex);

    // Check duplicate email
    if (others.some((c) => c.email === trimmed.email)) {
      alert("Email already exists for another customer");
      return;
    }

    // Check duplicate firstName+lastName+dateOfBirth
    if (
      others.some(
        (c) =>
          c.firstName === trimmed.firstName &&
          c.lastName === trimmed.lastName &&
          c.dateOfBirth === trimmed.dateOfBirth
      )
    ) {
      alert(
        "A customer with this first name, last name, and date of birth already exists"
      );
      return;
    }

    // All good: call onSave with data and optionally the editingIndex
    onSave(trimmed, editingIndex);
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {initialCustomer ? "Edit Customer" : "Create New Customer"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                {...register("firstName")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                {...register("lastName")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                {...register("phoneNumber")}
                placeholder="+1234567890"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Bank Account Number */}
            <div>
              <label
                htmlFor="bankAccountNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Bank Account Number
              </label>
              <input
                id="bankAccountNumber"
                {...register("bankAccountNumber")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.bankAccountNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bankAccountNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {initialCustomer ? "Save Changes" : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
