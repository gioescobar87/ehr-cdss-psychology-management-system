package com.clinica.psicologia.system.service.catalog;

import java.util.List;

import com.clinica.psicologia.system.dto.request.catalog.ParentescoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.ParentescoResponseDTO;

public interface ParentescoService {
    List<ParentescoResponseDTO> findAll();

    ParentescoResponseDTO findById(Integer ind);

    ParentescoResponseDTO create(ParentescoRequestDTO request);

    ParentescoResponseDTO update(Integer id, ParentescoRequestDTO request);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);
}
