package com.clinica.psicologia.system.serv_implementation.clinical;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.PacienteDiagnosticoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.PacienteDiagnosticoResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.PacienteDiagnosticoMapper;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.clinical.PacienteDiagnostico;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.repository.catalog.DiagnosticoRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.clinical.PacienteDiagnosticoRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.PacienteDiagnosticoService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteDiagnosticoServiceImpl implements PacienteDiagnosticoService {

    private final PacienteDiagnosticoRepository repository;
    private final PacienteRepository pacienteRepository;
    private final DiagnosticoRepository diagnosticoRepository;
    private final SesionRepository sesionRepository;
    private final EstadoRepository estadoRepository;
    private final PacienteDiagnosticoMapper mapper;

    @Override
    public PacienteDiagnosticoResponseDTO create(PacienteDiagnosticoRequestDTO dto) {

        Paciente paciente = pacienteRepository
                .findById(dto.getPacienteId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Patient not found"));

        Diagnostico diagnostico = diagnosticoRepository
                .findById(dto.getDiagnosticoId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Diagnosis not found"));

        Estado estado = estadoRepository
                .findById(dto.getEstadoId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "State not found"));

        Sesion sesion = null;

        if (dto.getSesionId() != null) {
            sesion = sesionRepository
                    .findById(dto.getSesionId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Session not found"));
        }

        PacienteDiagnostico entity =
                new PacienteDiagnostico();

        entity.setPaciente(paciente);
        entity.setDiagnostico(diagnostico);
        entity.setSesion(sesion);
        entity.setEstado(estado);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PacienteDiagnosticoResponseDTO> findAll() {

        return mapper.toResponseDTOList(
                repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public PacienteDiagnosticoResponseDTO findById(
            Integer id) {

        PacienteDiagnostico entity =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Patient diagnosis not found"));

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PacienteDiagnosticoResponseDTO> getByPatient(
            Integer pacienteId) {

        return mapper.toResponseDTOList(
                repository.findByPacienteId(pacienteId));
    }

    @Override
    public PacienteDiagnosticoResponseDTO update(
            Integer id,
            PacienteDiagnosticoRequestDTO dto) {

        PacienteDiagnostico entity =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Patient diagnosis not found"));

        Diagnostico diagnostico =
                diagnosticoRepository.findById(
                        dto.getDiagnosticoId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Diagnosis not found"));

        Estado estado =
                estadoRepository.findById(
                        dto.getEstadoId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "State not found"));

        Sesion sesion = null;

        if (dto.getSesionId() != null) {
            sesion = sesionRepository
                    .findById(dto.getSesionId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Session not found"));
        }

        entity.setDiagnostico(diagnostico);
        entity.setSesion(sesion);
        entity.setEstado(estado);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void changeStatus(
            Integer id,
            Integer estadoId) {

        PacienteDiagnostico entity =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Patient diagnosis not found"));

        Estado estado =
                estadoRepository.findById(estadoId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "State not found"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(
            Integer id) {

        PacienteDiagnostico entity =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Patient diagnosis not found"));

        repository.delete(entity);
    }
}