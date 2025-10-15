package com.hotel.hotelmanager.controller;

import com.hotel.hotelmanager.model.Hospede;
import com.hotel.hotelmanager.repository.HospedeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hospedes")
public class HospedeController {

    @Autowired
    private HospedeRepository hospedeRepository;

    // Listar todos os hóspedes
    @GetMapping
    public List<Hospede> listarTodos() {
        return hospedeRepository.findAll();
    }

    // Cadastrar novo hóspede
    @PostMapping
    public Hospede cadastrar(@RequestBody Hospede hospede) {
        return hospedeRepository.save(hospede);
    }

    @GetMapping("/buscar")
    public List<Hospede> buscar(@RequestParam String filtro) {
        return hospedeRepository
                .findByNomeContainingIgnoreCaseOrDocumentoContainingIgnoreCaseOrTelefoneContainingIgnoreCase(
                        filtro, filtro, filtro);
    }
}
