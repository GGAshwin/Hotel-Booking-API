package com.bits.scalable.api.hotel.room.exceptions;

public class CustomResponseException extends RuntimeException {

    private final String errorCode;

    public CustomResponseException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
