package com.bits.scalable.api.hotel.exceptions;

public class CustomResponseException extends RuntimeException {

    private final String errorCode;

    public CustomResponseException(String errorMessage, String errorCode) {
        super(errorMessage);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
