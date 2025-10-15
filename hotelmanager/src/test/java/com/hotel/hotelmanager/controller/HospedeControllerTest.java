package com.hotel.hotelmanager.controller;

import com.hotel.hotelmanager.model.Hospede;
import com.hotel.hotelmanager.repository.HospedeRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HospedeController.class)
class HospedeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HospedeRepository hospedeRepository;

    @Test
    void deveListarTodosHospedes() throws Exception {
        when(hospedeRepository.findAll()).thenReturn(Collections.singletonList(new Hospede()));
        mockMvc.perform(get("/api/hospedes"))
                .andExpect(status().isOk());
        verify(hospedeRepository, times(1)).findAll();
    }

    @Test
    void deveCadastrarHospede() throws Exception {
        Hospede h = new Hospede();
        h.setNome("Bernardo");
        when(hospedeRepository.save(Mockito.any(Hospede.class))).thenReturn(h);

        mockMvc.perform(post("/api/hospedes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nome\":\"Bernardo\",\"documento\":\"123\",\"telefone\":\"999\",\"possuiCarro\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Bernardo"));
    }

    @Test
    void deveAtualizarHospede() throws Exception {
        Hospede existente = new Hospede();
        existente.setId(1L);
        existente.setNome("Antigo");
        when(hospedeRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(hospedeRepository.save(Mockito.any(Hospede.class))).thenReturn(existente);

        mockMvc.perform(put("/api/hospedes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nome\":\"Novo\",\"documento\":\"123\",\"telefone\":\"999\",\"possuiCarro\":false}"))
                .andExpect(status().isOk());
    }

    @Test
    void deveDeletarHospede() throws Exception {
        doNothing().when(hospedeRepository).deleteById(1L);
        mockMvc.perform(delete("/api/hospedes/1"))
                .andExpect(status().isOk());
        verify(hospedeRepository, times(1)).deleteById(1L);
    }

    @Test
    void deveBuscarHospedePorFiltro() throws Exception {
        when(hospedeRepository
                .findByNomeContainingIgnoreCaseOrDocumentoContainingIgnoreCaseOrTelefoneContainingIgnoreCase(
                        "Bern", "Bern", "Bern"))
                .thenReturn(Collections.singletonList(new Hospede()));

        mockMvc.perform(get("/api/hospedes/buscar")
                .param("filtro", "Bern"))
                .andExpect(status().isOk());
    }
}
