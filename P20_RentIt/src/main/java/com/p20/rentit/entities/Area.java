package com.p20.rentit.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "area")
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "area_id")
    private int areaId;

    @Column(name = "area_name")
    private String areaName;

    @Column(name = "pincode")
    private String pincode;

    @JsonIgnoreProperties("areas")
    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    // ---------- Constructors ----------

    public Area() {
        super();
    }

    public Area(int areaId, String areaName, String pincode, City city) {
        super();
        this.areaId = areaId;
        this.areaName = areaName;
        this.pincode = pincode;
        this.city = city;
    }

    // ---------- Getters & Setters ----------

    public int getAreaId() {
        return areaId;
    }

    public void setAreaId(int areaId) {
        this.areaId = areaId;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }
}
