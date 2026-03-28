package com.clinica.psicologia.system.model.security;
import com.clinica.psicologia.system.model.catalog.BaseCatalog;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "rol")
@Getter
@Setter
public class Rol extends BaseCatalog {
    
}
