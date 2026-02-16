package com.rentit.controllers;

import com.rentit.dto.VehicleDTO;
import com.rentit.dto.VehicleTypeDTO;
import com.rentit.services.CustomerVehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerVehicleController {

    private final CustomerVehicleService customerVehicleService;

    // Constructor-based dependency injection
    public CustomerVehicleController(CustomerVehicleService customerVehicleService) {
        this.customerVehicleService = customerVehicleService;
    }

    /**
     * Get all vehicle types
     * GET /api/customer/vehicle-types
     * 
     * @return List of all vehicle types
     */
    @GetMapping("/vehicle-types")
    public ResponseEntity<List<VehicleTypeDTO>> getAllVehicleTypes() {
        System.out.println("DEBUG: Request received for get all vehicle types");
        try {
            List<VehicleTypeDTO> vehicleTypes = customerVehicleService.getAllVehicleTypes();
            System.out.println("DEBUG: Found " + (vehicleTypes != null ? vehicleTypes.size() : "null")
                    + " vehicle types");
            return ResponseEntity.ok(vehicleTypes);
        } catch (Exception e) {
            System.err.println("DEBUG: Error fetching vehicle types:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Browse all active vehicles or filter by vehicle type
     * GET /api/customer/vehicles
     * GET /api/customer/vehicles?vehicleTypeId=1
     * 
     * @param vehicleTypeId Optional vehicle type ID to filter vehicles
     * @return List of ACTIVE vehicles (all or filtered by type)
     */
    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleDTO>> getAllActiveVehicles(
            @RequestParam(required = false) Integer vehicleTypeId) {
        System.out.println("DEBUG: Request received for get active vehicles" +
                (vehicleTypeId != null ? " with vehicleTypeId: " + vehicleTypeId : " (all)"));
        try {
            List<VehicleDTO> vehicles;

            if (vehicleTypeId != null) {
                // Filter by vehicle type
                vehicles = customerVehicleService.getActiveVehiclesByType(vehicleTypeId);
            } else {
                // Get all active vehicles
                vehicles = customerVehicleService.getAllActiveVehicles();
            }

            System.out.println("DEBUG: Found " + (vehicles != null ? vehicles.size() : "null") + " vehicles");
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            System.err.println("DEBUG: Error processing request inside Controller:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * View single active vehicle by ID
     * GET /api/customer/vehicles/{vehicleId}
     * 
     * @param vehicleId Vehicle ID
     * @return Single ACTIVE vehicle details or 404 if not found/not active
     */
    @GetMapping("/vehicles/{vehicleId}")
    public ResponseEntity<VehicleDTO> getActiveVehicleById(@PathVariable int vehicleId) {
        try {
            VehicleDTO vehicle = customerVehicleService.getActiveVehicleById(vehicleId);
            return ResponseEntity.ok(vehicle);
        } catch (RuntimeException e) {
            // Vehicle not found or not active
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
