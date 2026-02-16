package com.rentit.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rentit.dto.CreateBookingDTO;
import com.rentit.entities.Booking;
import com.rentit.entities.BookingRecord;
import com.rentit.entities.BookingStatus;
import com.rentit.entities.PaymentStatus;
import com.rentit.entities.User;
import com.rentit.entities.Vehicle;
import com.rentit.entities.VehicleBookingStatus;
import com.rentit.repositories.BookingRecordRepository;
import com.rentit.repositories.BookingRepository;
import com.rentit.repositories.UserRepository;
import com.rentit.repositories.VehicleRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRecordRepository bookingRecordRepository;

    @Transactional
    public Booking createBooking(CreateBookingDTO bookingDTO) {
        // 1. Validate Dates
        if (bookingDTO.getStartingDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Starting date cannot be in the past.");
        }
        if (bookingDTO.getEndDate().isBefore(bookingDTO.getStartingDate())) {
            throw new RuntimeException("End date cannot be before starting date.");
        }

        // Check for overlaps at datetime precision (uses pickup/return times)
        java.time.LocalDateTime requestedStart = bookingDTO.getStartingDate().atTime(
                bookingDTO.getPickupTime() != null ? bookingDTO.getPickupTime() : java.time.LocalTime.MIN);
        java.time.LocalDateTime requestedEnd = bookingDTO.getEndDate().atTime(
                bookingDTO.getReturnTime() != null ? bookingDTO.getReturnTime() : java.time.LocalTime.MAX);

        if (isVehicleBooked(bookingDTO.getVehicleId(), requestedStart, requestedEnd)) {
            throw new RuntimeException("Vehicle is already booked for the selected dates/times.");
        }

        Vehicle vehicle = vehicleRepository.findById(bookingDTO.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        long days = ChronoUnit.DAYS.between(bookingDTO.getStartingDate(), bookingDTO.getEndDate()) + 1;
        if (days <= 0)
            days = 1;

        BigDecimal pricePerDay = BigDecimal.ZERO;
        BigDecimal depositAmount = BigDecimal.ZERO;

        // Use Pricing from VehicleType as requested
        if (vehicle.getVehicleType() != null) {
            pricePerDay = BigDecimal.valueOf(vehicle.getVehicleType().getRate());
            depositAmount = BigDecimal.valueOf(vehicle.getVehicleType().getDeposit());
        } else {
            // If VehicleType is null, price is 0 (should not happen if data is integrity
            // checked)
            pricePerDay = BigDecimal.ZERO;
        }

        BigDecimal totalRentAmount = pricePerDay.multiply(BigDecimal.valueOf(days));

        // 2. Create Booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setVehicle(vehicle);
        booking.setBookingDate(LocalDateTime.now());
        booking.setStartingDate(bookingDTO.getStartingDate());
        booking.setStartingDate(bookingDTO.getStartingDate());
        booking.setEndDate(bookingDTO.getEndDate());
        booking.setPickupTime(bookingDTO.getPickupTime());
        booking.setReturnTime(bookingDTO.getReturnTime());

        booking.setTotalAmount(totalRentAmount); // Total Cost of Service
        booking.setDepositAmount(depositAmount); // Security Deposit
        // User pays Deposit LATER using Pay button
        booking.setPaidAmount(BigDecimal.ZERO);

        // Default Statuses
        booking.setBookingStatus(BookingStatus.PENDING_PAYMENT);
        booking.setPaymentStatus(PaymentStatus.PENDING); // Payment is pending until user clicks "Pay"

        Booking savedBooking = bookingRepository.save(booking);

        // 3. Create Booking Record
        BookingRecord record = new BookingRecord();
        record.setBooking(savedBooking);
        record.setVehicleStatus(VehicleBookingStatus.BOOKED); // Technically reserved, but keeping BOOKED as per
                                                              // existing flow or until confirmed
        // Since it is pending payment, we might want to keep it as BOOKED to block the
        // slot
        // Or if there is a PENDING status for vehicle, use that. Assuming BOOKED blocks
        // it.
        // record.setActionDatetime(LocalDateTime.now()); // DB handles this via
        // insertable=false, check if DB default exists.
        // If not, we might need to set it or rely on DB trigger/default.
        // Based on "insertable=false", it expects DB to handle it (e.g. DEFAULT
        // CURRENT_TIMESTAMP).
        // Safest is to let DB handle if schema supports it, otherwise change entity.
        // For now trusting the entity definition.

        bookingRecordRepository.save(record);

        return savedBooking;
    }

    public List<Booking> getBookingsByUser(int userId) {
        return bookingRepository.findByUser_UserId(userId);
    }

    public List<LocalDate> getBookedDates(int vehicleId) {
        List<Booking> bookings = bookingRepository.findActiveBookingsByVehicleId(vehicleId);
        return bookings.stream()
                .flatMap(b -> b.getStartingDate().datesUntil(b.getEndDate().plusDays(1)))
                .distinct()
                .sorted()
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Returns true if there exists an active booking for vehicleId that overlaps
     * the given date-time range
     */
    public boolean isVehicleBooked(int vehicleId, java.time.LocalDateTime reqStart, java.time.LocalDateTime reqEnd) {
        List<Booking> bookings = bookingRepository.findActiveBookingsByVehicleId(vehicleId);
        for (Booking b : bookings) {
            java.time.LocalDateTime existingStart = b.getStartingDate().atTime(
                    b.getPickupTime() != null ? b.getPickupTime() : java.time.LocalTime.MIN);
            java.time.LocalDateTime existingEnd = b.getEndDate().atTime(
                    b.getReturnTime() != null ? b.getReturnTime() : java.time.LocalTime.MAX);
            // Overlap check: reqStart < existingEnd && reqEnd > existingStart
            if (reqStart.isBefore(existingEnd) && reqEnd.isAfter(existingStart)) {
                return true;
            }
        }
        return false;
    }

    @Transactional
    public Booking cancelBooking(int bookingId, int userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getUser().getUserId() != userId) {
            throw new RuntimeException("You are not authorized to cancel this booking.");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled.");
        }

        // 2-day rule: Cancellation allowed only if starting date is at least 2 days
        // away from today.
        long daysUntilStart = ChronoUnit.DAYS.between(LocalDate.now(), booking.getStartingDate());
        if (daysUntilStart < 2) {
            throw new RuntimeException("Bookings can only be cancelled at least 2 days before the start date.");
        }

        booking.setBookingStatus(BookingStatus.CANCEL_REQUESTED);
        Booking savedBooking = bookingRepository.save(booking);

        // Record the cancellation request
        BookingRecord record = new BookingRecord();
        record.setBooking(savedBooking);
        record.setVehicleStatus(VehicleBookingStatus.CANCEL_REQUESTED);
        bookingRecordRepository.save(record);

        return savedBooking;
    }

    @Transactional
    public Booking confirmPickup(int bookingId, int userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // 1. Validate Ownership
        if (booking.getUser().getUserId() != userId) {
            throw new RuntimeException("You are not authorized to confirm pickup for this booking.");
        }

        // 2. Validate Booking Status
        if (booking.getBookingStatus() != BookingStatus.CONFIRMED) {
            // Idempotency check: if already ONGOING, we can just return it or throw
            // friendly error
            if (booking.getBookingStatus() == BookingStatus.ONGOING) {
                throw new RuntimeException("Pickup already confirmed.");
            }
            throw new RuntimeException(
                    "Booking is not in CONFIRMED state. Current status: " + booking.getBookingStatus());
        }

        // 3. Validate Time
        LocalDateTime pickupDateTime = LocalDateTime.of(booking.getStartingDate(),
                booking.getPickupTime() != null ? booking.getPickupTime() : java.time.LocalTime.MIN);

        if (LocalDateTime.now().isBefore(pickupDateTime)) {
            throw new RuntimeException("Cannot confirm pickup before the scheduled time: " + pickupDateTime);
        }

        // 4. Update Statuses
        booking.setBookingStatus(BookingStatus.ONGOING);
        Booking savedBooking = bookingRepository.save(booking);

        // 5. Update Vehicle Status in History (Record)
        // We use PICKED to represent the vehicle is now picked up (In Use)
        BookingRecord record = new BookingRecord();
        record.setBooking(savedBooking);
        record.setVehicleStatus(VehicleBookingStatus.PICKED);
        bookingRecordRepository.save(record);

        return savedBooking;
    }

    @Transactional
    public Booking requestReturn(int bookingId, int userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        // 1. Validate Ownership
        if (booking.getUser() == null) {
            throw new RuntimeException("Data Error: Booking has no user assigned.");
        }
        if (booking.getUser().getUserId() != userId) {
            throw new RuntimeException("Auth Failed: Booking belongs to User " + booking.getUser().getUserId()
                    + ", but request came from User " + userId);
        }

        // 2. Validate Booking Status
        if (booking.getBookingStatus() == null) {
            throw new RuntimeException("Data Error: Booking status is null.");
        }

        if (booking.getBookingStatus() != BookingStatus.ONGOING) {
            if (booking.getBookingStatus() == BookingStatus.RETURN_REQUESTED) {
                // Idempotent success (effectively) or just return the booking
                // But for now, let's allow it to pass through or return existing
                return booking;
            }
            throw new RuntimeException(
                    "Invalid Status: Cannot request return when status is " + booking.getBookingStatus());
        }

        // 3. Update Status
        booking.setBookingStatus(BookingStatus.RETURN_REQUESTED);
        return bookingRepository.save(booking);
    }
}
