package com.clinica.psicologia.system.controller.clinical;

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

import com.clinica.psicologia.system.dto.request.clinical.SesionCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionCriterioClinicoResponseDTO;
import com.clinica.psicologia.system.service.clinical.SesionCriterioClinicoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sesion-criterio-clinico")
@RequiredArgsConstructor
public class SesionCriterioClinicoController {

    private final SesionCriterioClinicoService service;

    @GetMapping
    public List<SesionCriterioClinicoResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public SesionCriterioClinicoResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/sesion/{sesionId}")
    public List<SesionCriterioClinicoResponseDTO> getBySesion(@PathVariable Integer sesionId) {
        return service.getBySesion(sesionId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SesionCriterioClinicoResponseDTO create(
            @Valid @RequestBody SesionCriterioClinicoRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public SesionCriterioClinicoResponseDTO update(@PathVariable Integer id,
            @Valid @RequestBody SesionCriterioClinicoRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}