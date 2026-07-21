package com.clinica.psicologia.system.service.clinical;

import com.clinica.psicologia.system.dto.request.clinical.EvaluacionRiesgoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.EvaluacionRiesgoResponseDTO;

import java.util.List;

public interface EvaluacionRiesgoService {

    EvaluacionRiesgoResponseDTO create(EvaluacionRiesgoRequestDTO request);

    List<EvaluacionRiesgoResponseDTO> findAll();

    EvaluacionRiesgoResponseDTO findById(Integer id);

    List<EvaluacionRiesgoResponseDTO> getByPaciente(Integer pacienteId);

    List<EvaluacionRiesgoResponseDTO> getBySesion(Integer sesionId);

    EvaluacionRiesgoResponseDTO update(Integer id, EvaluacionRiesgoRequestDTO request);

    void delete(Integer id);
}