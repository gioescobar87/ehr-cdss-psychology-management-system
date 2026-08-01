package com.clinica.psicologia.system.dto.response.expert_system;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvaluacionCriterioClinicoResponseDTO {

    private Integer id;

    private Integer evaluacionDiagnosticaId;

    private Integer criterioClinicoId;

    private String criterioCodigo;

    private String criterioNombre;

    private Integer categoriaCriterioId;

    private String categoriaCriterio;

    private String observaciones;
}