package com.p20.rentit.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "booking_record")
public class BookingRecord {

    // ---------- PRIMARY KEY ----------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private int recordId;

    // ---------- BOOKING ----------
    @JsonIgnoreProperties("bookingRecords")
    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // ---------- VEHICLE STATUS ----------
    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_status")
    private VehicleBookingStatus vehicleStatus;

    // ---------- ACTION DATE ----------
    @Column(
    	    name = "action_datetime",
    	    insertable = false,
    	    updatable = false
    	)
    private LocalDateTime actionDatetime;


    // ---------- CONSTRUCTORS ----------
    public BookingRecord() {
    }

    // ---------- GETTERS & SETTERS ----------
    public int getRecordId() {
        return recordId;
    }

    public void setRecordId(int recordId) {
        this.recordId = recordId;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public VehicleBookingStatus getVehicleStatus() {
        return vehicleStatus;
    }

    public void setVehicleStatus(VehicleBookingStatus vehicleStatus) {
        this.vehicleStatus = vehicleStatus;
    }

    public LocalDateTime getActionDatetime() {
        return actionDatetime;
    }

    public void setActionDatetime(LocalDateTime actionDatetime) {
        this.actionDatetime = actionDatetime;
    }
}
