package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ObjetivoTerapiaResponseDTO {

    private Integer id;

    private Integer planTratamientoId;

    private Integer pacienteDiagnosticoId;

    private Integer pacienteId;

    private String pacienteNombre;

    private String descripcion;

    private LocalDate fechaInicio;

    private LocalDate fechaMeta;

    private Integer estadoId;

    private String estado;

}