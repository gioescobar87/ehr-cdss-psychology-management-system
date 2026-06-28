package com.clinica.psicologia.system.dto.request.clinical;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CancelarCitaRequestDTO {

    @NotBlank(message = "El motivo de cancelación es obligatorio")
    private String motivoCancelacion;

}