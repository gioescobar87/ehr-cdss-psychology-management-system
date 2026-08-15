package com.clinica.psicologia.system.serv_implementation.clinical;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.SesionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.SesionMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.TipoSesion;
import com.clinica.psicologia.system.model.clinical.Cita;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.TipoSesionRepository;
import com.clinica.psicologia.system.repository.clinical.CitaRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.SesionService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SesionServiceImpl implements SesionService {

    private final SesionRepository repository;

    private final PacienteRepository pacienteRepository;

    private final UsuarioRepository usuarioRepository;

    private final TipoSesionRepository tipoSesionRepository;

    private final EstadoRepository estadoRepository;

    private final SesionMapper mapper;

    private final CitaRepository citaRepository;
    private final ApplicationSupportService supportService;

    @Override
    public SesionResponseDTO create(SesionRequestDTO request) {

        Cita cita = citaRepository.findById(request.getCitaId())
        .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada"));

        LocalDateTime sessionCreationStart = cita.getFechaHoraInicio().minusMinutes(30);

        if (LocalDateTime.now().isBefore(sessionCreationStart)) {
        throw new BusinessRuleException(
                "La sesión solo puede crearse hasta 30 minutos antes de la cita."
        );
        }

        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado."));

        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));

        if (repository.existsByPacienteIdAndUsuarioIdAndFechaSesion(
                request.getPacienteId(),
                request.getUsuarioId(),
                request.getFechaSesion())) {

            throw new DuplicateResourceException(
                    "Ya existe una sesión registrada para este paciente, psicólogo y fecha.");
        }

        TipoSesion tipoSesion = tipoSesionRepository.findById(request.getTipoSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de sesión no encontrado."));

        Estado estado = estadoRepository.findById(supportService.getActiveState().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Estado no encontrado."));

        Sesion entity = new Sesion();

        entity.setPaciente(paciente);
        entity.setUsuario(usuario);
        entity.setTipoSesion(tipoSesion);
        entity.setEstado(estado);
        entity.setCita(cita);

        mapper.updateEntity(entity, request);

        return mapper.toResponseDTO(repository.save(entity));
    }

    @Override
    public List<SesionResponseDTO> findAll() {

        return mapper.toResponseDTOList(repository.findAll());
    }

    @Override
    public SesionResponseDTO findById(Integer id) {

        Sesion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada."));

        return mapper.toResponseDTO(entity);
    }

    @Override
    public SesionResponseDTO update(Integer id, SesionRequestDTO request) {

        Sesion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada."));

        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado."));

        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));

        if (repository.existsByPacienteIdAndUsuarioIdAndFechaSesionAndIdNot(
                request.getPacienteId(),
                request.getUsuarioId(),
                request.getFechaSesion(),
                id)) {

            throw new DuplicateResourceException(
                    "Ya existe una sesión registrada para este paciente, psicólogo y fecha.");
        }

        TipoSesion tipoSesion = tipoSesionRepository.findById(request.getTipoSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de sesión no encontrado."));
        
        entity.setPaciente(paciente);
        entity.setUsuario(usuario);
        entity.setTipoSesion(tipoSesion);

        mapper.updateEntity(entity, request);

        return mapper.toResponseDTO(repository.save(entity));
    }

    @Override
    public void delete(Integer id) {

        Sesion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada."));

        repository.delete(entity);
    }

    @Override
    public List<SesionResponseDTO> getByPatient(Integer pacienteId) {

        return mapper.toResponseDTOList(
                repository.findByPacienteIdOrderByFechaSesionDesc(pacienteId));
    }

    @Override
    public List<SesionResponseDTO> getByUser(Integer usuarioId) {

        return mapper.toResponseDTOList(
                repository.findByUsuarioIdOrderByFechaSesionDesc(usuarioId));
    }

    @Override
    public List<SesionResponseDTO> getByCita(Integer citaId) {
        return mapper.toResponseDTOList(repository.findByCitaId(citaId));
    }
}