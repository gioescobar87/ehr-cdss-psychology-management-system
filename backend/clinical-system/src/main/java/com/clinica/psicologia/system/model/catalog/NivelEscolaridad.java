package com.clinica.psicologia.system.model.catalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "nivel_escolaridad")
public class NivelEscolaridad extends BaseCatalog {
    
}
