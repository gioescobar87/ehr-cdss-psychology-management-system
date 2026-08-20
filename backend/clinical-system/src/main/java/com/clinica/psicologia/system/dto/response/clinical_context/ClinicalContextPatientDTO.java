package com.clinica.psicologia.system.dto.response.clinical_context;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ClinicalContextPatientDTO {

    private Integer id;

    private String nombre;

    private String apellido;

    private String dpi;

    private LocalDate fechaNacimiento;

    private String sexo;

    private String telefono;

    private String direccion;

    private String estadoCivil;

    private String nivelEscolaridad;

    private String ocupacion;
}