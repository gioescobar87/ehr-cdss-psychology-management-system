package com.clinica.psicologia.system.dto.response.clinical_context;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ClinicalSessionContextResponseDTO {

    private ClinicalContextPatientDTO patient;

    private ClinicalContextSessionDTO currentSession;

    private List<ClinicalContextDiagnosisDTO> diagnoses;

    private List<ClinicalContextAllergyDTO> allergies;

    private ClinicalContextPreviewDTO<ClinicalContextPsychologicalTestDTO> psychologicalTests;

    private ClinicalContextPreviewDTO<ClinicalContextRiskDTO> risks;

    private ClinicalContextPreviewDTO<ClinicalContextObjectiveDTO> objectives;

    private ClinicalContextPreviewDTO<ClinicalContextSessionDTO> recentSessions;
}