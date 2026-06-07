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
    @PreAuthorize("hasAuthority('USUARIO_READ')")
    public List<UsuarioResponseDTO> findAll() {
        return usuarioService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USUARIO_READ')")
    public UsuarioResponseDTO findById(@PathVariable Integer id) {
        return usuarioService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('USUARIO_WRITE')")
    public UsuarioResponseDTO create(@Valid @RequestBody UsuarioRequestDTO request) {
        return usuarioService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USUARIO_WRITE')")
    public UsuarioResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioRequestDTO request) {
        return usuarioService.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAuthority('USUARIO_WRITE')")
    public void changeStatus(
            @PathVariable Integer id,
            @Valid @RequestBody EstadoChangeRequestDTO request) {

        usuarioService.changeStatus(id, request.getEstadoId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('USUARIO_DELETE')")
    public void delete(@PathVariable Integer id) {
        usuarioService.delete(id);
    }

    // =========================
    // ROLES
    // =========================

    @GetMapping("/{id}/roles")
    @PreAuthorize("hasAuthority('USUARIO_READ')")
    public List<UsuarioRolResponseDTO> getRoles(@PathVariable Integer id) {
        return usuarioService.getRoles(id);
    }

    @PostMapping("/{id}/roles")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('USUARIO_WRITE')")
    public void assignRole(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioRolRequestDTO request) {

        usuarioService.assignRole(id, request.getRolId());
    }

    @DeleteMapping("/{id}/roles/{rolId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('USUARIO_WRITE')")
    public void removeRole(
            @PathVariable Integer id,
            @PathVariable Integer rolId) {

        usuarioService.removeRole(id, rolId);
    }
}