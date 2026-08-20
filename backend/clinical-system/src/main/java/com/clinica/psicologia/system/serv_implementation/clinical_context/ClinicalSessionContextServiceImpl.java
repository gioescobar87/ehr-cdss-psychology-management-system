package com.clinica.psicologia.system.serv_implementation.clinical_context;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextAllergyDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextDiagnosisDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextObjectiveDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextPsychologicalTestDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextRiskDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextSessionDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalSessionContextResponseDTO;
import com.clinica.psicologia.system.mapper.clinical_context.ClinicalSessionContextMapper;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.clinical_context.ClinicalSessionContextRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical_context.ClinicalSessionContextService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClinicalSessionContextServiceImpl implements ClinicalSessionContextService {

        private static final int RECENT_TESTS_LIMIT = 3;
        private static final int RECENT_RISKS_LIMIT = 3;
        private static final int RECENT_SESSIONS_LIMIT = 5;

        private final ClinicalSessionContextRepository clinicalSessionContextRepository;
        private final ClinicalSessionContextMapper clinicalSessionContextMapper;
        private final SesionRepository sesionRepository;

        @Override
        public ClinicalSessionContextResponseDTO getClinicalSessionContext(
                        Integer sesionId) {

                Sesion currentSession = sesionRepository.findById(sesionId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Sesión no encontrada con id: " + sesionId));

                Integer pacienteId = currentSession.getPaciente().getId();

                List<ClinicalContextDiagnosisDTO> diagnoses = clinicalSessionContextRepository
                                .findActiveDiagnosesByPatientId(pacienteId)
                                .stream()
                                .map(clinicalSessionContextMapper::toDiagnosisDTO)
                                .toList();

                List<ClinicalContextAllergyDTO> allergies = clinicalSessionContextRepository
                                .findAllergiesByPatientId(pacienteId)
                                .stream()
                                .map(clinicalSessionContextMapper::toAllergyDTO)
                                .toList();

                List<ClinicalContextPsychologicalTestDTO> psychologicalTests = clinicalSessionContextRepository
                                .findRecentPsychologicalTests(pacienteId, RECENT_TESTS_LIMIT)
                                .stream()
                                .map(clinicalSessionContextMapper::toPsychologicalTestDTO)
                                .toList();

                long psychologicalTestsTotal = clinicalSessionContextRepository
                                .countPsychologicalTestsByPatientId(pacienteId);

                List<ClinicalContextRiskDTO> risks = clinicalSessionContextRepository
                                .findRecentRiskEvaluations(pacienteId, RECENT_RISKS_LIMIT)
                                .stream()
                                .map(clinicalSessionContextMapper::toRiskDTO)
                                .toList();

                long risksTotal = clinicalSessionContextRepository
                                .countRiskEvaluationsByPatientId(pacienteId);

                List<ClinicalContextObjectiveDTO> objectives = clinicalSessionContextRepository
                                .findActiveObjectivesByPatientId(pacienteId)
                                .stream()
                                .map(clinicalSessionContextMapper::toObjectiveDTO)
                                .toList();

                long objectivesTotal = clinicalSessionContextRepository
                                .countObjectivesByPatientId(pacienteId);

                List<ClinicalContextSessionDTO> recentSessions = clinicalSessionContextRepository
                                .findRecentSessions(
                                                pacienteId,
                                                currentSession.getId(),
                                                RECENT_SESSIONS_LIMIT)
                                .stream()
                                .map(clinicalSessionContextMapper::toSessionDTO)
                                .toList();

                long sessionsTotal = clinicalSessionContextRepository
                                .countSessionsByPatientId(
                                                pacienteId,
                                                currentSession.getId());

                return clinicalSessionContextMapper.toResponseDTO(
                                currentSession,
                                diagnoses,
                                allergies,
                                psychologicalTests,
                                psychologicalTestsTotal,
                                risks,
                                risksTotal,
                                objectives,
                                objectivesTotal,
                                recentSessions,
                                sessionsTotal);
        }
}