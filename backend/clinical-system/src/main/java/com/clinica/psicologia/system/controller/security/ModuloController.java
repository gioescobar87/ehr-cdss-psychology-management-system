package com.clinica.psicologia.system.controller.security;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;

import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.request.security.ModuloRequestDTO;
import com.clinica.psicologia.system.dto.response.security.ModuloResponseDTO;
import com.clinica.psicologia.system.service.security.ModuloService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/modulos")
public class ModuloController {

    private final ModuloService moduloService;

    public ModuloController(
            ModuloService moduloService) {

        this.moduloService = moduloService;
    }

    @GetMapping
    public List<ModuloResponseDTO> findAll() {
        return moduloService.findAll();
    }

    @GetMapping("/{id}")
    public ModuloResponseDTO findById(
            @PathVariable Integer id) {

        return moduloService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ModuloResponseDTO create(
            @Valid
            @RequestBody
            ModuloRequestDTO request) {

        return moduloService.create(request);
    }

    @PutMapping("/{id}")
    public ModuloResponseDTO update(
            @PathVariable Integer id,
            @Valid
            @RequestBody
            ModuloRequestDTO request) {

        return moduloService.update(
                id,
                request);
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeStatus(
            @PathVariable Integer id,
            @RequestBody EstadoChangeRequestDTO request) {

        moduloService.changeStatus(
                id,
                request.getEstadoId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Integer id) {

        moduloService.delete(id);
    }
}