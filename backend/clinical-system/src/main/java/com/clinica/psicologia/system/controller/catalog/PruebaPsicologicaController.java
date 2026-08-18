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

import com.clinica.psicologia.system.dto.request.catalog.PruebaPsicologicaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.PruebaPsicologicaResponseDTO;
import com.clinica.psicologia.system.service.catalog.PruebaPsicologicaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/prueba-psicologica")
@RequiredArgsConstructor
public class PruebaPsicologicaController {

    private final PruebaPsicologicaService service;

    @GetMapping
    public List<PruebaPsicologicaResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PruebaPsicologicaResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PruebaPsicologicaResponseDTO create(@Valid @RequestBody PruebaPsicologicaRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public PruebaPsicologicaResponseDTO update(@PathVariable Integer id, @Valid @RequestBody PruebaPsicologicaRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}