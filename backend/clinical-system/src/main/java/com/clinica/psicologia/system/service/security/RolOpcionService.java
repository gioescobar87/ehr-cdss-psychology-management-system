package com.clinica.psicologia.system.service.security;

import java.util.List;

import com.clinica.psicologia.system.dto.request.security.RolOpcionRequestDTO;
import com.clinica.psicologia.system.dto.response.security.RolOpcionResponseDTO;

public interface RolOpcionService {
    List<RolOpcionResponseDTO> findByRolId(Integer rolId);

    RolOpcionResponseDTO assign(Integer rolId, RolOpcionRequestDTO request);

    void remove(Integer rolId, Integer opcionId);
}
