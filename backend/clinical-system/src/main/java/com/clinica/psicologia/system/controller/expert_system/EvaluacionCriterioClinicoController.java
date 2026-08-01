package com.clinica.psicologia.system.controller.expert_system;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.expert_system.EvaluacionCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.EvaluacionCriterioClinicoResponseDTO;
import com.clinica.psicologia.system.service.expert_system.EvaluacionCriterioClinicoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/evaluacion-criterio-clinico")
@RequiredArgsConstructor
public class EvaluacionCriterioClinicoController {

    private final EvaluacionCriterioClinicoService service;

    @GetMapping
    public ResponseEntity<List<EvaluacionCriterioClinicoResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluacionCriterioClinicoResponseDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/evaluacion/{evaluacionId}")
    public ResponseEntity<List<EvaluacionCriterioClinicoResponseDTO>> findByEvaluacion(@PathVariable Integer evaluacionId) {
        return ResponseEntity.ok(service.findByEvaluacion(evaluacionId));
    }

    @PostMapping
    public ResponseEntity<EvaluacionCriterioClinicoResponseDTO> create(@Valid @RequestBody EvaluacionCriterioClinicoRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvaluacionCriterioClinicoResponseDTO> update(@PathVariable Integer id,@Valid @RequestBody EvaluacionCriterioClinicoRequestDTO request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}