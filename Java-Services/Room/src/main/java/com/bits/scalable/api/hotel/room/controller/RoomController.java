package com.bits.scalable.api.hotel.room.controller;

import com.bits.scalable.api.hotel.room.dto.RoomRequestDTO;
import com.bits.scalable.api.hotel.room.entity.Room;
import com.bits.scalable.api.hotel.room.entity.RoomType;
import com.bits.scalable.api.hotel.room.external.auth.AuthResponse;
import com.bits.scalable.api.hotel.room.external.auth.AuthServiceClient;
import com.bits.scalable.api.hotel.room.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * @author I583856
 * @date 15/11/24
 */


@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private static final Logger logger = LoggerFactory.getLogger(RoomController.class);

    private final RoomService roomService;
    private final AuthServiceClient authServiceClient;

    public RoomController(RoomService roomService, AuthServiceClient authServiceClient) {
        this.roomService = roomService;
        this.authServiceClient = authServiceClient;
    }

    @GetMapping("/health")
    public String getHealthOfService() {
        logger.info("Health check endpoint accessed");
        return "Room service is ready to serve!";
    }

    @PostMapping()
    public ResponseEntity<Room> addRoom(@RequestHeader("Authorization") String token, @RequestBody RoomRequestDTO roomRequestDTO) {
        logger.info("Received request to add a room");
        validateToken(token, new String[]{"HOTEL_MANAGER", "ADMIN"});
        Room room = roomService.addRoom(roomRequestDTO.getHotelId(), roomRequestDTO.getRoomType());
        return ResponseEntity.ok(room);
    }

    @PutMapping("/{hotelId}")
    public ResponseEntity<Optional<Room>> updateRoomTypesByHotelId(
            @RequestHeader("Authorization") String token,
            @PathVariable String hotelId,
            @RequestBody List<RoomType> roomTypes) {
        logger.info("Received request to update room types for hotel ID: {}", hotelId);
        validateToken(token, new String[]{"HOTEL_MANAGER", "ADMIN"});
        Optional<Room> updatedRoom = roomService.updateRoomTypesByHotelId(hotelId, roomTypes);
        return ResponseEntity.ok(updatedRoom);
    }

    @GetMapping("/{hotelId}")
    public ResponseEntity<List<Room>> getRoomsByHotelId(@RequestHeader("Authorization") String token, @PathVariable String hotelId) {
        logger.info("Received request to fetch rooms for hotel ID: {}", hotelId);
        validateToken(token, new String[]{"TRAVELER", "HOTEL_MANAGER", "ADMIN"});
        List<Room> rooms = roomService.getRoomsByHotelId(hotelId);
        return ResponseEntity.ok(rooms);
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
        logger.info("Access granted");
    }
}

