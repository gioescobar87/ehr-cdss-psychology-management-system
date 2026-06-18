package com.clinica.psicologia.system.dto.request.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OpcionRequestDTO {
    @NotNull(message = "El ID del módulo es obligatorio")
    private Integer moduloId;

    private Integer opcionPadreId;

    @NotBlank(message = "El nombre de la opción es obligatorio")
    private String nombre;

    private String descripcion;

    @NotBlank(message = "La ruta del frontend es obligatoria")
    private String rutaFrontend;

    private String componente;

    private String icono;

    @NotNull(message = "El orden de la opción es obligatorio")
    private Integer orden;

    @NotNull(message = "La visibilidad en el menú es obligatoria")
    private Boolean visibleMenu;

    @NotNull(message = "El campo requiere autenticación es obligatorio")
    private Boolean requiereAutenticacion;

    @NotNull(message = "El menú principal es obligatorio")
    private Boolean esMenuPrincipal;

    @NotNull(message = "El estado es obligatorio")
    private Integer estadoId;
}
