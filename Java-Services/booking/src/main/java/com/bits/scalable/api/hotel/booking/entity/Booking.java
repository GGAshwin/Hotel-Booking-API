package com.bits.scalable.api.hotel.booking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

/**
 * @author I583856
 * @date 11/11/24
 */

@Entity
@Getter
@Setter
public class Booking {

    @Id
    @GeneratedValue
    private UUID id;

    private String hotelId;
    private String travelerId;
    private String roomType;
    private double price;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private BookingStatus status; // e.g., "PENDING", "CANCELLED", "COMPLETED"
    private PaymentStatus paymentStatus; // e.g., "PENDING_PAYMENT", "COMPLETED", "CANCELED"
    private PaymentMethod paymentMethod;
    private String paymentId;
}

