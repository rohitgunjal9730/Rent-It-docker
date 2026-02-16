package com.p20.rentit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.p20.rentit.entities.City;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {

}
