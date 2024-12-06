package com.bits.scalable.api.hotel.booking.service;

import com.bits.scalable.api.hotel.booking.entity.BookingStatus;
import com.bits.scalable.api.hotel.booking.entity.PaymentStatus;
import com.bits.scalable.api.hotel.booking.external.payment.PaymentServiceClient;
import com.bits.scalable.api.hotel.booking.external.payment.dto.PaymentRequest;
import com.bits.scalable.api.hotel.booking.external.payment.dto.PaymentResponse;
import com.bits.scalable.api.hotel.booking.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.bits.scalable.api.hotel.booking.entity.Booking;

import java.util.List;
import java.util.Objects;
import java.util.UUID;


/**
 * @author I583856
 * @date 11/11/24
 */

@Service
public class BookingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(BookingService.class);
    private final BookingRepository bookingRepository;
    private final PaymentServiceClient paymentServiceClient;

    public BookingService(BookingRepository bookingRepository, PaymentServiceClient paymentServiceClient) {
        this.bookingRepository = bookingRepository;
        this.paymentServiceClient = paymentServiceClient;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(UUID id) {
        return bookingRepository.findById(id).orElse(null);
    }

    // Check two things before confirming the booking
    // 1. Check the payment is done or not
    // 2. Check the rooms availability on the particular users checkin-out date
    public Booking createBooking(String token, Booking booking) {
        Booking bookingResponse = null;
        try{
            System.out.println("token " + token);
            System.out.println("payload: " +  new PaymentRequest(booking.getTravelerId(), booking.getPrice(), booking.getPaymentMethod()).toString());
            PaymentResponse paymentResponse = paymentServiceClient.pay(token, new PaymentRequest(booking.getTravelerId(), booking.getPrice(), booking.getPaymentMethod()));
            if (paymentResponse != null) {
                LOGGER.info("The payment response is {}", paymentResponse);
                if (Objects.equals(paymentResponse.getPaymentStatus(), "COMPLETED")){
                    //Check room availability

                    booking.setPaymentStatus(PaymentStatus.COMPLETED);
                    booking.setPaymentId(paymentResponse.getPaymentId());
                    booking.setStatus(BookingStatus.COMPLETED);
                }else if (Objects.equals(paymentResponse.getPaymentStatus(), "FAILED")){
                    booking.setPaymentStatus(PaymentStatus.FAILED);
                    booking.setPaymentId(paymentResponse.getPaymentId());
                    booking.setStatus(BookingStatus.CANCELED);
                }else {
                    booking.setPaymentStatus(PaymentStatus.PENDING);
                    booking.setPaymentId(paymentResponse.getPaymentId());
                    booking.setStatus(BookingStatus.PENDING);
                }
            }else{
                booking.setPaymentStatus(PaymentStatus.PENDING);
                booking.setStatus(BookingStatus.PENDING);
            }
            bookingResponse = bookingRepository.save(booking);
        } catch (Exception e) {
            LOGGER.error("Booking failed due to {}", e.getMessage());
        }
        return bookingResponse;
    }


    // if someone cancels, then we will just update the booking status. no changes to other field
    public Booking updateBooking(UUID id, Booking bookingDetails) {
        Booking booking = getBookingById(id);
        booking.setStatus(bookingDetails.getStatus());
        booking.setPaymentStatus(bookingDetails.getPaymentStatus());
        if (bookingDetails.getPaymentStatus() == PaymentStatus.PENDING){
            booking.setStatus(BookingStatus.PENDING);
        }else if (bookingDetails.getPaymentStatus() == PaymentStatus.FAILED){
            booking.setStatus(BookingStatus.CANCELED);
        }
        return bookingRepository.save(booking);
    }
}
