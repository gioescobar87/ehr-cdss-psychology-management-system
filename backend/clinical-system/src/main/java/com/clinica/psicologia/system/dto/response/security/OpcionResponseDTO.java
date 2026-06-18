package com.clinica.psicologia.system.dto.response.security;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OpcionResponseDTO {
    private Integer id;

    private Integer moduloId;

    private Integer opcionPadreId;

    private String nombre;

    private String descripcion;

    private String rutaFrontend;

    private String componente;

    private String icono;

    private Integer orden;

    private Boolean visibleMenu;

    private Boolean requiereAutenticacion;

    private Boolean esMenuPrincipal;

    private Integer estadoId;

    private String estado;
}
