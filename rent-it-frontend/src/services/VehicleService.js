import api from "../api/axios";

// Owner Vehicle Service
// This service communicates with the .NET Owner microservice via Gateway
const BASE_URL = "/owner/vehicles";

// Fetch owner vehicles
export const fetchOwnerVehicles = async (ownerId) => {
    const response = await api.get(`${BASE_URL}/${ownerId}`);
    return response.data;
};

// Add vehicle
export const addVehicle = async (ownerId, vehicleData) => {
    const response = await api.post(`${BASE_URL}/${ownerId}`, vehicleData);
    return response.data; // returns vehicleId
};

// Update vehicle
export const updateVehicle = async (vehicleId, vehicleData) => {
    const response = await api.put(`${BASE_URL}/${vehicleId}`, vehicleData);
    return response.data;
};

// Upload multiple vehicle images
export const uploadMultipleVehicleImages = async (vehicleId, formData) => {
    const response = await api.post(`${BASE_URL}/${vehicleId}/images/multiple`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// Get vehicle details for edit
export const fetchVehicleDetails = async (vehicleId) => {
    const response = await api.get(`${BASE_URL}/${vehicleId}/details`);
    return response.data;
};

// Update vehicle description only
export const updateVehicleDescription = async (vehicleId, description) => {
    const response = await api.put(`${BASE_URL}/${vehicleId}/description`, { description });
    return response.data;
};

// Delete vehicle
export const deleteVehicle = async (vehicleId) => {
    const response = await api.delete(`${BASE_URL}/${vehicleId}`);
    return response.data;
};

// Delete vehicle image
export const deleteVehicleImage = async (imageId) => {
    const response = await api.delete(`${BASE_URL}/images/${imageId}`);
    return response.data;
};

// Set primary image
export const setPrimaryImage = async (vehicleId, imageId) => {
    const response = await api.put(`${BASE_URL}/${vehicleId}/images/primary`, {
        vehicleImageId: imageId
    });
    return response.data;
};
