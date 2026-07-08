package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.clinical.SeguimientoObjetivoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SeguimientoObjetivoResponseDTO;
import com.clinica.psicologia.system.service.clinical.SeguimientoObjetivoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/seguimiento-objetivo")
public class SeguimientoObjetivoController {

    private final SeguimientoObjetivoService service;

    public SeguimientoObjetivoController(SeguimientoObjetivoService service) {
        this.service = service;
    }

    @GetMapping
    public List<SeguimientoObjetivoResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public SeguimientoObjetivoResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/objetivo-terapia/{objetivoTerapiaId}")
    public List<SeguimientoObjetivoResponseDTO> getByObjetivoTerapia(@PathVariable Integer objetivoTerapiaId) {
        return service.getByObjetivoTerapia(objetivoTerapiaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SeguimientoObjetivoResponseDTO create(@Valid @RequestBody SeguimientoObjetivoRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public SeguimientoObjetivoResponseDTO update(@PathVariable Integer id,
            @Valid @RequestBody SeguimientoObjetivoRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

}