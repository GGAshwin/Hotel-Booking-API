package com.bits.scalable.api.hotel.repositories;

/**
 * @author I583856
 * @date 08/11/24
 */

import com.bits.scalable.api.hotel.entities.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface HotelRepository extends JpaRepository<Hotel, UUID> {
}

