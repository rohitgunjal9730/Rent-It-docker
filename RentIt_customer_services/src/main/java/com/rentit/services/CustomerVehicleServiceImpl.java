package com.rentit.services;

import com.rentit.dto.AddressDTO;
import com.rentit.dto.OwnerDTO;
import com.rentit.dto.VehicleDTO;
import com.rentit.dto.VehicleImageDTO;
import com.rentit.dto.VehicleTypeDTO;
import com.rentit.entities.*;
import com.rentit.repositories.VehicleRepository;
import com.rentit.repositories.VehicleTypeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerVehicleServiceImpl implements CustomerVehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleTypeRepository vehicleTypeRepository;

    // Constructor-based dependency injection
    public CustomerVehicleServiceImpl(VehicleRepository vehicleRepository,
            VehicleTypeRepository vehicleTypeRepository) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleTypeRepository = vehicleTypeRepository;
    }

    @Override
    public List<VehicleDTO> getAllActiveVehicles() {
        System.out.println("DEBUG: Service calling repository.findByStatusWithDetails(ACTIVE)");
        List<Vehicle> activeVehicles = vehicleRepository.findByStatusWithDetails(VehicleStatus.ACTIVE);
        System.out.println("DEBUG: Repository returned " + (activeVehicles != null ? activeVehicles.size() : "null")
                + " entities");

        // Pass false to include only primary image (reduces payload size)
        return activeVehicles.stream()
                .map(v -> convertToDTO(v, false))
                .collect(Collectors.toList());
    }

    @Override
    public VehicleDTO getActiveVehicleById(int vehicleId) {
        Vehicle vehicle = vehicleRepository.findByVehicleIdAndStatusWithDetails(vehicleId, VehicleStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Vehicle not found or not active with ID: " + vehicleId));
        return convertToDTO(vehicle, true);
    }

    @Override
    public List<VehicleTypeDTO> getAllVehicleTypes() {
        System.out.println("DEBUG: Service fetching all vehicle types");
        List<VehicleType> vehicleTypes = vehicleTypeRepository.findAll();
        System.out.println("DEBUG: Repository returned " + (vehicleTypes != null ? vehicleTypes.size() : "null")
                + " vehicle types");

        return vehicleTypes.stream()
                .map(this::convertToVehicleTypeDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VehicleDTO> getActiveVehiclesByType(int vehicleTypeId) {
        System.out.println("DEBUG: Service filtering vehicles by vehicleTypeId: " + vehicleTypeId);
        List<Vehicle> filteredVehicles = vehicleRepository
                .findByVehicleTypeAndStatusWithDetails(vehicleTypeId, VehicleStatus.ACTIVE);
        System.out.println("DEBUG: Repository returned " + (filteredVehicles != null ? filteredVehicles.size() : "null")
                + " vehicles");

        // Pass false to include only primary image (reduces payload size)
        return filteredVehicles.stream()
                .map(v -> convertToDTO(v, false))
                .collect(Collectors.toList());
    }

    // ---------- HELPER METHODS ----------

    /**
     * Convert Vehicle entity to VehicleDTO
     */
    private VehicleDTO convertToDTO(Vehicle vehicle, boolean includeAllImages) {
        VehicleDTO dto = new VehicleDTO();

        // Basic vehicle information
        dto.setVehicleId(vehicle.getVehicleId());
        dto.setVehicleName(vehicle.getModel() != null ? vehicle.getModel().getModel() : null);
        dto.setVehicleType(vehicle.getVehicleType() != null ? vehicle.getVehicleType().getVehicleTypeName() : null);
        dto.setBrand(vehicle.getModel() != null && vehicle.getModel().getBrand() != null
                ? vehicle.getModel().getBrand().getBrand()
                : null);
        dto.setModel(vehicle.getModel() != null ? vehicle.getModel().getModel() : null);
        dto.setRegistrationNumber(vehicle.getVehicleNumber());
        dto.setRcNumber(vehicle.getVehicleRcNumber());
        dto.setFuelType(vehicle.getFuelType() != null ? vehicle.getFuelType().getFuelType() : null);

        // Pricing information from VehicleType
        if (vehicle.getVehicleType() != null) {
            dto.setPricePerDay(vehicle.getVehicleType().getRate());
            dto.setPriceUnit(vehicle.getVehicleType().getPriceUnit() != null
                    ? vehicle.getVehicleType().getPriceUnit().toString()
                    : null);
            dto.setDeposit(vehicle.getVehicleType().getDeposit());
        }

        // Status and features
        dto.setAvailabilityStatus(vehicle.getStatus() != null ? vehicle.getStatus().toString() : null);
        dto.setHasAC(vehicle.isAc());
        dto.setDescription(vehicle.getDescription());

        // Vehicle images
        dto.setVehicleImages(convertVehicleImages(vehicle.getVehicleImages(), includeAllImages));

        // Owner information
        dto.setOwner(convertToOwnerDTO(vehicle.getOwner()));

        return dto;
    }

    /**
     * Convert User entity to OwnerDTO
     */
    private OwnerDTO convertToOwnerDTO(User owner) {
        if (owner == null) {
            return null;
        }

        OwnerDTO dto = new OwnerDTO();
        dto.setOwnerId(owner.getUserId());

        // Concatenate owner name
        String fullName = buildFullName(owner.getFname(), owner.getMname(), owner.getLname());
        dto.setOwnerName(fullName);

        dto.setOwnerPhoneNumber(owner.getPhone());
        dto.setOwnerEmail(owner.getEmail());
        dto.setDrivingLicenseNumber(owner.getDrivingLicenceNo());
        dto.setVerificationStatus(owner.getApprovalStatus() != null
                ? owner.getApprovalStatus().toString()
                : null);

        // Address information
        dto.setAddress(convertToAddressDTO(owner));

        return dto;
    }

    /**
     * Convert Area and City information to AddressDTO
     */
    private AddressDTO convertToAddressDTO(User owner) {
        if (owner == null) {
            return null;
        }

        AddressDTO dto = new AddressDTO();
        dto.setAddressLine(owner.getAddress());

        if (owner.getArea() != null) {
            dto.setArea(owner.getArea().getAreaName());
            dto.setPincode(owner.getArea().getPincode());

            if (owner.getArea().getCity() != null) {
                dto.setCity(owner.getArea().getCity().getCityName());
            }
        }

        return dto;
    }

    /**
     * Convert vehicle images to VehicleImageDTO list
     */
    private List<VehicleImageDTO> convertVehicleImages(List<VehicleImage> images, boolean includeAll) {
        if (images == null || images.isEmpty()) {
            return new ArrayList<>();
        }

        // If not including all, filtering for primary image
        if (!includeAll) {
            return images.stream()
                    .filter(VehicleImage::isPrimary)
                    .findFirst()
                    .map(img -> {
                        List<VehicleImageDTO> list = new ArrayList<>();
                        list.add(convertToVehicleImageDTO(img));
                        return list;
                    })
                    .orElseGet(() -> {
                        // Fallback: if no primary, take the first one
                        List<VehicleImageDTO> list = new ArrayList<>();
                        if (!images.isEmpty()) {
                            list.add(convertToVehicleImageDTO(images.get(0)));
                        }
                        return list;
                    });
        }

        return images.stream()
                .map(this::convertToVehicleImageDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert VehicleImage entity to VehicleImageDTO with Base64 encoding
     */
    private VehicleImageDTO convertToVehicleImageDTO(VehicleImage image) {
        VehicleImageDTO dto = new VehicleImageDTO();
        dto.setImageId(image.getVehicleImageId());

        // Convert byte array to Base64 string
        if (image.getImage() != null) {
            String base64Image = Base64.getEncoder().encodeToString(image.getImage());
            dto.setImageData(base64Image);
        }

        dto.setPrimary(image.isPrimary());
        return dto;
    }

    /**
     * Build full name from first, middle, and last names
     */
    private String buildFullName(String firstName, String middleName, String lastName) {
        StringBuilder fullName = new StringBuilder();

        if (firstName != null && !firstName.trim().isEmpty()) {
            fullName.append(firstName.trim());
        }

        if (middleName != null && !middleName.trim().isEmpty()) {
            if (fullName.length() > 0) {
                fullName.append(" ");
            }
            fullName.append(middleName.trim());
        }

        if (lastName != null && !lastName.trim().isEmpty()) {
            if (fullName.length() > 0) {
                fullName.append(" ");
            }
            fullName.append(lastName.trim());
        }

        return fullName.toString();
    }

    /**
     * Convert VehicleType entity to VehicleTypeDTO
     */
    private VehicleTypeDTO convertToVehicleTypeDTO(VehicleType vehicleType) {
        if (vehicleType == null) {
            return null;
        }

        VehicleTypeDTO dto = new VehicleTypeDTO();
        dto.setVehicleTypeId(vehicleType.getVehicleTypeId());
        dto.setVehicleTypeName(vehicleType.getVehicleTypeName());
        return dto;
    }
}
