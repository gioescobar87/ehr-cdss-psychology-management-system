package com.clinica.psicologia.system.serv_implementation.clinical;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.HistorialFamiliarRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.HistorialFamiliarResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.HistorialFamiliarMapper;
import com.clinica.psicologia.system.model.catalog.CondicionMedica;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.Parentesco;
import com.clinica.psicologia.system.model.clinical.HistorialFamiliar;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.repository.catalog.CondicionMedicaRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.ParentescoRepository;
import com.clinica.psicologia.system.repository.clinical.HistorialFamiliarRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.service.clinical.HistorialFamiliarService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HistorialFamiliarServiceImpl
        implements HistorialFamiliarService {

    private final HistorialFamiliarRepository historialFamiliarRepository;

    private final PacienteRepository pacienteRepository;

    private final CondicionMedicaRepository condicionMedicaRepository;

    private final ParentescoRepository parentescoRepository;

    private final EstadoRepository estadoRepository;

    private final HistorialFamiliarMapper historialFamiliarMapper;

    /* =====================================================
       CREAR HISTORIAL FAMILIAR
       ===================================================== */
    @Override
    public HistorialFamiliarResponseDTO crear(
            HistorialFamiliarRequestDTO dto) {

        Paciente paciente = pacienteRepository.findById(dto.pacienteId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Paciente no encontrado: "
                                        + dto.pacienteId()));

        CondicionMedica condicionMedica =
                condicionMedicaRepository.findById(
                                dto.condicionMedicaId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Condición médica no encontrada: "
                                                + dto.condicionMedicaId()));

        Parentesco parentesco =
                parentescoRepository.findById(dto.parentescoId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Parentesco no encontrado: "
                                                + dto.parentescoId()));

        Estado estadoActivo = estadoRepository.findById(1)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Estado ACTIVO no encontrado"));

        HistorialFamiliar historial =
                historialFamiliarMapper.toEntity(dto);

        historial.setPaciente(paciente);
        historial.setCondicionMedica(condicionMedica);
        historial.setParentesco(parentesco);
        historial.setEstado(estadoActivo);

        historial = historialFamiliarRepository.save(historial);

        return historialFamiliarMapper.toResponse(historial);
    }

    /* =====================================================
       OBTENER HISTORIAL POR PACIENTE
       ===================================================== */
    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<HistorialFamiliarResponseDTO>
            obtenerPorPaciente(Integer pacienteId) {

        return historialFamiliarRepository
                .findByPacienteId(pacienteId)
                .stream()
                .map(historialFamiliarMapper::toResponse)
                .toList();
    }

    @Override
    public HistorialFamiliarResponseDTO actualizar(Integer id, HistorialFamiliarRequestDTO dto) {
        HistorialFamiliar historial = historialFamiliarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Historial familiar no encontrado: " + id));

        historial.setCondicionMedica(condicionMedicaRepository.findById(dto.condicionMedicaId())
                .orElseThrow(() -> new RuntimeException("Condición médica no encontrada")));
        historial.setParentesco(parentescoRepository.findById(dto.parentescoId())
                .orElseThrow(() -> new RuntimeException("Parentesco no encontrado")));
        historial.setObservaciones(dto.observaciones());

        return historialFamiliarMapper.toResponse(historialFamiliarRepository.save(historial));
    }

    @Override
    public void desactivar(Integer id) {
        HistorialFamiliar historial = historialFamiliarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Historial familiar no encontrado: " + id));
        historial.setEstado(estadoRepository.findById(2)
                .orElseThrow(() -> new RuntimeException("Estado INACTIVO no encontrado")));
        historialFamiliarRepository.save(historial);
    }
}