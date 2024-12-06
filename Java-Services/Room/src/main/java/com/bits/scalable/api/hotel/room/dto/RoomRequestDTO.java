package com.bits.scalable.api.hotel.room.dto;

import com.bits.scalable.api.hotel.room.entity.RoomType;
import lombok.Data;

import java.util.List;

/**
 * @author I583856
 * @date 15/11/24
 */
@Data
public class RoomRequestDTO {
    private String hotelId; // Required field
    private List<RoomType> roomType; // Optional field
}
