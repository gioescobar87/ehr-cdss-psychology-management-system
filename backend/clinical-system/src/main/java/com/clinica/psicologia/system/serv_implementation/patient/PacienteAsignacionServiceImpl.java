package com.clinica.psicologia.system.serv_implementation.patient;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.patient.AsignarPacienteRequestDTO;
import com.clinica.psicologia.system.dto.request.patient.ReasignarPacienteRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteAsignacionResponseDTO;
import com.clinica.psicologia.system.mapper.patient.PacienteAsignacionMapper;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.patient.PacienteAsignacion;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.patient.PacienteAsignacionRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRolRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.patient.PacienteAsignacionService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteAsignacionServiceImpl
        implements PacienteAsignacionService {

    private static final String ROL_PSICOLOGO = "PSICOLOGO";

    private final PacienteAsignacionRepository repository;
    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioRolRepository usuarioRolRepository;
    private final PacienteAsignacionMapper mapper;

    // =====================================================
    // ASIGNAR PACIENTE
    // =====================================================
    @Override
    public PacienteAsignacionResponseDTO asignarPaciente(
            Integer pacienteId,
            AsignarPacienteRequestDTO request) {

        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        Usuario psicologo = usuarioRepository.findById(request.getPsicologoId())
                .orElseThrow(() -> new ResourceNotFoundException("Psicólogo no encontrado"));

        validarPsicologo(psicologo);

        repository.findFirstByPacienteIdAndFechaFinIsNull(pacienteId)
                .ifPresent(a -> {
                    throw new BusinessRuleException("El paciente ya posee una asignación activa");
                });

        PacienteAsignacion asignacion = new PacienteAsignacion();

        asignacion.setPaciente(paciente);
        asignacion.setPsicologo(psicologo);
        asignacion.setFechaAsignacion(LocalDateTime.now());
        asignacion.setMotivoAsignacion(request.getMotivoAsignacion());

        asignacion = repository.save(asignacion);

        return mapper.toResponse(asignacion);
    }

    // =====================================================
    // REASIGNAR PACIENTE
    // =====================================================
    @Override
    public PacienteAsignacionResponseDTO reasignarPaciente(Integer pacienteId, ReasignarPacienteRequestDTO request) {

        PacienteAsignacion actual = repository.findFirstByPacienteIdAndFechaFinIsNull(pacienteId)
                .orElseThrow(() -> new BusinessRuleException("El paciente no posee asignación activa"));

        Usuario nuevoPsicologo = usuarioRepository.findById(request.getNuevoPsicologoId())
                .orElseThrow(() -> new ResourceNotFoundException("Psicólogo no encontrado"));

        validarPsicologo(nuevoPsicologo);

        if (actual.getPsicologo().getId().equals(request.getNuevoPsicologoId())) {
            throw new BusinessRuleException("El paciente ya está asignado a este psicólogo");
        }

        Usuario usuarioCambio = usuarioRepository.findById(
                request.getUsuarioCambioId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario que realiza el cambio no encontrado"));

        // ============================================
        // CERRAR ASIGNACIÓN ACTUAL
        // ============================================

        actual.setFechaFin(LocalDateTime.now());
        actual.setJustificacionReasignacion(request.getJustificacionReasignacion());
        actual.setUsuarioCambio(usuarioCambio);

        repository.save(actual);

        // ============================================
        // NUEVA ASIGNACIÓN
        // ============================================

        PacienteAsignacion nueva = new PacienteAsignacion();

        nueva.setPaciente(actual.getPaciente());
        nueva.setPsicologo(nuevoPsicologo);

        nueva.setUsuarioCambio(usuarioCambio);

        nueva.setFechaAsignacion(LocalDateTime.now());

        nueva.setMotivoAsignacion("Reasignación de paciente");

        nueva = repository.save(nueva);

        return mapper.toResponse(nueva);
    }

    // =====================================================
    // HISTORIAL
    // =====================================================
    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PacienteAsignacionResponseDTO> historialAsignaciones(Integer pacienteId) {

        pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        return mapper.toResponseList(
                repository.findByPacienteIdOrderByFechaAsignacionDesc(pacienteId));
    }

    // =====================================================
    // VALIDAR PSICÓLOGO
    // =====================================================
    private void validarPsicologo(Usuario usuario) {

        boolean esPsicologo = usuarioRolRepository.existsByUsuarioAndRolNombre(usuario, ROL_PSICOLOGO);

        if (!esPsicologo) {
            throw new DuplicateResourceException("El usuario seleccionado no posee el rol PSICOLOGO");
        }
    }

    @Transactional
    public void deleteByPaciente(Integer pacienteId) {

        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        repository.deleteByPaciente(paciente);
    }
}