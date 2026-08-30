package com.clinica.psicologia.system.dto.request.patient;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CerrarCasoRequestDTO {

    @NotBlank(message = "El motivo de cierre es obligatorio")
    private String motivoCierre;
}
