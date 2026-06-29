package com.clinica.psicologia.system.dto.response.clinical;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IntervencionResponseDTO {
    private Integer id;

    private String nombre;

    private Integer tipoIntervencionId;

    private String tipoIntervencion;

    private String descripcion;

    private Integer estadoId;

    private String estado;
}
