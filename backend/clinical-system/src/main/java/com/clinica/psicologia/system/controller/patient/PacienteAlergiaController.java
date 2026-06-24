package com.clinica.psicologia.system.controller.patient;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.patient.PacienteAlergiaRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteAlergiaResponseDTO;
import com.clinica.psicologia.system.service.patient.PacienteAlergiaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/paciente-alergias")
public class PacienteAlergiaController {

    private final PacienteAlergiaService service;

    public PacienteAlergiaController(
            PacienteAlergiaService service) {

        this.service = service;
    }

    @GetMapping
    public List<PacienteAlergiaResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PacienteAlergiaResponseDTO findById(
            @PathVariable Integer id) {

        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PacienteAlergiaResponseDTO create(
            @Valid
            @RequestBody
            PacienteAlergiaRequestDTO request) {

        return service.create(request);
    }

    @PutMapping("/{id}")
    public PacienteAlergiaResponseDTO update(
            @PathVariable Integer id,
            @Valid
            @RequestBody
            PacienteAlergiaRequestDTO request) {

        return service.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeStatus(
            @PathVariable Integer id,
            @RequestBody EstadoChangeRequestDTO request) {

        service.changeStatus(
                id,
                request.getEstadoId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Integer id) {

        service.delete(id);
    }
}