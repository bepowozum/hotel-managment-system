package com.hotel.hotelmanager.model;

import jakarta.persistence.*;

@Entity
public class Hospede {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String documento;
    private String telefone;
    private boolean possuiCarro;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public boolean isPossuiCarro() { return possuiCarro; }
    public void setPossuiCarro(boolean possuiCarro) { this.possuiCarro = possuiCarro; }
}
