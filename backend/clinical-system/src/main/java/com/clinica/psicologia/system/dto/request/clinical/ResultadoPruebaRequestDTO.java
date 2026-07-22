package com.clinica.psicologia.system.dto.request.clinical;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultadoPruebaRequestDTO {

    @NotNull(message = "La prueba psicológica es obligatoria.")
    private Integer pruebaPsicologicaId;

    @NotBlank(message = "El parámetro es obligatorio.")
    @Size(max = 200)
    private String parametro;

    @Size(max = 200)
    private String valor;

    @Size(max = 50)
    private String unidadMedida;

    private String observaciones;

}