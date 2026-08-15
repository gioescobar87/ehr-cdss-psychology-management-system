package com.clinica.psicologia.system.controller.clinical;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.clinical.CancelarCitaRequestDTO;
import com.clinica.psicologia.system.dto.request.clinical.CitaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.CancelacionResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.CitaResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionResponseDTO;
import com.clinica.psicologia.system.service.clinical.CitaService;
import com.clinica.psicologia.system.service.clinical.SesionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cita")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService service;
    private final SesionService sesionService;

    @PostMapping
    public CitaResponseDTO create(@Valid @RequestBody CitaRequestDTO request) {
        return service.create(request);
    }

    @GetMapping
    public List<CitaResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public CitaResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public CitaResponseDTO update(@PathVariable Integer id, @Valid @RequestBody CitaRequestDTO request) {
        System.out.println("PATH VARIABLE: "+id);
        return service.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    public void changeStatus(@PathVariable Integer id, @RequestParam Integer estadoId) {
        service.changeStatus(id, estadoId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/agenda")
    public List<CitaResponseDTO> getAgenda(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return service.getAgenda(fecha);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<CitaResponseDTO> getByUser(@PathVariable Integer usuarioId) {
        return service.getByUser(usuarioId);
    }

    @PostMapping("/{id}/cancelar")
    public CitaResponseDTO cancelar(@PathVariable Integer id, @Valid @RequestBody CancelarCitaRequestDTO request) {
        return service.cancelar(id, request);
    }

    @GetMapping("/{id}/cancelacion")
    public CancelacionResponseDTO getCancelacion(@PathVariable Integer id) {
        return service.getCancelacion(id);
    }

    @GetMapping("/{id}/sesion")
    public List<SesionResponseDTO> getByCita(@PathVariable Integer id) {
        return sesionService.getByCita(id);
    }
}