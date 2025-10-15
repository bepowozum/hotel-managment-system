package com.hotel.hotelmanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Essa exceção será retornada como HTTP 400
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidacaoException extends RuntimeException {
    public ValidacaoException(String message) {
        super(message);
    }
}
