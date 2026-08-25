package com.clinica.psicologia.system.dto.request.patient;

import java.time.LocalDate;
import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.HistorialFamiliarRequestDTO;
import com.clinica.psicologia.system.dto.request.clinical.HistorialMedicoRequestDTO;

public record PacienteHistorialRequestDTO(
        List<HistorialMedicoItem> antecedentesMedicos,
        List<HistorialFamiliarItem> antecedentesFamiliares,
        List<PacienteAlergiaItem> alergias,
        List<PacienteMedicamentoItem> medicamentos,
        List<Integer> eliminarAntecedentesMedicos,
        List<Integer> eliminarAntecedentesFamiliares,
        List<Integer> eliminarAlergias,
        List<Integer> eliminarMedicamentos) {

    public record HistorialMedicoItem(
            Integer id,
            Integer condicionMedicaId,
            LocalDate fechaDiagnostico,
            String tratamientoActual,
            String observaciones) {
        public HistorialMedicoRequestDTO toRequest(Integer pacienteId) {
            return new HistorialMedicoRequestDTO(pacienteId, condicionMedicaId,
                    fechaDiagnostico, tratamientoActual, observaciones);
        }
    }

    public record HistorialFamiliarItem(
            Integer id,
            Integer condicionMedicaId,
            Integer parentescoId,
            String observaciones) {
        public HistorialFamiliarRequestDTO toRequest(Integer pacienteId) {
            return new HistorialFamiliarRequestDTO(pacienteId, condicionMedicaId,
                    parentescoId, observaciones);
        }
    }

    public record PacienteAlergiaItem(
            Integer id,
            Integer sustanciaAlergenaId,
            Integer nivelSeveridadAlergiaId,
            String tipoReaccion,
            String observaciones,
            Integer estadoId) {
        public PacienteAlergiaRequestDTO toRequest(Integer pacienteId) {
            PacienteAlergiaRequestDTO request = new PacienteAlergiaRequestDTO();
            request.setPacienteId(pacienteId);
            request.setSustanciaAlergenaId(sustanciaAlergenaId);
            request.setNivelSeveridadAlergiaId(nivelSeveridadAlergiaId);
            request.setTipoReaccion(tipoReaccion);
            request.setObservaciones(observaciones);
            request.setEstadoId(estadoId);
            return request;
        }
    }

    public record PacienteMedicamentoItem(
            Integer id,
            Integer medicamentoId,
            String dosis,
            String frecuencia,
            String viaAdministracion,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            String prescritoPor) {
        public PacienteMedicamentoRequestDTO toRequest(Integer pacienteId) {
            PacienteMedicamentoRequestDTO request = new PacienteMedicamentoRequestDTO();
            request.setPacienteId(pacienteId);
            request.setMedicamentoId(medicamentoId);
            request.setDosis(dosis);
            request.setFrecuencia(frecuencia);
            request.setViaAdministracion(viaAdministracion);
            request.setFechaInicio(fechaInicio);
            request.setFechaFin(fechaFin);
            request.setPrescritoPor(prescritoPor);
            return request;
        }
    }
}
