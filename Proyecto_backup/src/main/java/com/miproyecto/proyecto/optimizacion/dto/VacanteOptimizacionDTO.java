package com.miproyecto.proyecto.optimizacion.dto;



public class VacanteOptimizacionDTO {

    private Long id;

    private double compatibility;

    private double salary;

    private int days;

    private int postulations;

    private boolean is_optimized;

    private String tipo;

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public boolean isIs_optimized() {
        return is_optimized;
    }

    public void setIs_optimized(boolean is_optimized) {
        this.is_optimized = is_optimized;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getCompatibility() {
        return compatibility;
    }

    public void setCompatibility(double compatibility) {
        this.compatibility = compatibility;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public int getDays() {
        return days;
    }

    public void setDays(int days) {
        this.days = days;
    }

    public int getPostulations() {
        return postulations;
    }

    public void setPostulations(int postulations) {
        this.postulations = postulations;
    }

}
