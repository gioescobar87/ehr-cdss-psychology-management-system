package com.clinica.psicologia.system.serv_implementation.patient;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.patient.PacienteHistorialRequestDTO;
import com.clinica.psicologia.system.dto.request.patient.PacienteHistorialRequestDTO.HistorialFamiliarItem;
import com.clinica.psicologia.system.dto.request.patient.PacienteHistorialRequestDTO.HistorialMedicoItem;
import com.clinica.psicologia.system.dto.request.patient.PacienteHistorialRequestDTO.PacienteAlergiaItem;
import com.clinica.psicologia.system.dto.request.patient.PacienteHistorialRequestDTO.PacienteMedicamentoItem;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.HistorialFamiliarService;
import com.clinica.psicologia.system.service.clinical.HistorialMedicoService;
import com.clinica.psicologia.system.service.patient.PacienteAlergiaService;
import com.clinica.psicologia.system.service.patient.PacienteMedicamentoService;
import com.clinica.psicologia.system.service.patient.PacienteHistorialService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteHistorialServiceImpl implements PacienteHistorialService {
    private final PacienteRepository pacienteRepository;
    private final HistorialMedicoService historialMedicoService;
    private final HistorialFamiliarService historialFamiliarService;
    private final PacienteAlergiaService pacienteAlergiaService;
    private final PacienteMedicamentoService pacienteMedicamentoService;

    @Override
    public void actualizar(Integer pacienteId, PacienteHistorialRequestDTO request) {
        if (!pacienteRepository.existsById(pacienteId)) {
            throw new ResourceNotFoundException("Paciente no encontrado: " + pacienteId);
        }

        for (HistorialMedicoItem item : safe(request.antecedentesMedicos())) {
            if (item.id() == null) historialMedicoService.crear(item.toRequest(pacienteId));
            else historialMedicoService.actualizar(item.id(), item.toRequest(pacienteId));
        }
        for (HistorialFamiliarItem item : safe(request.antecedentesFamiliares())) {
            if (item.id() == null) historialFamiliarService.crear(item.toRequest(pacienteId));
            else historialFamiliarService.actualizar(item.id(), item.toRequest(pacienteId));
        }
        for (PacienteAlergiaItem item : safe(request.alergias())) {
            if (item.id() == null) pacienteAlergiaService.create(item.toRequest(pacienteId));
            else pacienteAlergiaService.update(item.id(), item.toRequest(pacienteId));
        }
        for (PacienteMedicamentoItem item : safe(request.medicamentos())) {
            if (item.id() == null) pacienteMedicamentoService.create(item.toRequest(pacienteId));
            else pacienteMedicamentoService.update(item.id(), item.toRequest(pacienteId));
        }

        for (Integer id : safe(request.eliminarAntecedentesMedicos())) historialMedicoService.desactivar(id);
        for (Integer id : safe(request.eliminarAntecedentesFamiliares())) historialFamiliarService.desactivar(id);
        for (Integer id : safe(request.eliminarAlergias())) pacienteAlergiaService.delete(id);
        for (Integer id : safe(request.eliminarMedicamentos())) pacienteMedicamentoService.delete(id);
    }

    private <T> List<T> safe(List<T> values) {
        return values == null ? List.of() : values;
    }
}
