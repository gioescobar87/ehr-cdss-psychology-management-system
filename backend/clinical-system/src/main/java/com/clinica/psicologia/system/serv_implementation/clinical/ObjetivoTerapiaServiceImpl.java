package com.clinica.psicologia.system.serv_implementation.clinical;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.ObjetivoTerapiaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.ObjetivoTerapiaResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.ObjetivoTerapiaMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.clinical.ObjetivoTerapia;
import com.clinica.psicologia.system.model.clinical.PlanTratamiento;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.clinical.ObjetivoTerapiaRepository;
import com.clinica.psicologia.system.repository.clinical.PlanTratamientoRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.ObjetivoTerapiaService;
import com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ObjetivoTerapiaServiceImpl implements ObjetivoTerapiaService {

        private final ObjetivoTerapiaRepository repository;
        private final PlanTratamientoRepository planTratamientoRepository;
        private final EstadoRepository estadoRepository;
        private final ObjetivoTerapiaMapper mapper;
        private final ClinicalAuthorizationService authorizationService;

        @Override
        public ObjetivoTerapiaResponseDTO create(ObjetivoTerapiaRequestDTO dto) {

                PlanTratamiento planTratamiento = planTratamientoRepository.findById(dto.getPlanTratamientoId())
                                .orElseThrow(() -> new ResourceNotFoundException("Treatment plan not found"));

                authorizationService
                                .validateAssignedPsychologist(planTratamiento.getPacienteDiagnostico().getPaciente());

                Estado estado = estadoRepository.findById(dto.getEstadoId())
                                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

                if (dto.getFechaMeta() != null && dto.getFechaMeta().isBefore(dto.getFechaInicio())) {
                        throw new BusinessRuleException("Target date cannot be before start date.");
                }

                if (dto.getFechaInicio().isBefore(planTratamiento.getFechaInicio())) {

                        throw new BusinessRuleException(
                                        "Objective start date cannot be before the treatment plan start date.");
                }

                if (planTratamiento.getFechaFin() != null) {

                        if (dto.getFechaInicio().isAfter(planTratamiento.getFechaFin())) {
                                throw new BusinessRuleException(
                                                "Objective start date cannot be after the treatment plan end date.");
                        }

                        if (dto.getFechaMeta() != null && dto.getFechaMeta().isAfter(planTratamiento.getFechaFin())) {
                                throw new BusinessRuleException(
                                                "Target date cannot be after the treatment plan end date.");
                        }
                }

                ObjetivoTerapia entity = new ObjetivoTerapia();

                entity.setPlanTratamiento(planTratamiento);

                entity.setEstado(estado);

                mapper.updateEntity(entity, dto);

                entity = repository.saveAndFlush(entity);

                return mapper.toResponseDTO(entity);
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public List<ObjetivoTerapiaResponseDTO> findAll() {

                return mapper.toResponseDTOList(repository.findAll());
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public ObjetivoTerapiaResponseDTO findById(Integer id) {

                ObjetivoTerapia entity = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Therapy objective not found"));

                return mapper.toResponseDTO(entity);
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public List<ObjetivoTerapiaResponseDTO> getByPlanTratamiento(Integer planTratamientoId) {
                return mapper.toResponseDTOList(repository.findByPlanTratamientoId(planTratamientoId));
        }

        @Override
        public ObjetivoTerapiaResponseDTO update(Integer id, ObjetivoTerapiaRequestDTO dto) {

                ObjetivoTerapia entity = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Therapy objective not found"));

                PlanTratamiento planTratamiento = planTratamientoRepository.findById(dto.getPlanTratamientoId())
                                .orElseThrow(() -> new ResourceNotFoundException("Treatment plan not found"));

                authorizationService.validateAssignedPsychologist(
                                planTratamiento.getPacienteDiagnostico().getPaciente());

                Estado estado = estadoRepository.findById(dto.getEstadoId())
                                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

                if (dto.getFechaMeta() != null && dto.getFechaMeta().isBefore(dto.getFechaInicio())) {

                        throw new BusinessRuleException("Target date cannot be before start date.");
                }

                if (dto.getFechaInicio().isBefore(planTratamiento.getFechaInicio())) {
                        throw new BusinessRuleException(
                                        "Objective start date cannot be before the treatment plan start date.");
                }

                if (planTratamiento.getFechaFin() != null) {

                        if (dto.getFechaInicio().isAfter(planTratamiento.getFechaFin())) {
                                throw new BusinessRuleException(
                                                "Objective start date cannot be after the treatment plan end date.");
                        }

                        if (dto.getFechaMeta() != null && dto.getFechaMeta().isAfter(planTratamiento.getFechaFin())) {
                                throw new BusinessRuleException(
                                                "Target date cannot be after the treatment plan end date.");
                        }
                }

                entity.setPlanTratamiento(planTratamiento);

                entity.setEstado(estado);

                mapper.updateEntity(entity, dto);

                entity = repository.save(entity);

                return mapper.toResponseDTO(entity);
        }

        @Override
        public void changeStatus(Integer id, Integer estadoId) {

                ObjetivoTerapia entity = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Therapy objective not found"));

                Estado estado = estadoRepository.findById(estadoId)
                                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

                entity.setEstado(estado);

                repository.save(entity);
        }

        @Override
        public void delete(Integer id) {

                ObjetivoTerapia entity = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Therapy objective not found"));

                authorizationService.validateAssignedPsychologist(
                                entity.getPlanTratamiento()
                                                .getPacienteDiagnostico()
                                                .getPaciente());

                repository.delete(entity);
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public List<ObjetivoTerapiaResponseDTO> getByPaciente(Integer pacienteId) {
                return mapper.toResponseDTOList(repository.findByPlanTratamientoPacienteDiagnosticoPacienteId(pacienteId));
        }
}