package com.bits.scalable.api.hotel.room.external.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author I528649
 */

public class AuthResponse {
    @JsonProperty("isValid")
    private Boolean valid;

    @JsonProperty("userId")
    private String userId;

    @JsonProperty("role")
    private String role;

    public Boolean isValid() {
        return valid;
    }

    public String getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }
}
