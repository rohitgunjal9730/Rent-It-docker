package com.rentit.dto;

public class OwnerDTO {

    private int ownerId;
    private String ownerName;
    private String ownerPhoneNumber;
    private String ownerEmail;
    private String drivingLicenseNumber;
    private String verificationStatus;
    private AddressDTO address;

    // ---------- CONSTRUCTORS ----------
    public OwnerDTO() {
    }

    public OwnerDTO(int ownerId, String ownerName, String ownerPhoneNumber, String ownerEmail,
            String drivingLicenseNumber, String verificationStatus, AddressDTO address) {
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.ownerPhoneNumber = ownerPhoneNumber;
        this.ownerEmail = ownerEmail;
        this.drivingLicenseNumber = drivingLicenseNumber;
        this.verificationStatus = verificationStatus;
        this.address = address;
    }

    // ---------- GETTERS & SETTERS ----------
    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnerPhoneNumber() {
        return ownerPhoneNumber;
    }

    public void setOwnerPhoneNumber(String ownerPhoneNumber) {
        this.ownerPhoneNumber = ownerPhoneNumber;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getDrivingLicenseNumber() {
        return drivingLicenseNumber;
    }

    public void setDrivingLicenseNumber(String drivingLicenseNumber) {
        this.drivingLicenseNumber = drivingLicenseNumber;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public AddressDTO getAddress() {
        return address;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }
}
