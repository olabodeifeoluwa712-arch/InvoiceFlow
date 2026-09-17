import ApiError from "./apiError";
import api from "./http";

class PaymentApi {
    reference;
    
    async initiatePayment({ amount, subscriptionPlan, subscriptionType, phone, callbackUrl }) {
        try {
            const response = await api.post('payment/initiate-payment', {
                amount,
                subscriptionPlan,
                subscriptionType,
                phone,
                callbackUrl
            });
            this.reference = response?.data?.reference || response?.reference;
            return response;
        } catch (err) {
            if (err instanceof ApiError) {
                console.log(err);
                return { error: err.message };
            }
            throw err;
        }
    }
}

export default new PaymentApi();