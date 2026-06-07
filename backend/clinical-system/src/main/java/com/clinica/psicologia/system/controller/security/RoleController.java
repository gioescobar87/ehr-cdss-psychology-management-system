package com.clinica.psicologia.system.controller.security;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.security.RolRequestDTO;
import com.clinica.psicologia.system.dto.response.security.RolResponseDTO;
import com.clinica.psicologia.system.service.security.RoleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROL_READ')")
    public List<RolResponseDTO> findAll() {
        return roleService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROL_READ')")
    public RolResponseDTO findById(@PathVariable Integer id) {
        return roleService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROL_WRITE')")
    public RolResponseDTO create(@Valid @RequestBody RolRequestDTO request) {
        return roleService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROL_WRITE')")
    public RolResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestBody RolRequestDTO request) {
        return roleService.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAuthority('ROL_WRITE')")
    public void changeStatus(
            @PathVariable Integer id,
            @RequestBody Integer estadoId) {
        roleService.changeStatus(id, estadoId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROL_DELETE')")
    public void delete(@PathVariable Integer id) {
        roleService.delete(id);
    }
}