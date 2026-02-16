package com.rentit.dto;

import java.time.LocalDate;

public class CreateBookingDTO {
    private int userId;
    private int vehicleId;
    private LocalDate startingDate;
    private LocalDate endDate;
    private java.time.LocalTime pickupTime;
    private java.time.LocalTime returnTime;

    public CreateBookingDTO() {
    }

    public CreateBookingDTO(int userId, int vehicleId, LocalDate startingDate, LocalDate endDate) {
        this.userId = userId;
        this.vehicleId = vehicleId;
        this.startingDate = startingDate;
        this.endDate = endDate;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(int vehicleId) {
        this.vehicleId = vehicleId;
    }

    public LocalDate getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(LocalDate startingDate) {
        this.startingDate = startingDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public java.time.LocalTime getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(java.time.LocalTime pickupTime) {
        this.pickupTime = pickupTime;
    }

    public java.time.LocalTime getReturnTime() {
        return returnTime;
    }

    public void setReturnTime(java.time.LocalTime returnTime) {
        this.returnTime = returnTime;
    }
}
