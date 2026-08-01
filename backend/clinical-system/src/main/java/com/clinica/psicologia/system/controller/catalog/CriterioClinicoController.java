package com.clinica.psicologia.system.controller.catalog;

import java.util.List;

import org.springframework.http.HttpStatus;
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

import com.clinica.psicologia.system.dto.request.catalog.CriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.CriterioClinicoResponseDTO;
import com.clinica.psicologia.system.service.catalog.CriterioClinicoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/catalogos/criterio-clinico")
public class CriterioClinicoController {

    private final CriterioClinicoService service;

    public CriterioClinicoController(CriterioClinicoService service) {
        this.service = service;
    }

    @GetMapping
    public List<CriterioClinicoResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public CriterioClinicoResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CriterioClinicoResponseDTO create(@Valid @RequestBody CriterioClinicoRequestDTO request) {

        return service.create(request);
    }

    @PutMapping("/{id}")
    public CriterioClinicoResponseDTO update(@PathVariable Integer id,@Valid @RequestBody CriterioClinicoRequestDTO request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeStatus(@PathVariable Integer id,@RequestBody EstadoChangeRequestDTO request) {
        service.changeStatus(id,request.getEstadoId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}