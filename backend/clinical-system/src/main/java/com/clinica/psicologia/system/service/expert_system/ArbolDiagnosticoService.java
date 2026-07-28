package com.clinica.psicologia.system.service.expert_system;

import java.util.List;

import com.clinica.psicologia.system.dto.request.expert_system.ArbolDiagnosticoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.ArbolDiagnosticoResponseDTO;

public interface ArbolDiagnosticoService {

    List<ArbolDiagnosticoResponseDTO> findAll();

    ArbolDiagnosticoResponseDTO findById(Integer id);

    List<ArbolDiagnosticoResponseDTO> getByCategoriaDiagnostica(Integer categoriaId);

    ArbolDiagnosticoResponseDTO create(ArbolDiagnosticoRequestDTO request);

    ArbolDiagnosticoResponseDTO update(Integer id, ArbolDiagnosticoRequestDTO request);

    void toggleStatus(Integer id);

    void activate(Integer id);

    void delete(Integer id);
}