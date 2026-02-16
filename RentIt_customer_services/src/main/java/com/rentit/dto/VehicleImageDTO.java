package com.rentit.dto;

public class VehicleImageDTO {

    private int imageId;
    private String imageData; // Base64 encoded
    private boolean isPrimary;

    // ---------- CONSTRUCTORS ----------
    public VehicleImageDTO() {
    }

    public VehicleImageDTO(int imageId, String imageData, boolean isPrimary) {
        this.imageId = imageId;
        this.imageData = imageData;
        this.isPrimary = isPrimary;
    }

    // ---------- GETTERS & SETTERS ----------
    public int getImageId() {
        return imageId;
    }

    public void setImageId(int imageId) {
        this.imageId = imageId;
    }

    public String getImageData() {
        return imageData;
    }

    public void setImageData(String imageData) {
        this.imageData = imageData;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }
}
