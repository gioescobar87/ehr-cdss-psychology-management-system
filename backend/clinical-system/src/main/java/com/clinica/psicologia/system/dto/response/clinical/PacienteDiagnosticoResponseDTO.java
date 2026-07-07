package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PacienteDiagnosticoResponseDTO {

    private Integer id;

    private Integer pacienteId;

    private String pacienteNombre;

    private Integer diagnosticoId;

    private String diagnostico;

    private String codigoDsm;

    private Integer categoriaDiagnosticaId;

    private String categoriaDiagnostica;

    private Integer sesionId;

    private LocalDate fechaDiagnostico;

    private Integer estadoId;

    private String estado;
}