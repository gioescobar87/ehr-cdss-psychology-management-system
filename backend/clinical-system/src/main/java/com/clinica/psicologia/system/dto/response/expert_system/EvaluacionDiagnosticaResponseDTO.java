package com.clinica.psicologia.system.dto.response.expert_system;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvaluacionDiagnosticaResponseDTO {

    private Integer id;

    private Integer sesionId;

    private Integer diagnosticoSugeridoId;

    private String diagnosticoSugerido;

    private Integer diagnosticoSeleccionadoId;

    private String diagnosticoSeleccionado;

    private Integer diagnosticoFinalId;

    private String diagnosticoFinal;

    private Integer usuarioId;

    private String usuario;

    private Boolean diagnosticoConfirmado;

    private Integer concordanciaDiagnostica;

    private LocalDateTime fechaHoraInferencia;
}