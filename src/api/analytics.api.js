import api from "./http";
import ApiError from "./apiError";

export const getAnalytics = async () => {
    try {
        const response = await api.get("/business/analytics");
        console.log('response:',response);
        return response;
    } catch (error) {
        if (error instanceof ApiError) return { error: error.message };
        return { error: error?.message || "Failed to fetch analytics" };
    }
};