import api from "../api/axios";

export const getCustomerProfile = async (userId) => {
  const res = await api.get(`/customer/profile/${userId}`);
  return res.data;
};

export const updateCustomerProfile = async (userId, payload) => {
  const res = await api.put(`/customer/profile/${userId}`, payload);
  return res.data;
};
