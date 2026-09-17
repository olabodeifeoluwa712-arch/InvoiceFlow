import api from "./http";

// ===============================
// GET ALL CUSTOMERS
// ===============================
export const getCustomers = async () => {
  const response = await api.get("/customers");

  return response.customers;
};


// ===============================
// GET ONE CUSTOMER
// ===============================
export const getCustomer = async (customerId) => {
  const response = await api.get(
    `/customers/${customerId}`
  );

  return response.customer;
};


// ===============================
// CREATE CUSTOMER
// ===============================
export const createCustomer = async (customerData) => {
  const response = await api.post(
    "/customers",
    customerData
  );

  return response.customer;
};


// ===============================
// UPDATE CUSTOMER
// ===============================
export const updateCustomer = async (
  customerId,
  customerData
) => {
  const response = await api.patch(
    `/customers/${customerId}`,
    customerData
  );

  return response.customer;
};


// ===============================
// DELETE CUSTOMER
// ===============================
export const deleteCustomer = async (customerId) => {
  const response = await api.delete(
    `/customers/${customerId}`
  );

  return response;
};