package com.rentit.repositories;

import com.rentit.entities.Vehicle;
import com.rentit.entities.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

        /**
         * Find all vehicles by status with eager loading of related entities
         * 
         * @param status Vehicle status (ACTIVE, BLOCKED, MAINTENANCE)
         * @return List of vehicles with the specified status
         */
        @Query("SELECT DISTINCT v FROM Vehicle v " +
                        "LEFT JOIN FETCH v.owner o " +
                        "LEFT JOIN FETCH o.area a " +
                        "LEFT JOIN FETCH a.city c " +
                        "LEFT JOIN FETCH v.model m " +
                        "LEFT JOIN FETCH m.brand b " +
                        "LEFT JOIN FETCH v.vehicleType vt " +
                        "LEFT JOIN FETCH v.fuelType ft " +
                        "WHERE v.status = :status")
        List<Vehicle> findByStatusWithDetails(@Param("status") VehicleStatus status);

        /**
         * Find a single vehicle by ID and status with eager loading
         * 
         * @param vehicleId Vehicle ID
         * @param status    Vehicle status
         * @return Optional containing the vehicle if found
         */
        @Query("SELECT DISTINCT v FROM Vehicle v " +
                        "LEFT JOIN FETCH v.owner o " +
                        "LEFT JOIN FETCH o.area a " +
                        "LEFT JOIN FETCH a.city c " +
                        "LEFT JOIN FETCH v.model m " +
                        "LEFT JOIN FETCH m.brand b " +
                        "LEFT JOIN FETCH v.vehicleType vt " +
                        "LEFT JOIN FETCH v.fuelType ft " +
                        "WHERE v.vehicleId = :vehicleId AND v.status = :status")
        Optional<Vehicle> findByVehicleIdAndStatusWithDetails(@Param("vehicleId") int vehicleId,
                        @Param("status") VehicleStatus status);

        /**
         * Find all vehicles by vehicle type and status with eager loading
         * 
         * @param vehicleTypeId Vehicle type ID
         * @param status        Vehicle status (ACTIVE, BLOCKED, MAINTENANCE)
         * @return List of vehicles with the specified type and status
         */
        @Query("SELECT DISTINCT v FROM Vehicle v " +
                        "LEFT JOIN FETCH v.owner o " +
                        "LEFT JOIN FETCH o.area a " +
                        "LEFT JOIN FETCH a.city c " +
                        "LEFT JOIN FETCH v.model m " +
                        "LEFT JOIN FETCH m.brand b " +
                        "LEFT JOIN FETCH v.vehicleType vt " +
                        "LEFT JOIN FETCH v.fuelType ft " +
                        "WHERE v.vehicleType.vehicleTypeId = :vehicleTypeId AND v.status = :status")
        List<Vehicle> findByVehicleTypeAndStatusWithDetails(@Param("vehicleTypeId") int vehicleTypeId,
                        @Param("status") VehicleStatus status);
}
