package com.clinica.psicologia.system.dto.response.security;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RolOpcionResponseDTO {
    private Integer id;

    private Integer rolId;

    private Integer opcionId;

    private String opcion;

    private Boolean visible;

    private Integer estadoId;

    private String estado;
}
