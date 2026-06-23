package com.clinica.psicologia.system.controller.patient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.clinica.psicologia.system.dto.request.patient.ContactoEmergenciaRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.ContactoEmergenciaResponseDTO;
import com.clinica.psicologia.system.service.patient.ContactoEmergenciaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contactos-emergencia")
@RequiredArgsConstructor
public class ContactoEmergenciaController {

    private final ContactoEmergenciaService service;

    @PostMapping
    public ResponseEntity<ContactoEmergenciaResponseDTO> crear(
            @Valid @RequestBody ContactoEmergenciaRequestDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.crear(dto));
    }

    @GetMapping
    public ResponseEntity<List<ContactoEmergenciaResponseDTO>>
    obtenerTodos() {

        return ResponseEntity.ok(
                service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactoEmergenciaResponseDTO>
    obtenerPorId(@PathVariable Integer id) {

        return ResponseEntity.ok(
                service.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactoEmergenciaResponseDTO>
    actualizar(
            @PathVariable Integer id,
            @RequestBody ContactoEmergenciaRequestDTO dto) {

        return ResponseEntity.ok(
                service.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(
            @PathVariable Integer id) {

        service.desactivar(id);

        return ResponseEntity.noContent().build();
    }

    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(
                MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, String>>
        handleValidation(
                MethodArgumentNotValidException ex) {

            Map<String, String> errors =
                    new HashMap<>();

            ex.getBindingResult()
                    .getFieldErrors()
                    .forEach(error ->
                            errors.put(
                                    error.getField(),
                                    error.getDefaultMessage()));

            return ResponseEntity
                    .badRequest()
                    .body(errors);
        }
    }
}