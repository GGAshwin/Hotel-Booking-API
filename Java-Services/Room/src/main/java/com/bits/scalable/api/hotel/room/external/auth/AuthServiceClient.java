package com.bits.scalable.api.hotel.room.external.auth;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 * @author I528649
 */

@FeignClient(name = "authService", url = "https://auth-service.cfapps.us10-001.hana.ondemand.com")
public interface AuthServiceClient {

        @PostMapping("/auth/verify")
        AuthResponse verifyToken(@RequestHeader("Authorization") String token);

}
