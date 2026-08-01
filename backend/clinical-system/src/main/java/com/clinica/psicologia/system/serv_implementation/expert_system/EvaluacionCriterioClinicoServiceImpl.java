package com.clinica.psicologia.system.serv_implementation.expert_system;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.expert_system.EvaluacionCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.EvaluacionCriterioClinicoResponseDTO;
import com.clinica.psicologia.system.mapper.expert_system.EvaluacionCriterioClinicoMapper;
import com.clinica.psicologia.system.model.catalog.CriterioClinico;
import com.clinica.psicologia.system.model.expert_system.EvaluacionCriterioClinico;
import com.clinica.psicologia.system.model.expert_system.EvaluacionDiagnostica;
import com.clinica.psicologia.system.repository.catalog.CriterioClinicoRepository;
import com.clinica.psicologia.system.repository.expert_system.EvaluacionCriterioClinicoRepository;
import com.clinica.psicologia.system.repository.expert_system.EvaluacionDiagnosticaRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.expert_system.EvaluacionCriterioClinicoService;
import com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class EvaluacionCriterioClinicoServiceImpl
        implements EvaluacionCriterioClinicoService {

    private final EvaluacionCriterioClinicoRepository repository;
    private final EvaluacionDiagnosticaRepository evaluacionRepository;
    private final CriterioClinicoRepository criterioRepository;
    private final EvaluacionCriterioClinicoMapper mapper;
    private final ClinicalAuthorizationService authorizationService;

    private static final String DUPLICATE_MESSAGE = "This clinical criterion has already been selected for the evaluation.";

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<EvaluacionCriterioClinicoResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public EvaluacionCriterioClinicoResponseDTO findById(Integer id) {

        EvaluacionCriterioClinico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Selected clinical criterion not found"));

        validateAuthorization(entity.getEvaluacionDiagnostica());

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<EvaluacionCriterioClinicoResponseDTO> findByEvaluacion(Integer evaluacionId) {

        EvaluacionDiagnostica evaluacion = evaluacionRepository.findById(evaluacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic evaluation not found"));

        validateAuthorization(evaluacion);

        return mapper.toResponseList(repository.findByEvaluacionDiagnosticaIdOrderById(evaluacionId));
    }

    @Override
    public EvaluacionCriterioClinicoResponseDTO create(EvaluacionCriterioClinicoRequestDTO request) {

        if (repository.existsByEvaluacionDiagnosticaIdAndCriterioClinicoId(request.getEvaluacionDiagnosticaId(),
                request.getCriterioClinicoId())) {
            throw new DuplicateResourceException(DUPLICATE_MESSAGE);
        }

        EvaluacionDiagnostica evaluacion = evaluacionRepository.findById(request.getEvaluacionDiagnosticaId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic evaluation not found"));

        validateAuthorization(evaluacion);

        CriterioClinico criterio = criterioRepository.findById(request.getCriterioClinicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion not found"));

        EvaluacionCriterioClinico entity = new EvaluacionCriterioClinico();

        entity.setEvaluacionDiagnostica(evaluacion);
        entity.setCriterioClinico(criterio);

        mapper.updateEntity(entity, request);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public EvaluacionCriterioClinicoResponseDTO update(Integer id, EvaluacionCriterioClinicoRequestDTO request) {

        EvaluacionCriterioClinico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Selected clinical criterion not found"));

        validateAuthorization(entity.getEvaluacionDiagnostica());

        if (!entity.getEvaluacionDiagnostica().getId().equals(request.getEvaluacionDiagnosticaId())
                || !entity.getCriterioClinico().getId().equals(request.getCriterioClinicoId())) {

            if (repository.existsByEvaluacionDiagnosticaIdAndCriterioClinicoId(request.getEvaluacionDiagnosticaId(),
                    request.getCriterioClinicoId())) {
                throw new DuplicateResourceException(DUPLICATE_MESSAGE);
            }

            EvaluacionDiagnostica evaluacion = evaluacionRepository.findById(request.getEvaluacionDiagnosticaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Diagnostic evaluation not found"));

            validateAuthorization(evaluacion);

            CriterioClinico criterio = criterioRepository.findById(request.getCriterioClinicoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion not found"));

            entity.setEvaluacionDiagnostica(evaluacion);
            entity.setCriterioClinico(criterio);
        }

        mapper.updateEntity(entity, request);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public void delete(Integer id) {

        EvaluacionCriterioClinico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Selected clinical criterion not found"));

        validateAuthorization(entity.getEvaluacionDiagnostica());

        repository.delete(entity);
    }

    private void validateAuthorization(EvaluacionDiagnostica evaluacion) {

        authorizationService.validateSessionOwner(evaluacion.getSesion());

        authorizationService.validateAssignedPsychologist(evaluacion.getSesion().getPaciente());
    }
}