package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.clinical.PlanTratamientoRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.ObjetivoTerapiaResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.PlanTratamientoResponseDTO;
import com.clinica.psicologia.system.service.clinical.ObjetivoTerapiaService;
import com.clinica.psicologia.system.service.clinical.PlanTratamientoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/plan-tratamiento")
public class PlanTratamientoController {

    private final PlanTratamientoService service;
    private final ObjetivoTerapiaService objetivoTerapiaService;

    public PlanTratamientoController(PlanTratamientoService service, ObjetivoTerapiaService objetivoTerapiaService) {
        this.service = service;
        this.objetivoTerapiaService = objetivoTerapiaService;
    }

    @GetMapping
    public List<PlanTratamientoResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PlanTratamientoResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlanTratamientoResponseDTO create(@Valid @RequestBody PlanTratamientoRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public PlanTratamientoResponseDTO update(@PathVariable Integer id,
            @Valid @RequestBody PlanTratamientoRequestDTO request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeStatus(@PathVariable Integer id, @RequestBody EstadoChangeRequestDTO request) {
        service.changeStatus(id, request.getEstadoId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/{id}/diagnosticos")
    public ResponseEntity<List<ObjetivoTerapiaResponseDTO>> obtenerObjetivos(@PathVariable Integer id) {
        return ResponseEntity.ok(objetivoTerapiaService.getByPlanTratamiento(id));
    }

}