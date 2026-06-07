package com.clinica.psicologia.system.service.security;

import java.util.List;

import com.clinica.psicologia.system.dto.response.security.RolPermisoResponseDTO;

public interface RolePermisoService {

    List<RolPermisoResponseDTO> getPermissionsByRole(Integer rolId);

    void assignPermission(Integer rolId, Integer permisoId);

    void removePermission(Integer rolId, Integer permisoId);
}