import api from "./http";

export const getProducts = async () => {
  const response = await api.get("/inventory/get-products");
  return response.products;
};

export const getProduct = async (productId) => {
  const response = await api.get(`/inventory/get-product/${productId}`);
  return response.product;
};

export const createProduct = async (productData) => {
  const response = await api.post(
    "/inventory/add-product",
    productData
  );

  return response.product;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.patch(
    `/inventory/update-product/${productId}`,
    productData
  );

  return response.product;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(
    `/inventory/delete-product/${productId}`
  );

  return response.product;
};

export const getInventoryChart = async () => {
  const response = await api.get("/inventory/stock");
  return response.chartData;
};