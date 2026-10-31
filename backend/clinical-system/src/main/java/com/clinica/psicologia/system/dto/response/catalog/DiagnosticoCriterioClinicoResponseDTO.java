package com.clinica.psicologia.system.dto.response.catalog;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiagnosticoCriterioClinicoResponseDTO {

    private Integer id;

    private Integer diagnosticoId;

    private String diagnostico;

    private Integer criterioClinicoId;

    private String criterioClinico;

    private String referenciaRegla;
}
