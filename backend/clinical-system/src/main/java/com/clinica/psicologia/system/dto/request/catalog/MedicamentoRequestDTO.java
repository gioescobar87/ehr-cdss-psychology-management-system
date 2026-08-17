package com.clinica.psicologia.system.dto.request.catalog;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicamentoRequestDTO {
    @NotBlank
    private String nombre;

    private String nombreComercial;

    private String descripcion;
}
