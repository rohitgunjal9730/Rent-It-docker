import api from "../api/axios";

const BASE_URL = "/customer/bookings";

const createBooking = async (bookingData) => {
  const response = await api.post(BASE_URL, bookingData);
  return response.data;
};

const getBookingsByUser = async (userId) => {
  const response = await api.get(`${BASE_URL}/user/${userId}`);
  return response.data;
};

const getBookedDates = async (vehicleId) => {
  const response = await api.get(
    `${BASE_URL}/vehicle/${vehicleId}/booked-dates`
  );
  return response.data;
};

const checkAvailability = async (vehicleId, start, end, pickupTime, returnTime) => {
  const response = await api.get(`${BASE_URL}/vehicle/${vehicleId}/availability`, { params: { start, end, pickupTime, returnTime } });
  return response.data; // { available: true/false }
};

const cancelBooking = async (bookingId, userId) => {
  // Passing userId in body as per my controller implementation fallback
  const response = await api.put(`${BASE_URL}/${bookingId}/cancel`, { userId: Number(userId) });
  return response.data;
};

const confirmPickup = async (bookingId, userId) => {
  // Passing userId in body just in case, though Gateway should inject header.
  // The controller logic I wrote accepts body fallback.
  const response = await api.post(`${BASE_URL}/${bookingId}/pickup`, { userId: Number(userId) });
  return response.data;
};

export default {
  createBooking,
  getBookingsByUser,
  getBookedDates,
  checkAvailability,
  cancelBooking,
  confirmPickup,
  requestReturn: async (bookingId, userId) => {
    const response = await api.post(`${BASE_URL}/${bookingId}/return-request`, { userId: Number(userId) });
    return response.data;
  }
};
