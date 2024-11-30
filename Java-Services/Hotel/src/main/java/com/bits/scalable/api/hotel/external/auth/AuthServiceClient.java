package com.bits.scalable.api.hotel.external.auth;

import com.bits.scalable.api.hotel.logging.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 * @author I583856
 * @date 12/11/24
 */

@FeignClient(name = "authService", url = "https://auth-service.cfapps.us10-001.hana.ondemand.com", configuration = FeignConfig.class)
public interface AuthServiceClient {

    @PostMapping("/auth/verify")
    AuthResponse verifyToken(@RequestHeader("Authorization") String token);

}
