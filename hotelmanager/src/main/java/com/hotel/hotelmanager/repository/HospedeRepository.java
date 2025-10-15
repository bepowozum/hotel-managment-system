package com.hotel.hotelmanager.repository;

import com.hotel.hotelmanager.model.Hospede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospedeRepository extends JpaRepository<Hospede, Long> {

     List<Hospede> findByNomeContainingIgnoreCaseOrDocumentoContainingIgnoreCaseOrTelefoneContainingIgnoreCase(
        String nome, String documento, String telefone
    );

}
