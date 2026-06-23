package com.clinica.psicologia.system.controller.patient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.clinica.psicologia.system.dto.request.patient.PacienteRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.ContactoEmergenciaResponseDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteResponseDTO;
import com.clinica.psicologia.system.service.patient.ContactoEmergenciaService;
import com.clinica.psicologia.system.service.patient.PacienteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService service;
    private final ContactoEmergenciaService contactoEmergenciaService;

    @PostMapping
    public ResponseEntity<PacienteResponseDTO> crear(
            @Valid @RequestBody PacienteRequestDTO dto) {

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(service.crearPaciente(dto));
    }

    @GetMapping
    public List<PacienteResponseDTO> listar() {
        return service.obtenerPacientes();
    }

    @GetMapping("/{id}")
    public PacienteResponseDTO obtener(@PathVariable Integer id) {
        return service.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody PacienteRequestDTO dto) {

        return ResponseEntity.ok(
                service.actualizarPaciente(id, dto));
    }

    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, String>> handleValidation(
                MethodArgumentNotValidException ex) {

            Map<String, String> errors = new HashMap<>();

            ex.getBindingResult()
                    .getFieldErrors()
                    .forEach(error ->
                            errors.put(
                                    error.getField(),
                                    error.getDefaultMessage()));

            return ResponseEntity.badRequest().body(errors);
        }
    }

    @GetMapping("/{id}/contactos-emergencia")
    public ResponseEntity<List<ContactoEmergenciaResponseDTO>> obtenerContactosEmergencia(@PathVariable Integer id){
        return ResponseEntity.ok(contactoEmergenciaService.obtenerPorPaciente(id));
    }
}