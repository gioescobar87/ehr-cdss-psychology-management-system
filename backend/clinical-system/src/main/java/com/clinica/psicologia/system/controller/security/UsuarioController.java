package com.clinica.psicologia.system.controller.security;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.request.security.UsuarioRequestDTO;
import com.clinica.psicologia.system.dto.request.security.UsuarioRolRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.CitaResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionResponseDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteAsignacionResponseDTO;
import com.clinica.psicologia.system.dto.response.security.UsuarioResponseDTO;
import com.clinica.psicologia.system.dto.response.security.UsuarioRolResponseDTO;
import com.clinica.psicologia.system.service.clinical.CitaService;
import com.clinica.psicologia.system.service.clinical.SesionService;
import com.clinica.psicologia.system.service.patient.PacienteAsignacionService;
import com.clinica.psicologia.system.service.security.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final CitaService citaService;
    private final SesionService sesionService;
    private final PacienteAsignacionService pacienteAsignacionService;

    @GetMapping
    public List<UsuarioResponseDTO> findAll() {
        return usuarioService.findAll();
    }

    @GetMapping("/{id}")
    public UsuarioResponseDTO findById(@PathVariable Integer id) {
        return usuarioService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponseDTO create(@Valid @RequestBody UsuarioRequestDTO request) {
        return usuarioService.create(request);
    }

    @PutMapping("/{id}")
    public UsuarioResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioRequestDTO request) {
        return usuarioService.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    public void changeStatus(
            @PathVariable Integer id,
            @Valid @RequestBody EstadoChangeRequestDTO request) {

        usuarioService.changeStatus(id, request.getEstadoId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        usuarioService.delete(id);
    }

    // =========================
    // ROLES
    // =========================

    @GetMapping("/{id}/roles")
    public List<UsuarioRolResponseDTO> getRoles(@PathVariable Integer id) {
        return usuarioService.getRoles(id);
    }

    @PostMapping("/{id}/roles")
    @ResponseStatus(HttpStatus.CREATED)
    public void assignRole(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioRolRequestDTO request) {

        usuarioService.assignRole(id, request.getRolId());
    }

    @DeleteMapping("/{id}/roles/{rolId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeRole(
            @PathVariable Integer id,
            @PathVariable Integer rolId) {

        usuarioService.removeRole(id, rolId);
    }

    @GetMapping("/{id}/citas")
    public ResponseEntity<List<CitaResponseDTO>> obtenerCitas(@PathVariable Integer id) {
        return ResponseEntity.ok(citaService.getByUser(id));
    }

    @GetMapping("/{id}/sesiones")
    public ResponseEntity<List<SesionResponseDTO>> obtenerSesiones(@PathVariable Integer id) {
        return ResponseEntity.ok(sesionService.getByUser(id));
    }

    @GetMapping("/{id}/sesiones-asignadas")
    public ResponseEntity<List<SesionResponseDTO>> obtenerSesionesAsignadas(@PathVariable Integer id) {
        return ResponseEntity.ok(sesionService.getByUserActivePatient(id));
    }

    @GetMapping("/{id}/pacientes")
    public ResponseEntity<List<PacienteAsignacionResponseDTO>> obtenerPacientes(@PathVariable Integer id) {
        return ResponseEntity.ok(pacienteAsignacionService.getPacientesActualesByUsuario(id));
    }
}