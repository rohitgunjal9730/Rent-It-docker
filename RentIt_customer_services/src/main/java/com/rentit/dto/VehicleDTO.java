package com.rentit.dto;

import java.util.List;

public class VehicleDTO {

    private int vehicleId;
    private String vehicleName;
    private String vehicleType;
    private String brand;
    private String model;
    private String registrationNumber;
    private String rcNumber;
    private String fuelType;
    private double pricePerDay;
    private String priceUnit;
    private double deposit;
    private String availabilityStatus;
    private boolean hasAC;
    private String description;
    private List<VehicleImageDTO> vehicleImages;
    private OwnerDTO owner;

    // ---------- CONSTRUCTORS ----------
    public VehicleDTO() {
    }

    public VehicleDTO(int vehicleId, String vehicleName, String vehicleType, String brand, String model,
            String registrationNumber, String rcNumber, String fuelType, double pricePerDay,
            String priceUnit, double deposit, String availabilityStatus, boolean hasAC,
            String description, List<VehicleImageDTO> vehicleImages, OwnerDTO owner) {
        this.vehicleId = vehicleId;
        this.vehicleName = vehicleName;
        this.vehicleType = vehicleType;
        this.brand = brand;
        this.model = model;
        this.registrationNumber = registrationNumber;
        this.rcNumber = rcNumber;
        this.fuelType = fuelType;
        this.pricePerDay = pricePerDay;
        this.priceUnit = priceUnit;
        this.deposit = deposit;
        this.availabilityStatus = availabilityStatus;
        this.hasAC = hasAC;
        this.description = description;
        this.vehicleImages = vehicleImages;
        this.owner = owner;
    }

    // ---------- GETTERS & SETTERS ----------
    public int getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(int vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getVehicleName() {
        return vehicleName;
    }

    public void setVehicleName(String vehicleName) {
        this.vehicleName = vehicleName;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getRcNumber() {
        return rcNumber;
    }

    public void setRcNumber(String rcNumber) {
        this.rcNumber = rcNumber;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public String getPriceUnit() {
        return priceUnit;
    }

    public void setPriceUnit(String priceUnit) {
        this.priceUnit = priceUnit;
    }

    public double getDeposit() {
        return deposit;
    }

    public void setDeposit(double deposit) {
        this.deposit = deposit;
    }

    public String getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(String availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public boolean isHasAC() {
        return hasAC;
    }

    public void setHasAC(boolean hasAC) {
        this.hasAC = hasAC;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<VehicleImageDTO> getVehicleImages() {
        return vehicleImages;
    }

    public void setVehicleImages(List<VehicleImageDTO> vehicleImages) {
        this.vehicleImages = vehicleImages;
    }

    public OwnerDTO getOwner() {
        return owner;
    }

    public void setOwner(OwnerDTO owner) {
        this.owner = owner;
    }
}
