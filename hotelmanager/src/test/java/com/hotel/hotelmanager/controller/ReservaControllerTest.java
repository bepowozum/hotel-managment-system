package com.hotel.hotelmanager.controller;

import com.hotel.hotelmanager.exception.ValidacaoException;
import com.hotel.hotelmanager.model.Hospede;
import com.hotel.hotelmanager.model.Reserva;
import com.hotel.hotelmanager.repository.HospedeRepository;
import com.hotel.hotelmanager.repository.ReservaRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservaController.class)
class ReservaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReservaRepository reservaRepository;

    @MockBean
    private HospedeRepository hospedeRepository;

    @Test
    void deveCriarReservaComSucesso() throws Exception {
        Hospede h = new Hospede();
        h.setId(1L);
        h.setPossuiCarro(true);

        when(hospedeRepository.findById(1L)).thenReturn(Optional.of(h));
        when(reservaRepository.save(Mockito.any(Reserva.class))).thenAnswer(i -> i.getArguments()[0]);

        mockMvc.perform(post("/reservas")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"hospede\":{\"id\":1},\"dataCheckin\":\"2025-10-10\",\"dataCheckout\":\"2025-10-12\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void deveRetornarErroQuandoHospedeInvalido() throws Exception {
        mockMvc.perform(post("/reservas")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"hospede\":null}"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void deveListarTodasReservas() throws Exception {
        when(reservaRepository.findAll()).thenReturn(Collections.singletonList(new Reserva()));
        mockMvc.perform(get("/reservas"))
                .andExpect(status().isOk());
    }

    @Test
    void deveBuscarReservaPorHospede() throws Exception {
        Hospede h = new Hospede();
        h.setId(1L);
        when(hospedeRepository.findById(1L)).thenReturn(Optional.of(h));
        when(reservaRepository.findByHospede(h)).thenReturn(Collections.singletonList(new Reserva()));

        mockMvc.perform(get("/reservas/hospede/1"))
                .andExpect(status().isOk());
    }

    @Test
    void deveBuscarReservaPorStatus() throws Exception {
        when(reservaRepository.findByStatus("RESERVADO")).thenReturn(Collections.singletonList(new Reserva()));
        mockMvc.perform(get("/reservas/status/RESERVADO"))
                .andExpect(status().isOk());
    }

    @Test
    void deveRealizarCheckinComSucesso() throws Exception {
        Reserva r = new Reserva();
        r.setId(1L);
        r.setStatus("RESERVADO");
        r.setHoraCheckin(LocalTime.of(0, 0));

        when(reservaRepository.findById(1L)).thenReturn(Optional.of(r));
        when(reservaRepository.save(Mockito.any(Reserva.class))).thenReturn(r);

        mockMvc.perform(put("/reservas/checkin/1"))
                .andExpect(status().isOk());
    }

    @Test
    void deveRealizarCheckoutComSucesso() throws Exception {
        Reserva r = new Reserva();
        r.setId(1L);
        r.setStatus("CHECKED_IN");
        r.setDataCheckin(LocalDate.now());
        r.setDataCheckout(LocalDate.now());
        r.setHoraCheckout(LocalTime.of(23, 59));

        when(reservaRepository.findById(1L)).thenReturn(Optional.of(r));
        when(reservaRepository.save(Mockito.any(Reserva.class))).thenReturn(r);

        mockMvc.perform(put("/reservas/checkout/1"))
                .andExpect(status().isOk());
    }
}
