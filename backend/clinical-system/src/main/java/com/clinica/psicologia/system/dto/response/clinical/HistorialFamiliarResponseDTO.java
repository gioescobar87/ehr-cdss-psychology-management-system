package com.clinica.psicologia.system.dto.response.clinical;

public record HistorialFamiliarResponseDTO(
    Integer id,
    String condicionMedica,
    String parentesco,
    String observaciones
) {
    
}
