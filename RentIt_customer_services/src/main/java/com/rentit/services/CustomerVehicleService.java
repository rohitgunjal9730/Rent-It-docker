package com.rentit.services;

import com.rentit.dto.VehicleDTO;
import com.rentit.dto.VehicleTypeDTO;

import java.util.List;

public interface CustomerVehicleService {

    /**
     * Get all active vehicles
     * 
     * @return List of all ACTIVE vehicles with owner and address details
     */
    List<VehicleDTO> getAllActiveVehicles();

    /**
     * Get a single active vehicle by ID
     * 
     * @param vehicleId Vehicle ID
     * @return VehicleDTO if found and ACTIVE
     * @throws RuntimeException if vehicle not found or not ACTIVE
     */
    VehicleDTO getActiveVehicleById(int vehicleId);

    /**
     * Get all vehicle types
     * 
     * @return List of all vehicle types
     */
    List<VehicleTypeDTO> getAllVehicleTypes();

    /**
     * Get active vehicles filtered by vehicle type
     * 
     * @param vehicleTypeId Vehicle type ID to filter by
     * @return List of ACTIVE vehicles of the specified type
     */
    List<VehicleDTO> getActiveVehiclesByType(int vehicleTypeId);
}
