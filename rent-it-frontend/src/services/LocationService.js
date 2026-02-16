import api from "../api/axios";

// Get all cities
export const getCities = async () => {
  const res = await api.get("/auth/location/cities");
  return res.data;
};

// Get areas by city
export const getAreasByCity = async (cityId) => {
  const res = await api.get(`/auth/location/areas/${cityId}`);
  return res.data;
};
