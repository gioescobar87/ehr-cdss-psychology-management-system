package com.clinica.psicologia.system.dto.request.clinical;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IntervencionRequestDTO {
    @NotBlank
    private String nombre;

    @NotNull
    private Integer tipoIntervencionId;

    private String descripcion;
}
