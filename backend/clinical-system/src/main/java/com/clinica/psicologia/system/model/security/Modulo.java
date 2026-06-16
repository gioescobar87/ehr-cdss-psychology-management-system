package com.clinica.psicologia.system.model.security;

import com.clinica.psicologia.system.model.base.BaseCatalog;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "modulo")
@Getter
@Setter
public class Modulo extends BaseCatalog {
}