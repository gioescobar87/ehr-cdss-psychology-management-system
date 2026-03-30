package com.clinica.psicologia.system.model.security;

import com.clinica.psicologia.system.model.base.BaseCatalog;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "permiso")
public class Permiso extends BaseCatalog {
    
}