package com.clinica.psicologia.system.model.security;

import com.clinica.psicologia.system.model.base.BaseCatalog;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "permiso")
public class Permiso extends BaseCatalog {
    
    @ManyToOne
    @JoinColumn(name = "modulo_id")
    private Modulo modulo;
}