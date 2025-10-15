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

    // // Buscar por nome
    // @GetMapping("/nome/{nome}")
    // public List<Hospede> buscarPorNome(@PathVariable String nome) {
    //     return hospedeRepository.findByNomeContainingIgnoreCase(nome);
    // }

    // // Buscar por documento
    // @GetMapping("/documento/{documento}")
    // public List<Hospede> buscarPorDocumento(@PathVariable String documento) {
    //     return hospedeRepository.findByDocumento(documento);
    // }

    // // Buscar por telefone
    // @GetMapping("/telefone/{telefone}")
    // public List<Hospede> buscarPorTelefone(@PathVariable String telefone) {
    //     return hospedeRepository.findByTelefone(telefone);
    // }

    @GetMapping("/buscar")
public List<Hospede> buscar(@RequestParam String filtro) {
    return hospedeRepository
            .findByNomeContainingIgnoreCaseOrDocumentoContainingIgnoreCaseOrTelefoneContainingIgnoreCase(
                    filtro, filtro, filtro
            );
}

    // Atualizar Hóspede
    @PutMapping("/{id}")
    public Hospede atualizar(@PathVariable Long id, @RequestBody Hospede hospede) {
        Hospede existente = hospedeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hóspede não encontrado"));
        existente.setNome(hospede.getNome());
        existente.setDocumento(hospede.getDocumento());
        existente.setTelefone(hospede.getTelefone());
        existente.setPossuiCarro(hospede.isPossuiCarro());
        return hospedeRepository.save(existente);
    }

    // Deletar Hóspede
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        hospedeRepository.deleteById(id);
    }
}
