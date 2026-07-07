package com.clinica.psicologia.system.serv_implementation.clinical;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.PlanTratamientoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.PlanTratamientoResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.PlanTratamientoMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.clinical.PacienteDiagnostico;
import com.clinica.psicologia.system.model.clinical.PlanTratamiento;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.clinical.PacienteDiagnosticoRepository;
import com.clinica.psicologia.system.repository.clinical.PlanTratamientoRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.PlanTratamientoService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PlanTratamientoServiceImpl implements PlanTratamientoService {

    private final PlanTratamientoRepository repository;
    private final PacienteDiagnosticoRepository pacienteDiagnosticoRepository;
    private final EstadoRepository estadoRepository;
    private final PlanTratamientoMapper mapper;

    @Override
    public PlanTratamientoResponseDTO create(PlanTratamientoRequestDTO dto) {

        PacienteDiagnostico pacienteDiagnostico = pacienteDiagnosticoRepository.findById(dto.getPacienteDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient diagnosis not found"));

        Estado estado = estadoRepository.findById(
                dto.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "State not found"));

        if (dto.getFechaFin() != null && dto.getFechaFin().isBefore(
                dto.getFechaInicio())) {

            throw new BusinessRuleException("End date cannot be before start date.");
        }

        PlanTratamiento entity = new PlanTratamiento();

        entity.setPacienteDiagnostico(pacienteDiagnostico);

        entity.setEstado(estado);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PlanTratamientoResponseDTO> findAll() {

        return mapper.toResponseDTOList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public PlanTratamientoResponseDTO findById(Integer id) {

        PlanTratamiento entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treatment plan not found"));

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PlanTratamientoResponseDTO> getByPacienteDiagnostico(
            Integer pacienteDiagnosticoId) {

        return mapper.toResponseDTOList(repository.findByPacienteDiagnosticoId(pacienteDiagnosticoId));
    }

    @Override
    public PlanTratamientoResponseDTO update(Integer id, PlanTratamientoRequestDTO dto) {

        PlanTratamiento entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Treatment plan not found"));

        PacienteDiagnostico pacienteDiagnostico = pacienteDiagnosticoRepository.findById(
                dto.getPacienteDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient diagnosis not found"));

        Estado estado = estadoRepository.findById(dto.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "State not found"));

        if (dto.getFechaFin() != null && dto.getFechaFin().isBefore(dto.getFechaInicio())) {
            throw new BusinessRuleException("End date cannot be before start date.");
        }

        entity.setPacienteDiagnostico(pacienteDiagnostico);

        entity.setEstado(estado);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void changeStatus(Integer id, Integer estadoId) {

        PlanTratamiento entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treatment plan not found"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(Integer id) {

        PlanTratamiento entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treatment plan not found"));

        repository.delete(entity);
    }

}