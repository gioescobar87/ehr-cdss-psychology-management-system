package com.clinica.psicologia.system.dto.request.patient;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactoEmergenciaRequestDTO {
    
    private Integer pacienteId;

    private @NotBlank(message = "El nombre es obligatorio")
    String nombre;

    private Integer parentescoId;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;

    private String observaciones;

    @NotNull(message = "El estado es obligatorio")
    private Integer estadoId;
}
