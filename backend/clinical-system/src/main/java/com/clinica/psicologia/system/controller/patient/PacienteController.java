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
import com.clinica.psicologia.system.dto.response.clinical.CitaResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.EvaluacionRiesgoResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.ObjetivoTerapiaResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.PacienteDiagnosticoResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionIntervencionResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionResponseDTO;
import com.clinica.psicologia.system.dto.response.patient.ContactoEmergenciaResponseDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteAlergiaResponseDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteMedicamentoResponseDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteResponseDTO;
import com.clinica.psicologia.system.service.clinical.CitaService;
import com.clinica.psicologia.system.service.clinical.EvaluacionRiesgoService;
import com.clinica.psicologia.system.service.clinical.ObjetivoTerapiaService;
import com.clinica.psicologia.system.service.clinical.PacienteDiagnosticoService;
import com.clinica.psicologia.system.service.clinical.SesionIntervencionService;
import com.clinica.psicologia.system.service.clinical.SesionService;
import com.clinica.psicologia.system.service.patient.ContactoEmergenciaService;
import com.clinica.psicologia.system.service.patient.PacienteAlergiaService;
import com.clinica.psicologia.system.service.patient.PacienteMedicamentoService;
import com.clinica.psicologia.system.service.patient.PacienteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/paciente")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService service;
    private final ContactoEmergenciaService contactoEmergenciaService;
    private final PacienteAlergiaService pacienteAlergiaService;
    private final PacienteMedicamentoService pacienteMedicamentoService;
    private final CitaService citaService;
    private final SesionService sesionService;
    private final PacienteDiagnosticoService pacienteDiagnosticoService;
    private final EvaluacionRiesgoService evaluacionRiesgoService;
    private final ObjetivoTerapiaService objetivoTerapiaService;
    private final SesionIntervencionService sesionIntervencionService;

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
                    .forEach(error -> errors.put(
                            error.getField(),
                            error.getDefaultMessage()));

            return ResponseEntity.badRequest().body(errors);
        }
    }

    @GetMapping("/{id}/contacto-emergencia")
    public ResponseEntity<List<ContactoEmergenciaResponseDTO>> obtenerContactosEmergencia(@PathVariable Integer id) {
        return ResponseEntity.ok(contactoEmergenciaService.getByPatient(id));
    }

    @GetMapping("/{id}/alergia")
    public ResponseEntity<List<PacienteAlergiaResponseDTO>> obtenerAlergias(@PathVariable Integer id) {
        return ResponseEntity.ok(pacienteAlergiaService.getByPatient(id));
    }

    @GetMapping("/{id}/medicamento")
    public ResponseEntity<List<PacienteMedicamentoResponseDTO>> obtenerMedicamento(@PathVariable Integer id) {
        return ResponseEntity.ok(pacienteMedicamentoService.getByPatient(id));
    }

    @GetMapping("/{id}/citas")
    public ResponseEntity<List<CitaResponseDTO>> obtenerCitas(@PathVariable Integer id) {
        return ResponseEntity.ok(citaService.getByPatient(id));
    }

    @GetMapping("/{id}/sesiones")
    public ResponseEntity<List<SesionResponseDTO>> obtenerSesiones(@PathVariable Integer id) {
        return ResponseEntity.ok(sesionService.getByPatient(id));
    }

    @GetMapping("/{id}/diagnosticos")
    public ResponseEntity<List<PacienteDiagnosticoResponseDTO>> obtenerDiagnosticos(@PathVariable Integer id) {
        return ResponseEntity.ok(pacienteDiagnosticoService.getByPatient(id));
    }

    @GetMapping("/{id}/evaluaciones-riesgo")
    public ResponseEntity<List<EvaluacionRiesgoResponseDTO>> obtenerEvaluacionesRiesgo(@PathVariable Integer id) {
        return ResponseEntity.ok(evaluacionRiesgoService.getByPaciente(id));
    }

    @GetMapping("/{id}/objetivos")
    public ResponseEntity<List<ObjetivoTerapiaResponseDTO>> obtenerObjetivos(@PathVariable Integer id) {
        return ResponseEntity.ok(objetivoTerapiaService.getByPaciente(id));
    }

    @GetMapping("/{id}/intervenciones")
    public ResponseEntity<List<SesionIntervencionResponseDTO>> obtenerIntervenciones(@PathVariable Integer id) {
        return ResponseEntity.ok(sesionIntervencionService.getByPaciente(id));
    }
}