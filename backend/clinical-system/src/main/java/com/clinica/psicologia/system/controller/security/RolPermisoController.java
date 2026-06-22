package com.clinica.psicologia.system.controller.security;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.security.RolePermisoRequestDTO;
import com.clinica.psicologia.system.dto.response.security.RolPermisoResponseDTO;
import com.clinica.psicologia.system.service.security.RolePermisoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/roles")
public class RolPermisoController {

    private final RolePermisoService rolePermisoService;

    public RolPermisoController(RolePermisoService rolePermisoService) {
        this.rolePermisoService = rolePermisoService;
    }

    @GetMapping("/{id}/permisos")
    public List<RolPermisoResponseDTO> getPermissions(@PathVariable Integer id) {
        return rolePermisoService.getPermissionsByRole(id);
    }

    @PostMapping("/{id}/permisos")
    @ResponseStatus(HttpStatus.CREATED)
    public void assign(
            @PathVariable Integer id,
            @Valid @RequestBody RolePermisoRequestDTO request) {

        rolePermisoService.assignPermission(id, request.getPermisoId());
    }

    @DeleteMapping("/{id}/permisos/{permisoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(
            @PathVariable Integer id,
            @PathVariable Integer permisoId) {

        rolePermisoService.removePermission(id, permisoId);
    }
}