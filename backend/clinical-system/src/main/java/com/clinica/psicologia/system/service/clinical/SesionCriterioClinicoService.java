package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.SesionCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionCriterioClinicoResponseDTO;

public interface SesionCriterioClinicoService {

    SesionCriterioClinicoResponseDTO create(SesionCriterioClinicoRequestDTO request);

    List<SesionCriterioClinicoResponseDTO> findAll();

    SesionCriterioClinicoResponseDTO findById(Integer id);

    List<SesionCriterioClinicoResponseDTO> getBySesion(Integer sesionId);

    List<SesionCriterioClinicoResponseDTO> getByPaciente(Integer pacienteId);

    SesionCriterioClinicoResponseDTO update(Integer id, SesionCriterioClinicoRequestDTO request);

    void delete(Integer id);
}