package com.bits.scalable.api.hotel.external.room.dto;


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

    public RoomRequestDTO(String hotelId, List<RoomType> roomTypes) {
        this.hotelId = hotelId;
        this.roomType = roomTypes;
    }
}
