package com.clinica.psicologia.system.dto.response.clinical_context;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ClinicalContextPsychologicalTestDTO {

    private Integer id;

    private Integer pruebaPsicologicaId;

    private String pruebaNombre;

    private LocalDate fechaAplicacion;
}