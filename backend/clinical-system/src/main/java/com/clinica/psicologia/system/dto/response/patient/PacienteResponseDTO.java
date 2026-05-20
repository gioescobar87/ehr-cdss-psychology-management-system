package com.clinica.psicologia.system.dto.response.patient;

public record PacienteResponseDTO(
    Integer id,
    String nombreCompleto,
    String sexo,
    Integer edad
) {
    
}
