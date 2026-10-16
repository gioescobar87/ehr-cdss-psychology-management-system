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
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;
import com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteDiagnosticoServiceImpl implements PacienteDiagnosticoService {

        private final PacienteDiagnosticoRepository repository;
        private final PacienteRepository pacienteRepository;
        private final DiagnosticoRepository diagnosticoRepository;
        private final EstadoRepository estadoRepository;
        private final PacienteDiagnosticoMapper mapper;
        private final ApplicationSupportService supportService;
        private final SesionRepository sesionRepository;
        private final ClinicalAuthorizationService authorizationService;

        @Override
        public PacienteDiagnosticoResponseDTO create(PacienteDiagnosticoRequestDTO dto) {

                Sesion sesion = sesionRepository.findById(dto.getSesionId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Sesión no encontrada: " + dto.getSesionId()));
                authorizationService.validateSessionOwner(sesion);
                authorizationService.validateAssignedPsychologist(sesion.getPaciente());

                PacienteDiagnostico existing = repository
                                .findBySesionIdAndDiagnosticoId(dto.getSesionId(), dto.getDiagnosticoId())
                                .orElse(null);
                if (existing != null) {
                        return mapper.toResponseDTO(existing);
                }

                Paciente paciente = pacienteRepository
                                .findById(sesion.getPaciente().getId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Paciente no encontrado: " + sesion.getPaciente().getId()));

                Diagnostico diagnostico = diagnosticoRepository
                                .findById(dto.getDiagnosticoId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Diagnóstico no encontrado: " + dto.getDiagnosticoId()));

                Estado estado = estadoRepository
                                .findById(supportService.getActiveState().getId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Estado no encontrado: "
                                                                + supportService.getActiveState().getId()));

                PacienteDiagnostico entity = new PacienteDiagnostico();

                entity.setPaciente(paciente);
                entity.setDiagnostico(diagnostico);
                entity.setSesion(sesion);
                entity.setEstado(estado);
                entity.setFechaDiagnostico(
                                sesion.getFechaSesion().toLocalDate());
                entity.setDiagnosticoInicial(dto.getDiagnosticoInicial());

                entity = repository.save(entity);

                return mapper.toResponseDTO(entity);
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public List<PacienteDiagnosticoResponseDTO> findAll() {
                return mapper.toResponseDTOList(repository.findAll());
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public PacienteDiagnosticoResponseDTO findById(Integer id) {

                PacienteDiagnostico entity = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Patient diagnosis not found"));

                return mapper.toResponseDTO(entity);
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public List<PacienteDiagnosticoResponseDTO> getByPatient(Integer pacienteId) {
                return mapper.toResponseDTOList(
                                repository.findByPacienteId(pacienteId));
        }

        @Override
        public void changeStatus(Integer id) {

                PacienteDiagnostico entity = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Patient diagnosis not found"));

                Estado estado = entity.getEstado().getId() == supportService.getActiveState().getId()
                                ? supportService.getInactiveState()
                                : supportService.getActiveState();

                entity.setEstado(estado);

                repository.save(entity);
        }

}
