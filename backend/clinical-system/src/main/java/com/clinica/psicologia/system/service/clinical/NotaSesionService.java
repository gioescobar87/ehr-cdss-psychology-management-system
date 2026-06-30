package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.NotaSesionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.NotaSesionResponseDTO;

public interface NotaSesionService {
    NotaSesionResponseDTO create(NotaSesionRequestDTO request);

    List<NotaSesionResponseDTO> findAll();

    NotaSesionResponseDTO findById(Integer id);

    NotaSesionResponseDTO update(Integer id, NotaSesionRequestDTO request);

    void delete(Integer id);

    List<NotaSesionResponseDTO> getBySesion(Integer sesionId);
}
