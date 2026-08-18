package com.clinica.psicologia.system.service.catalog;

import java.util.List;

import com.clinica.psicologia.system.dto.request.catalog.PruebaPsicologicaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.PruebaPsicologicaResponseDTO;

public interface PruebaPsicologicaService {

    List<PruebaPsicologicaResponseDTO> findAll();

    PruebaPsicologicaResponseDTO findById(Integer ind);

    PruebaPsicologicaResponseDTO create(PruebaPsicologicaRequestDTO request);

    PruebaPsicologicaResponseDTO update(Integer id, PruebaPsicologicaRequestDTO request);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);
}