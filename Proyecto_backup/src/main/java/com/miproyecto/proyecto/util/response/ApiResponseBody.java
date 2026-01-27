package com.miproyecto.proyecto.util.response;


public class ApiResponseBody<T> {
    private T data;
    private Meta meta;
    private ApiError error;

    public ApiResponseBody(T data, Meta meta, ApiError error) {
        this.data = data;
        this.meta = meta;
        this.error = error;
    }

    public ApiResponseBody() {
    }

    public ApiError getError() {
        return error;
    }

    public void setError(ApiError error) {
        this.error = error;
    }

    public Meta getMeta() {
        return meta;
    }
    public void setMeta(Meta meta) {
        this.meta = meta;
    }
    public T getData() {
        return data;
    }
    public void setData(T data) {
        this.data = data;
    }
    
}
