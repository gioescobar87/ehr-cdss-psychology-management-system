package com.clinica.psicologia.system.dto.response.clinical;

public record HistorialFamiliarResponseDTO(
    Integer id,
    Integer condicionMedicaId,
    String condicionMedica,
    Integer parentescoId,
    String parentesco,
    String observaciones
) {
    
}
