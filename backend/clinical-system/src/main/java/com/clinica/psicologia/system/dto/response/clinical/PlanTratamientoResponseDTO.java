package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlanTratamientoResponseDTO {

    private Integer id;

    private Integer pacienteDiagnosticoId;

    private Integer pacienteId;

    private String pacienteNombre;

    private Integer diagnosticoId;

    private String diagnostico;

    private String codigoDsm;

    private String descripcionGeneral;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private Integer estadoId;

    private String estado;
}