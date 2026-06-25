package com.clinica.psicologia.system.controller.patient;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.patient.PacienteMedicamentoRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteMedicamentoResponseDTO;
import com.clinica.psicologia.system.service.patient.PacienteMedicamentoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/paciente-medicamento")
public class PacienteMedicamentoController {

    private final PacienteMedicamentoService service;

    public PacienteMedicamentoController(PacienteMedicamentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<PacienteMedicamentoResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PacienteMedicamentoResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PacienteMedicamentoResponseDTO create(@Valid @RequestBody PacienteMedicamentoRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public PacienteMedicamentoResponseDTO update(@PathVariable Integer id,
            @Valid @RequestBody PacienteMedicamentoRequestDTO request) {
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
}