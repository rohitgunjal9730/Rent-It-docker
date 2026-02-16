import api from "./axios";

/**
 * Vehicle Type Service
 * Centralized API calls for vehicle type management
 */

// Get all vehicle types
export const getAllVehicleTypes = async () => {
    const response = await api.get("/admin/vehicle-types");
    return response.data;
};

// Get a single vehicle type by ID
export const getVehicleTypeById = async (id) => {
    const response = await api.get(`/admin/vehicle-types/${id}`);
    return response.data;
};

// Add a new vehicle type
export const addVehicleType = async (data) => {
    const response = await api.post("/admin/vehicle-types", data);
    return response.data;
};

// Update an existing vehicle type
export const editVehicleType = async (id, data) => {
    const response = await api.put(`/admin/vehicle-types/${id}`, data);
    return response.data;
};
