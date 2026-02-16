package com.rentit.repositories;

import com.rentit.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByBooking_User_UserId(int userId);

    List<Payment> findByBooking_BookingId(int bookingId);
}
