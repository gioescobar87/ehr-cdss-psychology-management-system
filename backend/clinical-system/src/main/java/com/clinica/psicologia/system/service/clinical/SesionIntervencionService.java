package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.SesionIntervencionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionIntervencionResponseDTO;

public interface SesionIntervencionService {

    SesionIntervencionResponseDTO create(SesionIntervencionRequestDTO request);

    List<SesionIntervencionResponseDTO> findAll();

    List<SesionIntervencionResponseDTO> getBySesion(Integer sesionId);

    void delete(Integer id);

    List<SesionIntervencionResponseDTO> getByPaciente(Integer pacienteId);

}