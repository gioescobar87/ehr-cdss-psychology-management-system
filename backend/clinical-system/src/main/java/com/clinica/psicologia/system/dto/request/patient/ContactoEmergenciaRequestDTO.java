package com.clinica.psicologia.system.dto.request.patient;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactoEmergenciaRequestDTO {
    
    Integer pacienteId;

    @NotBlank(message = "El nombre es obligatorio")
    String nombre;

    Integer parentesco;

    @NotBlank(message = "El teléfono es obligatorio")
    String telefono;

    @NotBlank(message = "La dirección es obligatoria")
    String direccion;

    String observaciones;
}
