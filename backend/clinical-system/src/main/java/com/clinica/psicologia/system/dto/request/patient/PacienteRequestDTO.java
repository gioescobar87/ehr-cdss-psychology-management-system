package com.clinica.psicologia.system.dto.request.patient;

import java.time.LocalDate;

public record PacienteRequestDTO(
    String nombre,
    String apellido,
    LocalDate fechaNacimiento,
    Long estadoCivilId,
    Long nivelEscolaridadId
) {
    
}
