package com.rentit.services;

import com.rentit.entities.Payment;
import com.rentit.entities.Booking;
import com.rentit.entities.PaymentStatus;
import com.rentit.entities.PaymentMethod;
import com.rentit.entities.PaymentType;
import com.rentit.entities.BookingStatus;
import com.rentit.repositories.BookingRepository;
import com.rentit.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    public Payment processPayment(int bookingId, double amount, String paymentMethodStr) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        BigDecimal amountBd = BigDecimal.valueOf(amount);
        BigDecimal totalRent = booking.getTotalAmount();
        BigDecimal currentPaid = booking.getPaidAmount();
        BigDecimal depositRequired = booking.getDepositAmount();

        // Validate basic payment rules
        if (amountBd.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Payment amount must be greater than zero.");
        }

        // Create Payment Record
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setPaymentAmount(amount);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId(UUID.randomUUID().toString()); // Mock Transaction ID

        try {
            // Map common names to enum if needed, or rely on exact match
            String method = paymentMethodStr.toUpperCase();
            if (method.equals("CREDIT_CARD"))
                method = "CARD";
            payment.setPaymentMethod(PaymentMethod.valueOf(method));
        } catch (IllegalArgumentException e) {
            payment.setPaymentMethod(PaymentMethod.CARD); // Default
        }

        // Determine Payment Type
        if (currentPaid.compareTo(BigDecimal.ZERO) == 0) {
            payment.setPaymentType(PaymentType.DEPOSIT);
        } else {
            payment.setPaymentType(PaymentType.FINAL);
        }

        payment.setPaymentStatus(PaymentStatus.SUCCESS); // Assume success for this flow

        // Update Booking Paid Amount
        BigDecimal newPaidAmount = currentPaid.add(amountBd);
        booking.setPaidAmount(newPaidAmount);

        // Update Statuses based on Amount Paid
        // 1. Partial: Paid < Total AND (Paid >= Deposit usually required, but allowed
        // partials)
        // 2. Completed: Paid >= Total

        if (newPaidAmount.compareTo(totalRent) >= 0) {
            // Full Payment or Overpayment
            booking.setPaymentStatus(PaymentStatus.SUCCESS);
            booking.setBookingStatus(BookingStatus.CONFIRMED);
        } else if (newPaidAmount.compareTo(depositRequired) >= 0) {
            // Deposit paid, but less than total
            booking.setPaymentStatus(PaymentStatus.PARTIAL);
            // Booking remains PENDING_PAYMENT or becomes CONFIRMED?
            // "After deposit payment: Payment status -> PARTIAL, Booking status ->
            // PENDING_PAYMENT"
            // Wait, usually deposit confirms the reservation.
            // Requirement says: "After deposit payment: Booking status -> PENDING_PAYMENT".
            // So it stays PENDING_PAYMENT until full amount is paid?
            // OR "Remaining amount must be paid later". Use PENDING_PAYMENT.
            booking.setBookingStatus(BookingStatus.PENDING_PAYMENT);
        } else {
            // Less than deposit?
            booking.setPaymentStatus(PaymentStatus.PENDING);
            booking.setBookingStatus(BookingStatus.PENDING_PAYMENT);
        }

        // Save
        bookingRepository.save(booking);
        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentHistory(int userId) {
        return paymentRepository.findByBooking_User_UserId(userId);
    }

    public BigDecimal calculateRefund(int bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getPaidAmount().compareTo(booking.getTotalAmount()) > 0) {
            return booking.getPaidAmount().subtract(booking.getTotalAmount());
        }
        return BigDecimal.ZERO;
    }
}
