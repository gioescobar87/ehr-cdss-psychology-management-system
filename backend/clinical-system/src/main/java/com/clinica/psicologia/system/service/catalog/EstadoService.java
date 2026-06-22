package com.clinica.psicologia.system.service.catalog;

import java.util.List;

import com.clinica.psicologia.system.dto.request.catalog.EstadoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.EstadoResponseDTO;

public interface EstadoService {
    List<EstadoResponseDTO> findAll();

    EstadoResponseDTO findById(Integer ind);

    EstadoResponseDTO create(EstadoRequestDTO request);

    EstadoResponseDTO update(Integer id, EstadoRequestDTO request);

    void delete(Integer id);
}
