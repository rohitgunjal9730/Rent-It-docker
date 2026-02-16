package com.rentit.repositories;

import com.rentit.entities.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleTypeRepository extends JpaRepository<VehicleType, Integer> {
    // findAll() is implicitly provided by JpaRepository
}