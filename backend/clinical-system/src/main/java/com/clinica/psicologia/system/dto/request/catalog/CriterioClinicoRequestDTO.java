package com.clinica.psicologia.system.dto.request.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CriterioClinicoRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200)
    private String nombre;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 50)
    private String codigo;

    private String descripcion;

    @NotNull(message = "La categoría es obligatoria")
    private Integer categoriaCriterioClinicoId;

    @NotNull(message = "El estado es obligatorio")
    private Integer estadoId;
}