package com.miproyecto.proyecto.util.response;


public class Meta {
    private Pagination Pagination;

    public Meta(Pagination pagination) {
        Pagination = pagination;
    }

    public Pagination getPagination() {
        return Pagination;
    }

    public void setPagination(Pagination pagination) {
        Pagination = pagination;
    }
    
}
