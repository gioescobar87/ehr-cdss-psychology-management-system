package com.clinica.psicologia.system.controller.clinical;

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

import com.clinica.psicologia.system.dto.request.clinical.HistorialMedicoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.HistorialMedicoResponseDTO;
import com.clinica.psicologia.system.service.clinical.HistorialMedicoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/historial-medico")
@RequiredArgsConstructor
public class HistorialMedicoController {
    private final HistorialMedicoService historialMedicoService;

    @PostMapping
    public ResponseEntity<HistorialMedicoResponseDTO> crear(@Valid @RequestBody HistorialMedicoRequestDTO dto){
        return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(historialMedicoService.crear(dto));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<HistorialMedicoResponseDTO>> obtenerPorPaciente(@PathVariable Integer pacienteId){
        return ResponseEntity.ok(historialMedicoService.obtenerPorPaciente(pacienteId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistorialMedicoResponseDTO> obtenerPorId(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                historialMedicoService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistorialMedicoResponseDTO> actualizar(
            @PathVariable Integer id,
            @RequestBody HistorialMedicoRequestDTO dto) {

        return ResponseEntity.ok(
                historialMedicoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(
            @PathVariable Integer id) {

        historialMedicoService.desactivar(id);

        return ResponseEntity.noContent().build();
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

}
