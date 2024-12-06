package com.bits.scalable.api.hotel.booking.controller;


import com.bits.scalable.api.hotel.booking.entity.Booking;
import com.bits.scalable.api.hotel.booking.external.auth.AuthServiceClient;
import com.bits.scalable.api.hotel.booking.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


/**
 * @author I583856
 * @date 11/11/24
 */


@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final AuthServiceClient authServiceClient;

    public BookingController(BookingService bookingService, AuthServiceClient authServiceClient) {
        this.bookingService = bookingService;
        this.authServiceClient = authServiceClient;
    }

    @GetMapping
    public List<Booking> getAllBookings(@RequestHeader("Authorization") String token) {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@RequestHeader("Authorization") String token, @PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestHeader("Authorization") String token, @RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(token, booking));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@RequestHeader("Authorization") String token, @PathVariable UUID id, @RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.updateBooking(id, booking));
    }

}

