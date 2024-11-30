package com.bits.scalable.api.hotel.booking.external.payment.dto;

import com.bits.scalable.api.hotel.booking.entity.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * @author I583856
 * @date 11/11/24
 */

import java.time.LocalDateTime;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PaymentResponse {

    @JsonProperty("payment_id")
    private String paymentId;

    @JsonProperty("traveler_id")
    private String travelerId;

    @JsonProperty("amount")
    private double amount;

    @JsonProperty("payment_method")
    private String paymentMethod;

    @JsonProperty("status")
    private String paymentStatus;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

}
