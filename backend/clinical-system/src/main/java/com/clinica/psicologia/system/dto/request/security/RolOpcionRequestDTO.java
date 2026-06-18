package com.clinica.psicologia.system.dto.request.security;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RolOpcionRequestDTO {
    @NotNull
    private Integer opcionId;

    @NotNull
    private Boolean visible;

    @NotNull
    private Integer estadoId;
}
