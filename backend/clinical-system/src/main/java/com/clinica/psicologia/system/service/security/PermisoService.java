package com.clinica.psicologia.system.service.security;

import java.util.List;

import com.clinica.psicologia.system.dto.request.security.PermisoRequestDTO;
import com.clinica.psicologia.system.dto.response.security.PermisoResponseDTO;

public interface PermisoService {

    List<PermisoResponseDTO> findAll();

    PermisoResponseDTO findById(Integer id);

    PermisoResponseDTO create(PermisoRequestDTO request);

    PermisoResponseDTO update(Integer id, PermisoRequestDTO request);

    void delete(Integer id);
}