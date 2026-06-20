package com.clinica.psicologia.system.model.catalog;

import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import com.clinica.psicologia.system.model.base.BaseCatalog;

import jakarta.persistence.Entity;

@Getter
@Setter
@Entity
@Table(name = "nivel_severidad_alergias")
public class NivelSeveridadAlergia extends BaseCatalog {
    
}
