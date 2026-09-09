package com.clinica.psicologia.system.serv_implementation.patient;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.patient.CerrarCasoRequestDTO;
import com.clinica.psicologia.system.dto.request.patient.PacienteRequestDTO;
import com.clinica.psicologia.system.dto.request.patient.AsignarPacienteRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteResponseDTO;
import com.clinica.psicologia.system.mapper.patient.PacienteMapper;
import com.clinica.psicologia.system.model.catalog.EstadoCivil;
import com.clinica.psicologia.system.model.catalog.NivelEscolaridad;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.repository.catalog.EstadoCivilRepository;
import com.clinica.psicologia.system.repository.catalog.NivelEscolaridadRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.patient.PacienteService;
import com.clinica.psicologia.system.service.patient.PacienteAsignacionService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;
    private final PacienteMapper pacienteMapper;
    private final EstadoCivilRepository estadoCivilRepository;
    private final NivelEscolaridadRepository nivelEscolaridadRepository;
    private final ApplicationSupportService supportService;
    private final PacienteAsignacionService pacienteAsignacionService;
    private final com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService clinicalAuthorizationService;

    @Override
    public PacienteResponseDTO crearPaciente(PacienteRequestDTO dto) {

        Paciente paciente = pacienteMapper.toEntity(dto);

        paciente.setEstado(supportService.getActiveState());
        paciente.setEstadoCivil(obtenerEstadoCivil(dto.estadoCivilId()));
        paciente.setNivelEscolaridad(obtenerNivelEscolaridad(dto.nivelEscolaridadId()));
        paciente = pacienteRepository.save(paciente);

        AsignarPacienteRequestDTO asignacion = new AsignarPacienteRequestDTO();
        asignacion.setPsicologoId(clinicalAuthorizationService.getAuthenticatedUser().getId());
        asignacion.setMotivoAsignacion("Asignación inicial al crear paciente");
        pacienteAsignacionService.asignarPaciente(paciente.getId(), asignacion);

        return pacienteMapper.toResponse(paciente);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PacienteResponseDTO> obtenerPacientes() {
        return pacienteRepository.findByFechaCierreIsNull()
                .stream()
                .map(pacienteMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public PacienteResponseDTO obtenerPorId(Integer id) {

        Paciente paciente = obtenerPaciente(id);

        return pacienteMapper.toResponse(paciente);
    }

    @Override
    public PacienteResponseDTO actualizarPaciente(Integer id, PacienteRequestDTO dto) {

        Paciente paciente = obtenerPaciente(id);

        pacienteMapper.updateEntityFromDto(dto, paciente);

        paciente.setEstadoCivil(obtenerEstadoCivil(dto.estadoCivilId()));
        paciente.setNivelEscolaridad(obtenerNivelEscolaridad(dto.nivelEscolaridadId()));
        paciente = pacienteRepository.save(paciente);

        return pacienteMapper.toResponse(paciente);
    }

    @Override
    public PacienteResponseDTO cerrarCaso(Integer id, CerrarCasoRequestDTO dto) {

        Paciente paciente = obtenerPaciente(id);

        if (paciente.getFechaCierre() != null) {
            throw new BusinessRuleException("El caso del paciente ya fue cerrado.");
        }

        paciente.setFechaCierre(java.time.LocalDateTime.now());
        paciente.setMotivoCierre(dto.getMotivoCierre());
        paciente.setEstado(supportService.getInactiveState());

        paciente = pacienteRepository.save(paciente);

        return pacienteMapper.toResponse(paciente);
    }

    private Paciente obtenerPaciente(Integer id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Paciente no encontrado: " + id));
    }
    private EstadoCivil obtenerEstadoCivil(Integer id) {
        if (id == null) {
            return null;
        }

        return estadoCivilRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Estado civil no encontrado: " + id));
    }

    private NivelEscolaridad obtenerNivelEscolaridad(Integer id) {
        if (id == null) {
            return null;
        }

        return nivelEscolaridadRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Nivel de escolaridad no encontrado: " + id
                        )
                );
    }
}