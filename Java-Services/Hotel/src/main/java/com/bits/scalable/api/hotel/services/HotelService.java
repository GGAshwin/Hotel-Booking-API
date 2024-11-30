package com.bits.scalable.api.hotel.services;

import com.bits.scalable.api.hotel.entities.Hotel;
import com.bits.scalable.api.hotel.exceptions.CustomResponseException;
import com.bits.scalable.api.hotel.external.room.RoomServiceClient;
import com.bits.scalable.api.hotel.external.room.dto.RoomRequestDTO;
import com.bits.scalable.api.hotel.repositories.HotelRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * @author I583856
 * @date 08/11/24
 */

@Service
public class HotelService {

    private static final Logger logger = LoggerFactory.getLogger(HotelService.class);

    private final HotelRepository hotelRepository;
    private final RoomServiceClient roomServiceClient;

    public HotelService(HotelRepository hotelRepository, RoomServiceClient roomServiceClient) {
        this.hotelRepository = hotelRepository;
        this.roomServiceClient = roomServiceClient;
    }

    public Hotel createHotel(Hotel hotel) {
        logger.info("Creating a new hotel: {}", hotel);
        try {
            Hotel savedHotel = hotelRepository.save(hotel);
            logger.info("Successfully created hotel with ID: {}", savedHotel.getId());
            roomServiceClient.addRoom(new RoomRequestDTO(String.valueOf(savedHotel.getId()), null));
            return savedHotel;
        } catch (Exception ex) {
            logger.error("Error while creating hotel: {}", ex.getMessage());
            throw new CustomResponseException("Failed to create hotel", "HOTEL_CREATION_FAILED");
        }
    }

    public List<Hotel> getAllHotels() {
        logger.info("Fetching all hotels");
        return hotelRepository.findAll();
    }

    public Hotel getHotelById(UUID id) {
        logger.info("Fetching hotel by ID: {}", id);
        return hotelRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Hotel not found with ID: {}", id);
                    throw new CustomResponseException("Hotel not found", "HOTEL_NOT_FOUND");
                });
    }

    public Hotel updateHotel(UUID id, Hotel updatedHotel) {
        logger.info("Updating hotel with ID: {}", id);
        Hotel existingHotel = getHotelById(id);
        existingHotel.setName(updatedHotel.getName());
        existingHotel.setLocation(updatedHotel.getLocation());
        existingHotel.setAmenities(updatedHotel.getAmenities());
        existingHotel.setDescription(updatedHotel.getDescription());
        existingHotel.setRating(updatedHotel.getRating());
        existingHotel.setManagerId(updatedHotel.getManagerId());
        try {
            Hotel updated = hotelRepository.save(existingHotel);
            logger.info("Successfully updated hotel with ID: {}", id);
            return updated;
        } catch (Exception ex) {
            logger.error("Error while updating hotel with ID: {}", id);
            throw new CustomResponseException("Failed to update hotel", "HOTEL_UPDATE_FAILED");
        }
    }

    public void deleteHotel(UUID id) {
        logger.info("Deleting hotel with ID: {}", id);
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Hotel not found with ID: {}", id);
                    throw new CustomResponseException("Hotel not found for deletion", "HOTEL_NOT_FOUND");
                });
        try {
            hotelRepository.delete(hotel);
            logger.info("Successfully deleted hotel with ID: {}", id);
        } catch (Exception ex) {
            logger.error("Error while deleting hotel with ID: {}", id);
            throw new CustomResponseException("Failed to delete hotel", "HOTEL_DELETION_FAILED");
        }
    }
}

