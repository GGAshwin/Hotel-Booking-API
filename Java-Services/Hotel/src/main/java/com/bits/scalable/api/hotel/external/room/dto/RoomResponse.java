package com.bits.scalable.api.hotel.external.room.dto;

/**
  * @author I583856
  * @date 15/11/24
 */

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RoomResponse {

    @JsonProperty("id")
    private String id;

    @JsonProperty("currentDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private String currentDate;

    @JsonProperty("hotelId")
    private String hotelId;

    @JsonProperty("roomType")
    private List<String> roomType;

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCurrentDate() {
        return currentDate;
    }

    public void setCurrentDate(String currentDate) {
        this.currentDate = currentDate;
    }

    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public List<String> getRoomType() {
        return roomType;
    }

    public void setRoomType(List<String> roomType) {
        this.roomType = roomType;
    }
}
