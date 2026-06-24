package com.clinica.psicologia.system.serv_implementation.patient;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.patient.PacienteAlergiaRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteAlergiaResponseDTO;
import com.clinica.psicologia.system.mapper.patient.PacienteAlergiaMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.NivelSeveridadAlergia;
import com.clinica.psicologia.system.model.catalog.SustanciaAlergena;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.patient.PacienteAlergia;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.NivelSeveridadAlergiaRepository;
import com.clinica.psicologia.system.repository.catalog.SustanciaAlergenaRepository;
import com.clinica.psicologia.system.repository.patient.PacienteAlergiaRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.patient.PacienteAlergiaService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteAlergiaServiceImpl
        implements PacienteAlergiaService {

    private final PacienteAlergiaRepository repository;
    private final PacienteRepository pacienteRepository;
    private final SustanciaAlergenaRepository sustanciaRepository;
    private final NivelSeveridadAlergiaRepository severidadRepository;
    private final EstadoRepository estadoRepository;
    private final PacienteAlergiaMapper mapper;

    @Override
    public PacienteAlergiaResponseDTO create(
            PacienteAlergiaRequestDTO dto) {

        Paciente paciente = pacienteRepository
                .findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Paciente no encontrado: " + dto.getPacienteId()));

        SustanciaAlergena sustancia = sustanciaRepository
                .findById(dto.getSustanciaAlergenaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sustancia alergena no encontrada: "
                                + dto.getSustanciaAlergenaId()));

        Estado estadoActivo = estadoRepository
                .findById(1)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Estado ACTIVO no encontrado"));

        NivelSeveridadAlergia severidad = null;

        if (dto.getNivelSeveridadAlergiaId() != null) {

            severidad = severidadRepository
                    .findById(dto.getNivelSeveridadAlergiaId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Nivel de severidad no encontrado: "
                                    + dto.getNivelSeveridadAlergiaId()));
        }

        PacienteAlergia entity = new PacienteAlergia();

        entity.setPaciente(paciente);
        entity.setSustanciaAlergena(sustancia);
        entity.setNivelSeveridadAlergia(severidad);
        entity.setTipoReaccion(dto.getTipoReaccion());
        entity.setObservaciones(dto.getObservaciones());
        entity.setEstado(estadoActivo);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PacienteAlergiaResponseDTO> findAll() {

        return mapper.toResponseDTOList(
                repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public PacienteAlergiaResponseDTO findById(
            Integer id) {

        PacienteAlergia entity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Alergia no encontrada: " + id));

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PacienteAlergiaResponseDTO> getByPatient(
            Integer pacienteId) {

        return mapper.toResponseDTOList(
                repository.findByPacienteId(pacienteId));
    }

    public void updateEntity(
            PacienteAlergia entity,
            PacienteAlergiaRequestDTO dto) {

        entity.setTipoReaccion(dto.getTipoReaccion());
        entity.setObservaciones(dto.getObservaciones());
    }

    @Override
    public PacienteAlergiaResponseDTO update(Integer id, PacienteAlergiaRequestDTO dto) {

        PacienteAlergia entity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Alergia no encontrada: " + id));

        SustanciaAlergena sustancia = sustanciaRepository
                .findById(dto.getSustanciaAlergenaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sustancia alergena no encontrada: " + dto.getSustanciaAlergenaId()));

        NivelSeveridadAlergia severidad = null;

        if (dto.getNivelSeveridadAlergiaId() != null) {

            severidad = severidadRepository
                    .findById(dto.getNivelSeveridadAlergiaId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Nivel de severidad no encontrado: " + dto.getNivelSeveridadAlergiaId()));
        }

        entity.setSustanciaAlergena(sustancia);
        entity.setNivelSeveridadAlergia(severidad);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void changeStatus(
            Integer id,
            Integer estadoId) {

        PacienteAlergia entity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Alergia no encontrada"));

        Estado estado = estadoRepository
                .findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Estado no encontrado"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(Integer id) {

        PacienteAlergia entity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Alergia no encontrada"));

        repository.delete(entity);
    }
}