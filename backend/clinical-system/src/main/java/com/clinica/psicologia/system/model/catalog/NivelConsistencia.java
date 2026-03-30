package com.clinica.psicologia.system.model.catalog;

import com.clinica.psicologia.system.model.base.BaseCatalog;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "nivel_consistencia")
public class NivelConsistencia extends BaseCatalog {
    
}
