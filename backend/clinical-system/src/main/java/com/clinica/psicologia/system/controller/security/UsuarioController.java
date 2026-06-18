package com.clinica.psicologia.system.controller.security;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.security.UsuarioRequestDTO;
import com.clinica.psicologia.system.dto.request.security.UsuarioRolRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.security.UsuarioResponseDTO;
import com.clinica.psicologia.system.dto.response.security.UsuarioRolResponseDTO;
import com.clinica.psicologia.system.service.security.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioResponseDTO> findAll() {
        return usuarioService.findAll();
    }

    @GetMapping("/{id}")
    public UsuarioResponseDTO findById(@PathVariable Integer id) {
        return usuarioService.findById(id);
    }

    @PostMapping
    public UsuarioResponseDTO create(@Valid @RequestBody UsuarioRequestDTO request) {
        return usuarioService.create(request);
    }

    @PutMapping("/{id}")
    public UsuarioResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioRequestDTO request) {
        return usuarioService.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    public void changeStatus(
            @PathVariable Integer id,
            @Valid @RequestBody EstadoChangeRequestDTO request) {

        usuarioService.changeStatus(id, request.getEstadoId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        usuarioService.delete(id);
    }

    // =========================
    // ROLES
    // =========================

    @GetMapping("/{id}/roles")
    public List<UsuarioRolResponseDTO> getRoles(@PathVariable Integer id) {
        return usuarioService.getRoles(id);
    }

    @PostMapping("/{id}/roles")
    @ResponseStatus(HttpStatus.CREATED)
    public void assignRole(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioRolRequestDTO request) {

        usuarioService.assignRole(id, request.getRolId());
    }

    @DeleteMapping("/{id}/roles/{rolId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeRole(
            @PathVariable Integer id,
            @PathVariable Integer rolId) {

        usuarioService.removeRole(id, rolId);
    }
}