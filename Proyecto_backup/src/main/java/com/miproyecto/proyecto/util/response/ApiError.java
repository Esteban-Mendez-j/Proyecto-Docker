package com.miproyecto.proyecto.util.response;

import java.util.List;

import com.miproyecto.proyecto.enums.ResponseCode;

public class ApiError{
    private ResponseCode code;
    private String message;
    private List<ApiFieldError> fieldErrors;


    public ApiError(ResponseCode code, String message, List<ApiFieldError> fieldErrors) {
        this.code = code;
        this.message = message;
        this.fieldErrors = fieldErrors;
    }

    public ApiError(ResponseCode code, String message) {
        this.code = code;
        this.message = message;
    }
    
    public ApiError() {
    }
    
    public List<ApiFieldError> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(List<ApiFieldError> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }

    public ResponseCode getCode() {
        return code;
    }
    public void setCode(ResponseCode code) {
        this.code = code;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    } 
}