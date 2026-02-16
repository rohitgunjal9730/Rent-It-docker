import api from "./axios";

const OwnerProfileService = {
    getProfile: async (userId) => {
        try {
            const response = await api.get(`/owner/profile/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching owner profile:", error);
            throw error;
        }
    },

    updateProfile: async (userId, profileData) => {
        try {
            const response = await api.put(`/owner/profile/${userId}`, profileData);
            return response.data;
        } catch (error) {
            console.error("Error updating owner profile:", error);
            throw error;
        }
    },

    getCities: async () => {
        try {
            const response = await api.get(`/owner/profile/cities`);
            return response.data;
        } catch (error) {
            console.error("Error fetching cities:", error);
            throw error;
        }
    },

    getAreasByCity: async (cityId) => {
        try {
            const response = await api.get(`/owner/profile/cities/${cityId}/areas`);
            return response.data;
        } catch (error) {
            console.error("Error fetching areas:", error);
            throw error;
        }
    }
};

export default OwnerProfileService;
