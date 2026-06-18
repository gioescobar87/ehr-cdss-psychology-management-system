package com.clinica.psicologia.system.controller.security;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.security.RolOpcionRequestDTO;
import com.clinica.psicologia.system.dto.response.security.RolOpcionResponseDTO;
import com.clinica.psicologia.system.service.security.RolOpcionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolOpcionController {

    private final RolOpcionService rolOpcionService;

    @GetMapping("/{id}/opciones")
    public List<RolOpcionResponseDTO> findByRol(
            @PathVariable Integer id) {

        return rolOpcionService.findByRolId(id);
    }

    @PostMapping("/{id}/opciones")
    @ResponseStatus(HttpStatus.CREATED)
    public RolOpcionResponseDTO assign(
            @PathVariable Integer id,
            @Valid @RequestBody RolOpcionRequestDTO request) {

        return rolOpcionService.assign(
                id,
                request);
    }

    @DeleteMapping("/{id}/opciones/{opcionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(
            @PathVariable Integer id,
            @PathVariable Integer opcionId) {

        rolOpcionService.remove(
                id,
                opcionId);
    }
}