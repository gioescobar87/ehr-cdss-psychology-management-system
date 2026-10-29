package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.web.multipart.MultipartFile;

import com.clinica.psicologia.system.dto.request.clinical.NotaSesionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.NotaSesionResponseDTO;

public interface NotaSesionService {
    NotaSesionResponseDTO create(NotaSesionRequestDTO request, MultipartFile attachment);

    List<NotaSesionResponseDTO> findAll();

    NotaSesionResponseDTO findById(Integer id);

    NotaSesionResponseDTO update(Integer id, NotaSesionRequestDTO request, MultipartFile attachment);

    void delete(Integer id);

    List<NotaSesionResponseDTO> getBySesion(Integer sesionId);

    InputStreamResource getAttachment(Integer id);
}
