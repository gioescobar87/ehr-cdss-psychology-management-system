package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.clinical.EvaluacionRiesgoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.EvaluacionRiesgoResponseDTO;
import com.clinica.psicologia.system.service.clinical.EvaluacionRiesgoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/evaluacion-riesgo")
@RequiredArgsConstructor
public class EvaluacionRiesgoController {

    private final EvaluacionRiesgoService service;

    @GetMapping
    public List<EvaluacionRiesgoResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public EvaluacionRiesgoResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EvaluacionRiesgoResponseDTO create(@Valid @RequestBody EvaluacionRiesgoRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public EvaluacionRiesgoResponseDTO update(@PathVariable Integer id,
            @Valid @RequestBody EvaluacionRiesgoRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}