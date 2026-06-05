package com.clinica.psicologia.system.dto.request.clinical;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record HistorialMedicoRequestDTO(

        @NotNull(message = "El ID del paciente es obligatorio")
        Integer pacienteId,

        @NotNull(message = "El ID de la condición médica es obligatorio")
        Integer condicionMedicaId,

        @NotNull(message = "La fecha de diagnóstico es obligatoria")
        LocalDate fechaDiagnostico,

        @NotBlank(message = "El tratamiento actual es obligatorio")
        String tratamientoActual,

        String observaciones
) {
}
