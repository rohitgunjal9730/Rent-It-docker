package com.rentit.repositories;

import com.rentit.entities.Booking;
import com.rentit.entities.BookingStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

        @Query("SELECT b FROM Booking b " +
                        "LEFT JOIN FETCH b.vehicle v " +
                        "LEFT JOIN FETCH v.model m " +
                        "LEFT JOIN FETCH m.brand br " +
                        "WHERE b.user.userId = :userId")
        List<Booking> findByUser_UserId(@Param("userId") int userId);

        @Query("SELECT COUNT(b) > 0 FROM Booking b " +
                        "WHERE b.vehicle.vehicleId = :vehicleId " +
                        "AND (:endDate >= b.startingDate AND :startingDate <= b.endDate) " +
                        "AND b.bookingStatus <> :cancelledStatus")
        boolean existsByVehicleIdAndDateRange(@Param("vehicleId") int vehicleId,
                        @Param("startingDate") java.time.LocalDate startingDate,
                        @Param("endDate") java.time.LocalDate endDate,
                        @Param("cancelledStatus") BookingStatus cancelledStatus);

        @Query("SELECT b FROM Booking b WHERE b.vehicle.vehicleId = :vehicleId AND b.bookingStatus <> 'CANCELLED'")
        List<Booking> findActiveBookingsByVehicleId(@Param("vehicleId") int vehicleId);
}
