import React, {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../api/http";
import useAuthStore from "../api/token";
import ApiError from "../api/apiError";

const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const currentUser = useAuthStore(
    (state) => state.currentUser
  );

  const [business, setBusiness] = useState(null);

  // GET MY BUSINESS
  const getMyBusiness = async () => {
    try {
      const response = await api.get(
        "/business/my-business"
      );

      console.log(
        "BUSINESS RESPONSE:",
        response
      );

      setBusiness(response.business);

      return response.business;

    } catch (error) {
      console.error(
        "Failed to fetch business:",
        error
      );

      throw error;
    }
  };

  // CREATE BUSINESS
  const createBusiness = async (data) => {
    try {
      const userId = currentUser?._id;

      if (!userId) {
        return {
          success: false,
          error: "Unable to identify your account.",
        };
      }

      const response = await api.post(
        `/business/${userId}`,
        data
      );

      console.log(
        "CREATE BUSINESS RESPONSE:",
        response
      );

      if (response.business) {
        setBusiness(response.business);
      }

      return response;

    } catch (error) {
      console.error(
        "Create business error:",
        error
      );

      if (error instanceof ApiError) {
        return {
          success: false,
          error:
            error.message ||
            "Unable to create business.",
        };
      }

      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Unable to create business.",
      };
    }
  };

  // UPDATE OWNER
  const updateOwnerDetails = async (
    businessId,
    ownerData
  ) => {
    try {
      const response = await api.patch(
        `/business/${businessId}/owner`,
        ownerData
      );

      console.log(
        "OWNER RESPONSE:",
        response
      );

      if (response.business) {
        setBusiness(response.business);
      }

      return response;

    } catch (error) {
      console.error(
        "Owner update failed:",
        error
      );

      throw error;
    }
  };

  // UPLOAD DOCUMENTS
  const uploadDocument = async (
    formData,
    businessId
  ) => {
    try {
      console.log(
        "UPLOAD DOCUMENT FORMDATA:"
      );

      for (const [key, value] of formData.entries()) {
        console.log(
          key,
          value,
          value instanceof File,
          value instanceof File
            ? value.name
            : ""
        );
      }

      const response = await api.patch(
        `/business/${businessId}/documents`,
        formData
      );

      console.log(
        "DOCUMENT RESPONSE:",
        response
      );

      if (response.business) {
        setBusiness(response.business);
      }

      return response;

    } catch (error) {
      console.error(
        "Document upload failed:",
        error
      );

      throw error;
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        business,
        setBusiness,
        currentUser,
        getMyBusiness,
        createBusiness,
        updateOwnerDetails,
        uploadDocument,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export default BusinessContext;

export const useBusiness = () => {
  const context = useContext(BusinessContext);

  if (!context) {
    throw new Error(
      "useBusiness must be used within BusinessProvider"
    );
  }

  return context;
};