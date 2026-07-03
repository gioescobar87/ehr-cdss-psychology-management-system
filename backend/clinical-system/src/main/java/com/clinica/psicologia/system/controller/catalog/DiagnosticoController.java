package com.clinica.psicologia.system.controller.catalog;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.catalog.DiagnosticoRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.DiagnosticoResponseDTO;
import com.clinica.psicologia.system.service.catalog.DiagnosticoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/catalogos/diagnostico")
public class DiagnosticoController {

    private final DiagnosticoService service;

    public DiagnosticoController(
            DiagnosticoService service) {

        this.service = service;
    }

    @GetMapping
    public List<DiagnosticoResponseDTO> findAll() {

        return service.findAll();
    }

    @GetMapping("/{id}")
    public DiagnosticoResponseDTO findById(
            @PathVariable Integer id) {

        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DiagnosticoResponseDTO create(
            @Valid
            @RequestBody
            DiagnosticoRequestDTO request) {

        return service.create(request);
    }

    @PutMapping("/{id}")
    public DiagnosticoResponseDTO update(
            @PathVariable Integer id,
            @Valid
            @RequestBody
            DiagnosticoRequestDTO request) {

        return service.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeStatus(
            @PathVariable Integer id,
            @RequestBody EstadoChangeRequestDTO request) {

        service.changeStatus(
                id,
                request.getEstadoId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Integer id) {

        service.delete(id);
    }
}