package com.clinica.psicologia.system.model.catalog;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "categoria_diagnostica")
public class CategoriaDiagnostica extends BaseCatalog {
    
}
