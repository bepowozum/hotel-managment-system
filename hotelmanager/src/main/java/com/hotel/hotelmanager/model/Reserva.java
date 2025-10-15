package com.hotel.hotelmanager.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hospede_id", nullable = false)
    private Hospede hospede;

    private LocalDate dataCheckin;
    private LocalTime horaCheckin;
    private LocalDate dataCheckout;
    private LocalTime horaCheckout;
    private String status = "RESERVADO";
    private Double valorTotal;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Hospede getHospede() { return hospede; }
    public void setHospede(Hospede hospede) { this.hospede = hospede; }
    public LocalDate getDataCheckin() { return dataCheckin; }
    public void setDataCheckin(LocalDate dataCheckin) { this.dataCheckin = dataCheckin; }
    public LocalTime getHoraCheckin() { return horaCheckin; }
    public void setHoraCheckin(LocalTime horaCheckin) { this.horaCheckin = horaCheckin; }
    public LocalDate getDataCheckout() { return dataCheckout; }
    public void setDataCheckout(LocalDate dataCheckout) { this.dataCheckout = dataCheckout; }
    public LocalTime getHoraCheckout() { return horaCheckout; }
    public void setHoraCheckout(LocalTime horaCheckout) { this.horaCheckout = horaCheckout; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
}
