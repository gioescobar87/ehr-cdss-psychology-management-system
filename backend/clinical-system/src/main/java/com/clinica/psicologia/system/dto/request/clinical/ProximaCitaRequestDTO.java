package com.clinica.psicologia.system.dto.request.clinical;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProximaCitaRequestDTO {
    @NotNull(message = "La cita es obligatoria.")
    private Integer citaId;
}
