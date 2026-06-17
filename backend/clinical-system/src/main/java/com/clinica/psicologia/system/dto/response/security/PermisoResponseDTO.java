package com.clinica.psicologia.system.dto.response.security;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermisoResponseDTO {

    private Integer id;

    private String nombre;

    private String descripcion;

    private Integer estadoId;

    private String estado;
}