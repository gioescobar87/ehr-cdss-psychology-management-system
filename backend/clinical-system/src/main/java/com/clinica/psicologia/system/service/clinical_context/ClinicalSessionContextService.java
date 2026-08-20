package com.clinica.psicologia.system.service.clinical_context;

import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalSessionContextResponseDTO;

public interface ClinicalSessionContextService {

    ClinicalSessionContextResponseDTO getClinicalSessionContext(Integer sesionId);
}