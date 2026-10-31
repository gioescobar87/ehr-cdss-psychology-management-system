package com.clinica.psicologia.system.controller.catalog;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.catalog.DiagnosticoCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.DiagnosticoCriterioClinicoResponseDTO;
import com.clinica.psicologia.system.service.catalog.DiagnosticoCriterioClinicoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/catalogos/diagnostico-criterio-clinico")
public class DiagnosticoCriterioClinicoController {

    private final DiagnosticoCriterioClinicoService service;

    @GetMapping
    public List<DiagnosticoCriterioClinicoResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public DiagnosticoCriterioClinicoResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/diagnostico/{diagnosticoId}")
    public List<DiagnosticoCriterioClinicoResponseDTO> findByDiagnosticoId(@PathVariable Integer diagnosticoId) {
        return service.findByDiagnosticoId(diagnosticoId);
    }

    @GetMapping("/criterio-clinico/{criterioClinicoId}")
    public List<DiagnosticoCriterioClinicoResponseDTO> findByCriterioClinicoId(@PathVariable Integer criterioClinicoId) {
        return service.findByCriterioClinicoId(criterioClinicoId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DiagnosticoCriterioClinicoResponseDTO create(@Valid @RequestBody DiagnosticoCriterioClinicoRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public DiagnosticoCriterioClinicoResponseDTO update(@PathVariable Integer id,
            @Valid @RequestBody DiagnosticoCriterioClinicoRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
