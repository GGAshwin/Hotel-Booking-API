package com.bits.scalable.api.hotel.controller;

/**
 * @author I583856
 * @date 09/11/24
 */

import com.bits.scalable.api.hotel.entities.Hotel;
import com.bits.scalable.api.hotel.exceptions.CustomResponseException;
import com.bits.scalable.api.hotel.external.auth.AuthResponse;
import com.bits.scalable.api.hotel.external.auth.AuthServiceClient;
import com.bits.scalable.api.hotel.services.HotelService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    private static final Logger logger = LoggerFactory.getLogger(HotelController.class);

    private final HotelService hotelService;
    private final AuthServiceClient authServiceClient;

    public HotelController(HotelService hotelService, AuthServiceClient authServiceClient) {
        this.hotelService = hotelService;
        this.authServiceClient = authServiceClient;
    }

    @GetMapping("/health")
    public String getHealthOfService() {
        logger.info("Health check endpoint accessed");
        return "Hotel service is up and running!";
    }

    @PostMapping
    public ResponseEntity<Hotel> createHotel(@RequestHeader("Authorization") String token, @RequestBody Hotel hotel) {
        logger.info("Received request to create a hotel");
        validateToken(token, new String[]{"HOTEL_MANAGER", "ADMIN"});
        return ResponseEntity.status(HttpStatus.CREATED).body(hotelService.createHotel(hotel));
    }

    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels(@RequestHeader("Authorization") String token) {
        logger.info("Received request to fetch all hotels");
        validateToken(token, new String[]{"TRAVELER", "HOTEL_MANAGER", "ADMIN"});
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@RequestHeader("Authorization") String token, @PathVariable UUID id) {
        logger.info("Received request to fetch hotel with ID: {}", id);
        validateToken(token, new String[]{"TRAVELER", "HOTEL_MANAGER", "ADMIN"});
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(@RequestHeader("Authorization") String token, @PathVariable UUID id, @RequestBody Hotel hotel) {
        logger.info("Received request to update hotel with ID: {}", id);
        validateToken(token, new String[]{"HOTEL_MANAGER", "ADMIN"});
        return ResponseEntity.ok(hotelService.updateHotel(id, hotel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHotel(@RequestHeader("Authorization") String token, @PathVariable UUID id) {
        logger.info("Received request to delete hotel with ID: {}", id);
        validateToken(token, new String[]{"ADMIN"});
        hotelService.deleteHotel(id);
        return ResponseEntity.ok("Hotel deleted successfully");
    }

    private void validateToken(String token, String[] requiredRole) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        AuthResponse response = authServiceClient.verifyToken("Bearer " + token);
        logger.info("Token validation response: {}", response);

        if (!response.isValid() || Arrays.stream(requiredRole).noneMatch(role -> role.equals(response.getRole()))) {
            logger.error("Access denied: Invalid token or role");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        logger.info("Token validation successful. Access granted");
    }
}
