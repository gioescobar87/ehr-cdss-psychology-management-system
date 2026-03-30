package com.clinica.psicologia.system.model.catalog;

import com.clinica.psicologia.system.model.base.BaseCatalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "condicion_medica")
public class CondicionMedica extends BaseCatalog {
    @Column(name = "codigo_referencia")
    private String codigoReferencia;
}
