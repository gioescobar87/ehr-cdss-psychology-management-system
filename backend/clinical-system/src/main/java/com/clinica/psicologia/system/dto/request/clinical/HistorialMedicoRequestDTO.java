package com.clinica.psicologia.system.dto.request.clinical;

import java.time.LocalDate;

public record HistorialMedicoRequestDTO(

        Integer pacienteId,

        Integer condicionMedicaId,

        LocalDate fechaDiagnostico,

        String tratamientoActual,

        String observaciones
) {
}