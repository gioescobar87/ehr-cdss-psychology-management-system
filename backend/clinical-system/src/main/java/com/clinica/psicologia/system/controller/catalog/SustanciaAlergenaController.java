package com.clinica.psicologia.system.controller.catalog;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.catalog.SustanciaAlergenaRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.SustanciaAlergenaResponseDTO;
import com.clinica.psicologia.system.service.catalog.SustanciaAlergenaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/catalogos/sustancias-alergenas")
public class SustanciaAlergenaController {

    private final SustanciaAlergenaService service;

    public SustanciaAlergenaController(
            SustanciaAlergenaService service) {

        this.service = service;
    }

    @GetMapping
    public List<SustanciaAlergenaResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public SustanciaAlergenaResponseDTO findById(
            @PathVariable Integer id) {

        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SustanciaAlergenaResponseDTO create(
            @Valid
            @RequestBody
            SustanciaAlergenaRequestDTO request) {

        return service.create(request);
    }

    @PutMapping("/{id}")
    public SustanciaAlergenaResponseDTO update(
            @PathVariable Integer id,
            @Valid
            @RequestBody
            SustanciaAlergenaRequestDTO request) {

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