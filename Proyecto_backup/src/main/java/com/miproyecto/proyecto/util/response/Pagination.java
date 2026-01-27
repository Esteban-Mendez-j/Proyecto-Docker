package com.miproyecto.proyecto.util.response;

import org.springframework.data.domain.Pageable;

public class Pagination {
    private Long totalElements;
    private Pageable pageActual;
    private int totalPage;

    public Pagination() {
    }

    public Pagination(Long totalElements, Pageable pageActual, int totalPage) {
        this.totalElements = totalElements;
        this.pageActual = pageActual;
        this.totalPage = totalPage;
    }
    
    public Long getTotalElements() {
        return totalElements;
    }
    public void setTotalElements(Long totalElements) {
        this.totalElements = totalElements;
    }
    public Pageable getPageActual() {
        return pageActual;
    }
    public void setPageActual(Pageable pageActual) {
        this.pageActual = pageActual;
    }
    public int getTotalPage() {
        return totalPage;
    }
    public void setTotalPage(int totalPage) {
        this.totalPage = totalPage;
    }

   
}
