package com.clinica.psicologia.system.dto.response.clinical;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SesionIntervencionResponseDTO {
    private Integer id;

    private Integer sesionId;

    private Integer intervencionId;

    private String intervencion;

    private Integer tipoIntervencionId;

    private String tipoIntervencion;
}
