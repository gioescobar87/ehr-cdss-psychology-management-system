package com.clinica.psicologia.system.dto.response.expert_system;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvaluacionDiagnosticaResponseDTO {

    private Integer id;

    private Integer sesionId;

    private Integer arbolDiagnosticoId;

    private String arbolDiagnostico;

    private Integer diagnosticoFinalId;

    private String diagnosticoFinal;

    private Integer diagnosticoSugeridoId;

    private String diagnosticoSugerido;

    private Integer usuarioId;

    private String usuario;

    private Integer versionArbol;

    private Boolean diagnosticoConfirmado;

    private String observacionesSistema;

    private LocalDateTime fechaEvaluacion;

    private LocalDateTime fechaInferencia;

    private Integer tiempoInferenciaMs;

    private Integer estadoId;

    private String estado;
}