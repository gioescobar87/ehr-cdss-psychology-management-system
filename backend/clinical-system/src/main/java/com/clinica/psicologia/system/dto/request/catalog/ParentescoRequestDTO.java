package com.clinica.psicologia.system.dto.request.catalog;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParentescoRequestDTO {
    @NotBlank
    private String nombre;
}
