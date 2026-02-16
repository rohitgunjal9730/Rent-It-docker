package com.rentit.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_image")
public class VehicleImage {

    // ---------- PRIMARY KEY ----------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_image_id")
    private int vehicleImageId;

    // ---------- VEHICLE ----------
    @JsonIgnoreProperties("vehicleImages")
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    // ---------- IMAGE ----------
    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private byte[] image;

    // ---------- PRIMARY FLAG ----------
    @Column(name = "is_primary")
    private boolean isPrimary;

    // ---------- CREATED TIME ----------
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ---------- CONSTRUCTORS ----------
    public VehicleImage() {
    }

    // ---------- GETTERS & SETTERS ----------
    public int getVehicleImageId() {
        return vehicleImageId;
    }

    public void setVehicleImageId(int vehicleImageId) {
        this.vehicleImageId = vehicleImageId;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
