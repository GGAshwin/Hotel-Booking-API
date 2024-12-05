package com.bits.scalable.api.hotel.booking.repository;
import com.bits.scalable.api.hotel.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * @author I583856
 * @date 11/11/24
 */



public interface BookingRepository extends JpaRepository<Booking, UUID> {
}

