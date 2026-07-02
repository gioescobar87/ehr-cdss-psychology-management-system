package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.clinical.SesionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.NotaSesionResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionIntervencionResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionResponseDTO;
import com.clinica.psicologia.system.service.clinical.NotaSesionService;
import com.clinica.psicologia.system.service.clinical.SesionIntervencionService;
import com.clinica.psicologia.system.service.clinical.SesionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sesion")
@RequiredArgsConstructor
public class SesionController {

    private final SesionService service;
    private final NotaSesionService notaSesionService;
    private final SesionIntervencionService sesionIntervencionService;

    @PostMapping
    public SesionResponseDTO create(
            @Valid @RequestBody SesionRequestDTO request) {

        return service.create(request);
    }

    @GetMapping
    public List<SesionResponseDTO> findAll() {

        return service.findAll();
    }

    @GetMapping("/{id}")
    public SesionResponseDTO findById(
            @PathVariable Integer id) {

        return service.findById(id);
    }

    @PutMapping("/{id}")
    public SesionResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestBody SesionRequestDTO request) {

        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/{id}/notas-sesion")
    public ResponseEntity<List<NotaSesionResponseDTO>> obtenerNotasSesion(@PathVariable Integer id){
        return ResponseEntity.ok(notaSesionService.getBySesion(id));
    }

    @GetMapping("/{id}/sesiones-intervencion")
    public ResponseEntity<List<SesionIntervencionResponseDTO>> obtenerSesionesIntervencion(@PathVariable Integer id){
        return ResponseEntity.ok(sesionIntervencionService.getBySesion(id));
    }
}