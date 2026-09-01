package com.clinica.psicologia.system.controller.security;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.request.security.PermisoRequestDTO;
import com.clinica.psicologia.system.dto.response.security.PermisoResponseDTO;
import com.clinica.psicologia.system.service.security.PermisoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/permisos")
public class PermisoController {

    private final PermisoService permisoService;

    public PermisoController(PermisoService permisoService) {
        this.permisoService = permisoService;
    }

    @GetMapping
    public List<PermisoResponseDTO> findAll() {
        return permisoService.findAll();
    }

    @GetMapping("/{id}")
    public PermisoResponseDTO findById(@PathVariable Integer id) {
        return permisoService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PermisoResponseDTO create(@Valid @RequestBody PermisoRequestDTO request) {
        return permisoService.create(request);
    }

    @PutMapping("/{id}")
    public PermisoResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestBody PermisoRequestDTO request) {
        return permisoService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        permisoService.delete(id);
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeEstado(@PathVariable Integer id,@Valid @RequestBody EstadoChangeRequestDTO request) {
        permisoService.changeStatus(id, request.getEstadoId());
    }
}