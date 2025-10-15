package com.hotel.hotelmanager.controller;

import com.hotel.hotelmanager.exception.ValidacaoException;
import com.hotel.hotelmanager.model.Hospede;
import com.hotel.hotelmanager.model.Reserva;
import com.hotel.hotelmanager.repository.HospedeRepository;
import com.hotel.hotelmanager.repository.ReservaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private HospedeRepository hospedeRepository;

    private static final double DIARIA_DIA_UTIL = 120.0;
    private static final double DIARIA_FDS = 180.0;
    private static final double TAXA_CARRO_DIA_UTIL = 15.0;
    private static final double TAXA_CARRO_FDS = 20.0;
    private static final LocalTime HORARIO_CHECKIN = LocalTime.of(14, 0);
    private static final LocalTime HORARIO_CHECKOUT = LocalTime.of(12, 0);

    // Listar todas as reservas
    @GetMapping
    public List<Reserva> listarTodos() {
        return reservaRepository.findAll();
    }

    // Criar nova reserva
    @PostMapping
    public Reserva criarReserva(@RequestBody Reserva reserva) {
        if (reserva.getHospede() == null || reserva.getHospede().getId() == null) {
            throw new ValidacaoException("Hóspede inválido");
        }

        Hospede hospede = hospedeRepository.findById(reserva.getHospede().getId())
                .orElseThrow(() -> new ValidacaoException("Hóspede não encontrado"));

        Reserva novaReserva = new Reserva();
        novaReserva.setHospede(hospede);
        novaReserva.setDataCheckin(reserva.getDataCheckin());
        novaReserva.setHoraCheckin(reserva.getHoraCheckin());
        novaReserva.setDataCheckout(reserva.getDataCheckout());
        novaReserva.setHoraCheckout(reserva.getHoraCheckout());
        novaReserva.setStatus("RESERVADO");
        novaReserva.setValorTotal(calcularValorReserva(novaReserva));

        return reservaRepository.save(novaReserva);
    }

    // Buscar reservas por hóspede
    @GetMapping("/hospede/{id}")
    public List<Reserva> buscarPorHospede(@PathVariable Long id) {
        Hospede hospede = hospedeRepository.findById(id)
                .orElseThrow(() -> new ValidacaoException("Hóspede não encontrado"));
        return reservaRepository.findByHospede(hospede);
    }

    // Buscar reservas por status
    @GetMapping("/status/{status}")
    public List<Reserva> buscarPorStatus(@PathVariable String status) {
        return reservaRepository.findByStatus(status);
    }

    // CHECK-IN
    @PutMapping("/checkin/{id}")
    public Reserva realizarCheckin(@PathVariable Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ValidacaoException("Reserva não encontrada"));

        if (!reserva.getStatus().equals("RESERVADO")) {
            throw new ValidacaoException("Check-In só é permitido para reservas no status RESERVADO");
        }

        LocalTime now = LocalTime.now();
        LocalTime horaCheckinReserva = reserva.getHoraCheckin() != null ? reserva.getHoraCheckin() : HORARIO_CHECKIN;

        if (now.isBefore(horaCheckinReserva)) {
            throw new ValidacaoException("Check-In só é permitido após o horário da reserva: " + horaCheckinReserva);
        }

        reserva.setStatus("CHECKED_IN");
        return reservaRepository.save(reserva);
    }

    // CHECK-OUT
    @PutMapping("/checkout/{id}")
    public Reserva realizarCheckout(@PathVariable Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ValidacaoException("Reserva não encontrada"));

        if (!reserva.getStatus().equals("CHECKED_IN")) {
            throw new ValidacaoException("Check-Out permitido apenas para hóspedes que já realizaram Check-In");
        }

        double valorTotal = calcularValorReserva(reserva);

        LocalTime horaCheckoutReserva = reserva.getHoraCheckout() != null ? reserva.getHoraCheckout() : HORARIO_CHECKOUT;
        if (LocalTime.now().isAfter(horaCheckoutReserva)) {
            valorTotal *= 1.5; // Multa de atraso
        }

        reserva.setValorTotal(valorTotal);
        reserva.setStatus("CHECKED_OUT");
        return reservaRepository.save(reserva);
    }

    // Cálculo do valor da reserva
    private double calcularValorReserva(Reserva reserva) {
        double total = 0.0;
        LocalDate checkin = reserva.getDataCheckin();
        LocalDate checkout = reserva.getDataCheckout();

        for (LocalDate date = checkin; !date.isAfter(checkout.minusDays(1)); date = date.plusDays(1)) {
            boolean fimDeSemana = date.getDayOfWeek() == DayOfWeek.SATURDAY
                    || date.getDayOfWeek() == DayOfWeek.SUNDAY;
            double diaria = fimDeSemana ? DIARIA_FDS : DIARIA_DIA_UTIL;

            if (reserva.getHospede().isPossuiCarro()) {
                diaria += fimDeSemana ? TAXA_CARRO_FDS : TAXA_CARRO_DIA_UTIL;
            }

            total += diaria;
        }

        return total;
    }
}
