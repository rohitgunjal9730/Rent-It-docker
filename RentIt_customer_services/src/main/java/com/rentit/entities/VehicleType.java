package com.rentit.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "vehicle_type", uniqueConstraints = {
        @UniqueConstraint(columnNames = "vehicle_type_name")
})
public class VehicleType {

    // ---------- PRIMARY KEY ----------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_type_id")
    private int vehicleTypeId;

    // ---------- BASIC DETAILS ----------
    @Column(name = "vehicle_type_name")
    private String vehicleTypeName;

    @Column(name = "rate")
    private double rate;

    @Column(name = "deposit")
    private double deposit;

    // ---------- PRICE UNIT ----------
    @Enumerated(EnumType.STRING)
    @Column(name = "price_unit")
    private PriceUnit priceUnit;

    // ---------- RELATIONSHIP ----------
    @JsonIgnoreProperties("vehicleType")
    @OneToMany(mappedBy = "vehicleType")
    private List<Vehicle> vehicles;

    // ---------- CONSTRUCTORS ----------
    public VehicleType() {
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

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public double getDeposit() {
        return deposit;
    }

    public void setDeposit(double deposit) {
        this.deposit = deposit;
    }

    public PriceUnit getPriceUnit() {
        return priceUnit;
    }

    public void setPriceUnit(PriceUnit priceUnit) {
        this.priceUnit = priceUnit;
    }

    public List<Vehicle> getVehicles() {
        return vehicles;
    }

    public void setVehicles(List<Vehicle> vehicles) {
        this.vehicles = vehicles;
    }
}
