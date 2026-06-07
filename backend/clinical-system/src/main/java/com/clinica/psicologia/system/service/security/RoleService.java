package com.clinica.psicologia.system.service.security;

import java.util.List;

import com.clinica.psicologia.system.dto.request.security.RolRequestDTO;
import com.clinica.psicologia.system.dto.response.security.RolResponseDTO;

public interface RoleService {

    List<RolResponseDTO> findAll();

    RolResponseDTO findById(Integer id);

    RolResponseDTO create(RolRequestDTO request);

    RolResponseDTO update(Integer id, RolRequestDTO request);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);
}