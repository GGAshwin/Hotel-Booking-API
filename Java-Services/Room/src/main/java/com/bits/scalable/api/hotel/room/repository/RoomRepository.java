package com.bits.scalable.api.hotel.room.repository;

import com.bits.scalable.api.hotel.room.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author I583856
 * @date 15/11/24
 */

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    List<Room> findByHotelId(String hotelId);
}