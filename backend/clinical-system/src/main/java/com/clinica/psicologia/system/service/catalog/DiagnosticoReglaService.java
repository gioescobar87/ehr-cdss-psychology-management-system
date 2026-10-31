package com.clinica.psicologia.system.service.catalog;

import java.util.List;

import com.clinica.psicologia.system.dto.request.catalog.DiagnosticoReglaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.DiagnosticoReglaResponseDTO;

public interface DiagnosticoReglaService {

    List<DiagnosticoReglaResponseDTO> findAll();

    DiagnosticoReglaResponseDTO findById(Integer id);

    List<DiagnosticoReglaResponseDTO> findByDiagnosticoId(Integer diagnosticoId);

    List<DiagnosticoReglaResponseDTO> findByTipoReglaId(Integer tipoReglaId);

    DiagnosticoReglaResponseDTO create(DiagnosticoReglaRequestDTO request);

    DiagnosticoReglaResponseDTO update(Integer id, DiagnosticoReglaRequestDTO request);

    void delete(Integer id);
}
