package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.clinical.SesionIntervencionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionIntervencionResponseDTO;
import com.clinica.psicologia.system.service.clinical.SesionIntervencionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sesion-intervencion")
@RequiredArgsConstructor
public class SesionIntervencionController {

    private final SesionIntervencionService service;

    @PostMapping
    public SesionIntervencionResponseDTO create(@Valid @RequestBody SesionIntervencionRequestDTO request) {
        return service.create(request);
    }

    @GetMapping
    public List<SesionIntervencionResponseDTO> findAll() {
        return service.findAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

}