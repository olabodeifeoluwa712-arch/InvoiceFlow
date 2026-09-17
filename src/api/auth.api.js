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

  export const verifyOtp = async(otp, otpId) => {
    try {
      const response = await api.post(`/auth/otp-verification/${otpId}`, { otp });
      return response
    } catch (error) {
      if (error instanceof ApiError) return { success: false, error: error.message };
      console.error("Error verifying OTP:", error);
    }
  }

  export const resendOtp = async() => {
    try {
      const response = await api.post(`/auth/resend-otp/${otpId}`);
      return response
    } catch (error) {
      if (error instanceof ApiError) return { success: false, error: error.message };
      console.error("Error resending OTP:", error);
    }
  }