package com.bits.scalable.api.hotel.booking.external.payment.dto;

import com.bits.scalable.api.hotel.booking.entity.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * @author I583856
 * @date 11/11/24
 */

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {

    @JsonProperty("user_id")
    private String travelerId;

    @JsonProperty("amount")
    private double price;

    @JsonProperty("payment_method")
    private PaymentMethod paymentMethod;

}
