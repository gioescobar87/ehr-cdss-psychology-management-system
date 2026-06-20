package com.clinica.psicologia.system.controller.catalog;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.catalog.CondicionMedicaRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.CondicionMedicaResponseDTO;
import com.clinica.psicologia.system.service.catalog.CondicionMedicaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/catalogos/condicion-medica")
public class CondicionMedicaController {

    private final CondicionMedicaService service;

    public CondicionMedicaController(
            CondicionMedicaService service) {

        this.service = service;
    }

    @GetMapping
    public List<CondicionMedicaResponseDTO> findAll() {

        return service.findAll();
    }

    @GetMapping("/{id}")
    public CondicionMedicaResponseDTO findById(
            @PathVariable Integer id) {

        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CondicionMedicaResponseDTO create(
            @Valid
            @RequestBody
            CondicionMedicaRequestDTO request) {

        return service.create(request);
    }

    @PutMapping("/{id}")
    public CondicionMedicaResponseDTO update(
            @PathVariable Integer id,
            @Valid
            @RequestBody
            CondicionMedicaRequestDTO request) {

        return service.update(
                id,
                request);
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