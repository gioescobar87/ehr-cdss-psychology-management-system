package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.ObjetivoTerapiaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.ObjetivoTerapiaResponseDTO;

public interface ObjetivoTerapiaService {

    List<ObjetivoTerapiaResponseDTO> findAll();

    ObjetivoTerapiaResponseDTO findById(Integer id);

    List<ObjetivoTerapiaResponseDTO> getByPlanTratamiento(Integer planTratamientoId);

    ObjetivoTerapiaResponseDTO create(ObjetivoTerapiaRequestDTO dto);

    ObjetivoTerapiaResponseDTO update(Integer id, ObjetivoTerapiaRequestDTO dto);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);

    List<ObjetivoTerapiaResponseDTO> getByPaciente(Integer pacienteId);
}