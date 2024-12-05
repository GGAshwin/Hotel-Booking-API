package com.bits.scalable.api.hotel.room.service;

import com.bits.scalable.api.hotel.room.entity.Room;
import com.bits.scalable.api.hotel.room.entity.RoomType;
import com.bits.scalable.api.hotel.room.exceptions.CustomResponseException;
import com.bits.scalable.api.hotel.room.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * @author I583856
 * @date 15/11/24
 */

@Service
public class RoomService {

    private static final Logger logger = LoggerFactory.getLogger(RoomService.class);

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room addRoom(String hotelId, List<RoomType> roomTypes) {
        logger.info("Adding room for hotel ID: {}", hotelId);

        try {
            List<RoomType> types = roomTypes == null ? Collections.emptyList() : roomTypes;
            Room room = new Room(hotelId, types, LocalDate.now());
            return roomRepository.save(room);
        } catch (Exception ex) {
            logger.error("Error while adding room for hotel ID: {}: {}", hotelId, ex.getMessage());
            throw new CustomResponseException("Failed to add room", "ROOM_ADDITION_FAILED");
        }
    }

    public Optional<Room> updateRoomTypesByHotelId(String hotelId, List<RoomType> roomTypes) {
        logger.info("Updating room types for hotel ID: {}", hotelId);

        try {
            Optional<Room> existingRoom = roomRepository.findByHotelId(hotelId).stream().findFirst();

            if (existingRoom.isEmpty()) {
                logger.error("Room not found for hotel ID: {}", hotelId);
                throw new CustomResponseException("Room not found for the given hotel ID", "ROOM_NOT_FOUND");
            }

            Room room = existingRoom.get();
            room.setRoomType(roomTypes);
            return Optional.of(roomRepository.save(room));
        } catch (CustomResponseException ex) {
            throw ex; // Re-throw for centralized handling
        } catch (Exception ex) {
            logger.error("Error while updating room types for hotel ID: {}", hotelId);
            throw new CustomResponseException("Failed to update room types", "ROOM_UPDATE_FAILED");
        }
    }

    public List<Room> getRoomsByHotelId(String hotelId) {
        logger.info("Fetching rooms for hotel ID: {}", hotelId);

        try {
            List<Room> rooms = roomRepository.findByHotelId(hotelId);
            if (rooms.isEmpty()) {
                logger.error("No rooms found for hotel ID: {}", hotelId);
                throw new CustomResponseException("No rooms found for the given hotel ID", "ROOMS_NOT_FOUND");
            }
            return rooms;
        } catch (CustomResponseException ex) {
            throw ex;
        } catch (Exception ex) {
            logger.error("Error while fetching rooms for hotel ID: {}", hotelId);
            throw new CustomResponseException("Failed to fetch rooms", "ROOM_FETCH_FAILED");
        }
    }
}

