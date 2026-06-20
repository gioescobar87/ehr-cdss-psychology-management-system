package com.clinica.psicologia.system.dto.response.catalog;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TipoSesionResponseDTO {
    private Integer id;

    private String nombre;

    private String descripcion;

    private Integer estadoId;

    private String estado;
}
