Feature: Customer Management

  In order to manage customers in the application
  As a user
  I want to add, edit, and delete customers through the UI

  Background:
    Given the “customers” list in localStorage is empty
    And I am on the Customer Management page

  Scenario: Display no-customers message when list is empty
    Given there are no customers saved
    When I view the Customers List
    Then I should see "No customers found."

  Scenario: Open modal to create a new customer
    When I click the "New Customer" button
    Then the Customer form modal should open
    And the modal title should be "Create New Customer"
    And all form fields should be empty

  Scenario: Validation errors when trying to create with empty fields
    Given the Customer form modal is open in create mode
    When I click the "Create Customer" button without entering any data
    Then I should see an error message "First name is required"
    And I should see an error message "Last name is required"
    And I should see an error message "Date of birth is required"
    And I should see an error message "Phone number is required"
    And I should see an error message "Email is required"
    And I should see an error message "Bank account number is required"

  Scenario: Successfully create a new customer
    Given the Customer form modal is open in create mode
    When I enter "John" into the First Name field
    And I enter "Doe" into the Last Name field
    And I enter "1990-01-01" into the Date of Birth field
    And I enter "+14155551234" into the Phone Number field
    And I enter "john@example.com" into the Email field
    And I enter "12345678" into the Bank Account Number field
    And I click the "Create Customer" button
    Then the modal should close
    And the Customers List should display a row with:
      | First Name | John            |
      | Last Name  | Doe             |
      | Date of Birth | 1990-01-01   |
      | Phone Number  | +14155551234 |
      | Email      | john@example.com |
      | Bank Account # | 12345678     |
    And localStorage should contain one customer with email "john@example.com"

  Scenario: Prevent duplicate email on creation
    Given localStorage contains a customer with email "alice@example.com"
    And the Customer form modal is open in create mode
    When I enter "Alice" into the First Name field
    And I enter "Smith" into the Last Name field
    And I enter "1985-05-05" into the Date of Birth field
    And I enter "+14155550000" into the Phone Number field
    And I enter "alice@example.com" into the Email field
    And I enter "87654321" into the Bank Account Number field
    And I click the "Create Customer" button
    Then I should see an alert "Email already exists for another customer"
    And the modal should remain open

  Scenario: Prevent duplicate name+dob on creation
    Given localStorage contains a customer with:
      | firstName      | Bob              |
      | lastName       | Jones            |
      | dateOfBirth    | 1992-03-10       |
      | phoneNumber    | +14155559876     |
      | email          | bob@example.com  |
      | bankAccountNumber | 12345678      |
    And the Customer form modal is open in create mode
    When I enter "Bob" into the First Name field
    And I enter "Jones" into the Last Name field
    And I enter "1992-03-10" into the Date of Birth field
    And I enter "+14155559999" into the Phone Number field
    And I enter "newbob@example.com" into the Email field
    And I enter "87654321" into the Bank Account Number field
    And I click the "Create Customer" button
    Then I should see an alert "A customer with this first name, last name, and date of birth already exists"
    And the modal should remain open

  Scenario: Open modal to edit an existing customer
    Given localStorage contains a customer with:
      | firstName      | John            |
      | lastName       | Doe             |
      | dateOfBirth    | 1990-01-01      |
      | phoneNumber    | +14155551234    |
      | email          | john@example.com|
      | bankAccountNumber | 12345678     |
    And I view the Customers List
    When I click the "Update" button for the row with email "john@example.com"
    Then the Customer form modal should open
    And the modal title should be "Edit Customer"
    And each field should be pre-filled:
      | First Name       | John            |
      | Last Name        | Doe             |
      | Date of Birth    | 1990-01-01      |
      | Phone Number     | +14155551234    |
      | Email            | john@example.com|
      | Bank Account #   | 12345678        |

  Scenario: Successfully save changes to an existing customer
    Given localStorage contains a customer with email "john@example.com"
    And I open the edit modal for that customer
    When I change the First Name to "Jonathan"
    And I click the "Save Changes" button
    Then the modal should close
    And the Customers List should display "Jonathan" instead of "John"
    And localStorage should contain a customer with firstName "Jonathan" and email "john@example.com"

  Scenario: Delete a customer from the list
    Given localStorage contains a customer with:
      | firstName      | John            |
      | lastName       | Doe             |
      | dateOfBirth    | 1990-01-01      |
      | phoneNumber    | +14155551234    |
      | email          | john@example.com|
      | bankAccountNumber | 12345678     |
    And I view the Customers List
    When I click the "Delete" button for the row with email "john@example.com"
    And I confirm the deletion
    Then I should see "No customers found." in the list
    And localStorage should be empty

  Scenario: Cancel form modal closes without saving
    Given I open the Customer form modal to create a new customer
    When I click the "Cancel" button
    Then the modal should close
    And no new customer should be added to localStorage
