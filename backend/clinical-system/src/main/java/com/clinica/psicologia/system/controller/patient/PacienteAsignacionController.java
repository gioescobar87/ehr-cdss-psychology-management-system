package com.clinica.psicologia.system.controller.patient;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.patient.AsignarPacienteRequestDTO;
import com.clinica.psicologia.system.dto.request.patient.ReasignarPacienteRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteAsignacionResponseDTO;
import com.clinica.psicologia.system.service.patient.PacienteAsignacionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteAsignacionController {

    private final PacienteAsignacionService service;

    @PostMapping("/{id}/asignar")
    @ResponseStatus(HttpStatus.CREATED)
    public void asignarPaciente(@PathVariable Integer id, @Valid @RequestBody AsignarPacienteRequestDTO request) {
        service.asignarPaciente(id, request);
    }

    @PostMapping("/{id}/reasignar")
    public void reasignarPaciente(@PathVariable Integer id, @Valid @RequestBody ReasignarPacienteRequestDTO request) {
        service.reasignarPaciente(id, request);
    }

    @GetMapping("/{id}/historial-asignaciones")
    public List<PacienteAsignacionResponseDTO> historialAsignaciones(@PathVariable Integer id) {
        return service.historialAsignaciones(id);
    }
}