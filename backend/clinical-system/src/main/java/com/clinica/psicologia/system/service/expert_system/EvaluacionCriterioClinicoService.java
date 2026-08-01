package com.clinica.psicologia.system.service.expert_system;

import java.util.List;

import com.clinica.psicologia.system.dto.request.expert_system.EvaluacionCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.EvaluacionCriterioClinicoResponseDTO;

public interface EvaluacionCriterioClinicoService {

    List<EvaluacionCriterioClinicoResponseDTO> findAll();

    EvaluacionCriterioClinicoResponseDTO findById(Integer id);

    List<EvaluacionCriterioClinicoResponseDTO> findByEvaluacion(Integer evaluacionId);

    EvaluacionCriterioClinicoResponseDTO create(EvaluacionCriterioClinicoRequestDTO request);

    EvaluacionCriterioClinicoResponseDTO update(Integer id, EvaluacionCriterioClinicoRequestDTO request);

    void delete(Integer id);
}