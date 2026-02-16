package com.rentit.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "vehicle", uniqueConstraints = {
        @UniqueConstraint(columnNames = "vehicle_number"),
        @UniqueConstraint(columnNames = "vehicle_rc_number")
})
public class Vehicle {

    // ---------- PRIMARY KEY ----------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    private int vehicleId;

    // ---------- OWNER ----------
    @JsonIgnoreProperties("vehicles")
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // ---------- VEHICLE TYPE ----------
    @JsonIgnoreProperties("vehicles")
    @ManyToOne
    @JoinColumn(name = "vehicle_type_id", nullable = false)
    private VehicleType vehicleType;

    // ---------- FUEL TYPE ----------
    @JsonIgnoreProperties("vehicles")
    @ManyToOne
    @JoinColumn(name = "fuel_type_id")
    private FuelType fuelType;

    // ---------- MODEL ----------
    @JsonIgnoreProperties("vehicles")
    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private Model model;

    // ---------- FEATURES ----------
    @Column(name = "ac")
    private boolean ac;

    // ---------- STATUS ----------
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VehicleStatus status;

    // ---------- IDENTIFICATION ----------
    @Column(name = "vehicle_number")
    private String vehicleNumber;

    @Column(name = "vehicle_rc_number")
    private String vehicleRcNumber;

    @Column(name = "description")
    private String description;

    // ---------- IMAGES ----------
    @JsonIgnoreProperties("vehicle")
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<VehicleImage> vehicleImages;

    // ---------- BOOKINGS ----------
    @JsonIgnoreProperties("vehicle")
    @OneToMany(mappedBy = "vehicle")
    private List<Booking> bookings;

    // ---------- CONSTRUCTORS ----------
    public Vehicle() {
    }

    // ---------- GETTERS & SETTERS ----------
    public int getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(int vehicleId) {
        this.vehicleId = vehicleId;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public VehicleType getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(VehicleType vehicleType) {
        this.vehicleType = vehicleType;
    }

    public FuelType getFuelType() {
        return fuelType;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public Model getModel() {
        return model;
    }

    public void setModel(Model model) {
        this.model = model;
    }

    public boolean isAc() {
        return ac;
    }

    public void setAc(boolean ac) {
        this.ac = ac;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getVehicleRcNumber() {
        return vehicleRcNumber;
    }

    public void setVehicleRcNumber(String vehicleRcNumber) {
        this.vehicleRcNumber = vehicleRcNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<VehicleImage> getVehicleImages() {
        return vehicleImages;
    }

    public void setVehicleImages(List<VehicleImage> vehicleImages) {
        this.vehicleImages = vehicleImages;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

}
