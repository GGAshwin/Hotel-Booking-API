package com.bits.scalable.api.hotel.external.room;

import com.bits.scalable.api.hotel.external.room.dto.RoomRequestDTO;
import com.bits.scalable.api.hotel.external.room.dto.RoomResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * @author I583856
 * @date 15/11/24
 */

@FeignClient(name = "roomService", url = "https://room-service.cfapps.eu12.hana.ondemand.com/api")
public interface RoomServiceClient {

    @PostMapping("/rooms")
    RoomResponse addRoom(@RequestBody RoomRequestDTO roomRequestDTO);
}


