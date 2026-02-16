package com.p20.rentit.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "fuel_type")
public class FuelType {

    // ---------- PRIMARY KEY ----------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fuel_id")
    private int fuelId;

    // ---------- FUEL TYPE ----------
    @Column(name = "fuel_type")
    private String fuelType;

    // ---------- RELATIONSHIP ----------
    @JsonIgnoreProperties("fuelType")
    @OneToMany(mappedBy = "fuelType")
    private List<Vehicle> vehicles;

    // ---------- CONSTRUCTORS ----------
    public FuelType() {
    }

    public FuelType(int fuelId, String fuelType) {
        this.fuelId = fuelId;
        this.fuelType = fuelType;
    }

    // ---------- GETTERS & SETTERS ----------
    public int getFuelId() {
        return fuelId;
    }

    public void setFuelId(int fuelId) {
        this.fuelId = fuelId;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public List<Vehicle> getVehicles() {
        return vehicles;
    }

    public void setVehicles(List<Vehicle> vehicles) {
        this.vehicles = vehicles;
    }
}
