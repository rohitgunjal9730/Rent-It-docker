package com.rentit.dto;

public class AddressDTO {

    private String addressLine;
    private String area;
    private String city;
    private String pincode;

    // ---------- CONSTRUCTORS ----------
    public AddressDTO() {
    }

    public AddressDTO(String addressLine, String area, String city, String pincode) {
        this.addressLine = addressLine;
        this.area = area;
        this.city = city;
        this.pincode = pincode;
    }

    // ---------- GETTERS & SETTERS ----------
    public String getAddressLine() {
        return addressLine;
    }

    public void setAddressLine(String addressLine) {
        this.addressLine = addressLine;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }
}
