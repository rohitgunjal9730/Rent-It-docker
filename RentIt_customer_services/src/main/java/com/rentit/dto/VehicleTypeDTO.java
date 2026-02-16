package com.rentit.dto;

public class VehicleTypeDTO {

    private int vehicleTypeId;
    private String vehicleTypeName;

    // ---------- CONSTRUCTORS ----------
    public VehicleTypeDTO() {
    }

    public VehicleTypeDTO(int vehicleTypeId, String vehicleTypeName) {
        this.vehicleTypeId = vehicleTypeId;
        this.vehicleTypeName = vehicleTypeName;
    }

    // ---------- GETTERS & SETTERS ----------
    public int getVehicleTypeId() {
        return vehicleTypeId;
    }

    public void setVehicleTypeId(int vehicleTypeId) {
        this.vehicleTypeId = vehicleTypeId;
    }

    public String getVehicleTypeName() {
        return vehicleTypeName;
    }

    public void setVehicleTypeName(String vehicleTypeName) {
        this.vehicleTypeName = vehicleTypeName;
    }
}
