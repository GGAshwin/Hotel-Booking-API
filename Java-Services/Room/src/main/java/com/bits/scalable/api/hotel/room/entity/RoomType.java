package com.bits.scalable.api.hotel.room.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * @author I583856
 * @date 15/11/24
 */

@Getter
@Setter
@Builder
@AllArgsConstructor
public class RoomType {
    @JsonProperty("type")
    private String type;

    @JsonProperty("price")
    private double price;

    @JsonProperty("availability")
    private int availability;
}
