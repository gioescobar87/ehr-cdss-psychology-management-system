package com.clinica.psicologia.system.dto.response.clinical_context;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ClinicalContextObjectiveDTO {

    private Integer id;

    private String descripcion;

    private LocalDate fechaInicio;

    private LocalDate fechaMeta;

    private String estado;
}