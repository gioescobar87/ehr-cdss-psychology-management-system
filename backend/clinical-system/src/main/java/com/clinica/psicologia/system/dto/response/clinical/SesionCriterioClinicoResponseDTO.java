package com.clinica.psicologia.system.dto.response.clinical;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SesionCriterioClinicoResponseDTO {

    private Integer id;

    private Integer sesionId;

    private Integer criterioClinicoId;

    private String criterioCodigo;

    private String criterioNombre;

    private Integer categoriaCriterioClinicoId;

    private String categoriaCriterioClinico;

    private Boolean presente;
}