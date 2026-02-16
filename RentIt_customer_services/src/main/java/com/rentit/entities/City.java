package com.rentit.entities;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cityId;

    @Column(name = "city_name")
    private String cityName;

    @JsonIgnoreProperties("city")
    @OneToMany(mappedBy = "city", cascade = CascadeType.ALL)
    private Set<Area> areas;

    public City() {
        super();
    }

    public City(int cityId, String cityName) {
        super();
        this.cityId = cityId;
        this.cityName = cityName;
    }

    public int getCityId() {
        return cityId;
    }

    public void setCityId(int cityId) {
        this.cityId = cityId;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public void setAreas(Set<Area> areas) {
        for (Area a : areas) {
            a.setCity(this);
        }
        this.areas = areas;
    }
}
