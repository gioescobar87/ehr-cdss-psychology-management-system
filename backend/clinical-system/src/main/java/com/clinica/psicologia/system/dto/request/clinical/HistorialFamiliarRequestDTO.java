package com.clinica.psicologia.system.dto.request.clinical;

public record HistorialFamiliarRequestDTO(
    Integer pacienteId,
    Integer condicionMedicaId,
    Integer parentescoId,
    String observaciones
) {
    
}
