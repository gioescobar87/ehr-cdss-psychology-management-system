package com.clinica.psicologia.system.dto.request.clinical;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotaSesionRequestDTO {
    @NotNull(message = "La sesión es obligatoria")
    private Integer sesionId;

    @NotBlank(message = "El contenido es obligatorio")
    private String contenido;

    @Size(max = 100)
    private String tipoNota;
}
