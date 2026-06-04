package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDate;

public record HistorialMedicoResponseDTO(
    Integer id,
    String condicionMedica,
    LocalDate fechaDiagnostico,
    String tratamientoActual,
    String observaciones
) {
    
}
