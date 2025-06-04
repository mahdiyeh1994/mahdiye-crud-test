export interface Customer {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    bankAccountNumber: string;
  }
  export interface CustomerListProps {
    customers: Customer[];
    onEditClick: (index: number) => void;
    onDelete: (index: number) => void;
  }
  export interface CustomerFormModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (customer: Customer, index?: number) => void;
    customers: Customer[];
    initialCustomer?: Customer;
    editingIndex?: number;
  }