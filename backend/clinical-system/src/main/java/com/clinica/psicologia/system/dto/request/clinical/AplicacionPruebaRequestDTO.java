package com.clinica.psicologia.system.dto.request.clinical;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AplicacionPruebaRequestDTO {
    @NotNull
    private Integer sesionId;

    @NotNull
    private Integer pruebaPsicologicaId;

    private String archivoAdjunto;

    private String interpretacion;
}
