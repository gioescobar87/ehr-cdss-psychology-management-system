package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.clinical.ObjetivoTerapiaRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.ObjetivoTerapiaResponseDTO;
import com.clinica.psicologia.system.service.clinical.ObjetivoTerapiaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/objetivo-terapia")
public class ObjetivoTerapiaController {

    private final ObjetivoTerapiaService service;

    public ObjetivoTerapiaController(
            ObjetivoTerapiaService service) {

        this.service = service;
    }

    @GetMapping
    public List<ObjetivoTerapiaResponseDTO> findAll() {

        return service.findAll();
    }

    @GetMapping("/{id}")
    public ObjetivoTerapiaResponseDTO findById(
            @PathVariable Integer id) {

        return service.findById(id);
    }

    @GetMapping("/plan-tratamiento/{planTratamientoId}")
    public List<ObjetivoTerapiaResponseDTO> getByPlanTratamiento(
            @PathVariable Integer planTratamientoId) {

        return service.getByPlanTratamiento(
                planTratamientoId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ObjetivoTerapiaResponseDTO create(
            @Valid @RequestBody ObjetivoTerapiaRequestDTO request) {

        return service.create(
                request);
    }

    @PutMapping("/{id}")
    public ObjetivoTerapiaResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestBody ObjetivoTerapiaRequestDTO request) {

        return service.update(
                id,
                request);
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

        service.delete(
                id);
    }

}