import api from "./http";
import ApiError from "./apiError";

export const authApi = {
    login:(email,password)=>
        http.post('/auth/login',{email,password}),
};

export const user = async () => {
    try {

      const response = await api.get("/auth/profile");
      console.log(response)
      return response.user;
    } catch (error) {
     if (error instanceof ApiError) return { success: false, error: error.message };
      console.error("Error fetching current user:", error);
    }
  }