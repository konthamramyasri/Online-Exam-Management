package com.exam.onlineexamsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Ensures every error coming out of the API is a small, predictable JSON body
 * like {"message": "Invalid Email or Password"} instead of Spring Boot's
 * default whitelabel error payload. The React frontend reads `message`
 * directly to show inline form errors.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", ex.getMessage() != null ? ex.getMessage() : "Something went wrong");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fieldError -> fieldError.getDefaultMessage())
                .orElse("Validation failed");

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}
