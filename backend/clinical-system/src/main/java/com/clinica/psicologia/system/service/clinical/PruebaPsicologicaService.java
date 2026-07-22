package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.PruebaPsicologicaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.PruebaPsicologicaResponseDTO;

public interface PruebaPsicologicaService {

    PruebaPsicologicaResponseDTO create(PruebaPsicologicaRequestDTO request);

    List<PruebaPsicologicaResponseDTO> findAll();

    PruebaPsicologicaResponseDTO findById(Integer id);

    List<PruebaPsicologicaResponseDTO> getByPaciente(Integer pacienteId);

    List<PruebaPsicologicaResponseDTO> getBySesion(Integer sesionId);

    List<PruebaPsicologicaResponseDTO> getByTipoPrueba(Integer tipoPruebaId);

    PruebaPsicologicaResponseDTO update(Integer id, PruebaPsicologicaRequestDTO request);

    void delete(Integer id);
}