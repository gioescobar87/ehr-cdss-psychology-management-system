package com.clinica.psicologia.system.service.catalog;

import java.util.List;

import com.clinica.psicologia.system.dto.request.catalog.DiagnosticoCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.DiagnosticoCriterioClinicoResponseDTO;

public interface DiagnosticoCriterioClinicoService {

    List<DiagnosticoCriterioClinicoResponseDTO> findAll();

    DiagnosticoCriterioClinicoResponseDTO findById(Integer id);

    List<DiagnosticoCriterioClinicoResponseDTO> findByDiagnosticoId(Integer diagnosticoId);

    List<DiagnosticoCriterioClinicoResponseDTO> findByCriterioClinicoId(Integer criterioClinicoId);

    DiagnosticoCriterioClinicoResponseDTO create(DiagnosticoCriterioClinicoRequestDTO request);

    DiagnosticoCriterioClinicoResponseDTO update(Integer id, DiagnosticoCriterioClinicoRequestDTO request);

    void delete(Integer id);
}
