import api from "../api/axios";

const BASE_URL = "/customer/payments";

const processPayment = async (bookingId, amount, paymentMethod) => {
    // paymentMethod should be one of: UPI, CARD, NETBANKING, CASH (but mostly online methods)
    const response = await api.post(`${BASE_URL}/pay`, {
        bookingId,
        amount,
        paymentMethod
    });
    return response.data;
};

const getPaymentHistory = async (userId) => {
    const response = await api.get(`${BASE_URL}/history/${userId}`);
    return response.data;
};

const getRefundAmount = async (bookingId) => {
    const response = await api.get(`${BASE_URL}/refund/${bookingId}`);
    return response.data;
};

export default {
    processPayment,
    getPaymentHistory,
    getRefundAmount
};
