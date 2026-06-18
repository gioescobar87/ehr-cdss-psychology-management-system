package com.clinica.psicologia.system.controller.security;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
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
    public List<RolResponseDTO> findAll() {
        return roleService.findAll();
    }

    @GetMapping("/{id}")
    public RolResponseDTO findById(@PathVariable Integer id) {
        return roleService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RolResponseDTO create(@Valid @RequestBody RolRequestDTO request) {
        return roleService.create(request);
    }

    @PutMapping("/{id}")
    public RolResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestBody RolRequestDTO request) {
        return roleService.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Void> changeStatus(
            @PathVariable Integer id,
            @Valid @RequestBody EstadoChangeRequestDTO request) {
        roleService.changeStatus(id, request.getEstadoId());

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        roleService.delete(id);
    }
}