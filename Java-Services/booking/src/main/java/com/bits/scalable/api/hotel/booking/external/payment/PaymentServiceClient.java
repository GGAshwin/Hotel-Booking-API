package com.bits.scalable.api.hotel.booking.external.payment;

import com.bits.scalable.api.hotel.booking.external.payment.dto.PaymentRequest;
import com.bits.scalable.api.hotel.booking.external.payment.dto.PaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 * @author I583856
 * @date 28/11/24
 */

@FeignClient(name = "paymentService", url = "https://payment-service.cfapps.us10-001.hana.ondemand.com/api")
public interface PaymentServiceClient {

    @PostMapping("/payments")
    PaymentResponse pay(@RequestHeader("Authorization") String token, @RequestBody PaymentRequest paymentRequest);

}
