package com.clinica.psicologia.system.serv_implementation.clinical;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.CitaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.CitaResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.CitaMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.clinical.Cita;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.clinical.CitaRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.CitaService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CitaServiceImpl implements CitaService {

    private final CitaRepository repository;
    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstadoRepository estadoRepository;
    private final CitaMapper mapper;

    @Override
    public CitaResponseDTO create(CitaRequestDTO dto) {

        validarFechas(dto);

        validarTraslapes(dto);

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado: " + dto.getPacienteId()));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + dto.getUsuarioId()));

        Estado estado = estadoRepository.findById(dto.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estado no encontrado: " + dto.getEstadoId()));

        Cita entity = new Cita();

        entity.setPaciente(paciente);
        entity.setUsuario(usuario);
        entity.setEstado(estado);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<CitaResponseDTO> findAll() {

        return mapper.toResponseDTOList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public CitaResponseDTO findById(Integer id) {

        Cita entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada: " + id));

        return mapper.toResponseDTO(entity);
    }

    @Override
    public CitaResponseDTO update(Integer id,
            CitaRequestDTO dto) {

        validarFechas(dto);

        Cita entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada: " + id));

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Estado estado = estadoRepository.findById(dto.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estado no encontrado"));

        if (repository.existsByUsuarioIdAndFechaHoraInicioLessThanAndFechaHoraFinGreaterThanAndIdNot(
                dto.getUsuarioId(),
                dto.getFechaHoraFin(),
                dto.getFechaHoraInicio(),
                id)) {

            throw new BusinessRuleException("El psicólogo ya tiene una cita en ese horario.");
        }

        if (repository.existsByPacienteIdAndFechaHoraInicioLessThanAndFechaHoraFinGreaterThanAndIdNot(
                dto.getPacienteId(),
                dto.getFechaHoraFin(),
                dto.getFechaHoraInicio(),
                id)) {

            throw new BusinessRuleException("El paciente ya tiene una cita en ese horario.");
        }

        entity.setPaciente(paciente);
        entity.setUsuario(usuario);
        entity.setEstado(estado);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void changeStatus(Integer id,
            Integer estadoId) {

        Cita entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("Estado no encontrado"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(Integer id) {

        Cita entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada"));

        repository.delete(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<CitaResponseDTO> getAgenda(LocalDate fecha) {

        return mapper.toResponseDTOList(
                repository.findByFechaHoraInicioBetween(
                        fecha.atStartOfDay(),
                        fecha.plusDays(1).atStartOfDay()));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<CitaResponseDTO> getByPatient(Integer pacienteId) {

        return mapper.toResponseDTOList(
                repository.findByPacienteId(pacienteId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<CitaResponseDTO> getByUser(Integer usuarioId) {

        return mapper.toResponseDTOList(
                repository.findByUsuarioId(usuarioId));
    }

    private void validarFechas(CitaRequestDTO dto) {

        if (!dto.getFechaHoraInicio().isBefore(dto.getFechaHoraFin())) {
            throw new BusinessRuleException(
                    "La fecha de inicio debe ser anterior a la fecha de finalización.");
        }
    }

    private void validarTraslapes(CitaRequestDTO dto) {

        if (repository.existsByUsuarioIdAndFechaHoraInicioLessThanAndFechaHoraFinGreaterThan(
                dto.getUsuarioId(),
                dto.getFechaHoraFin(),
                dto.getFechaHoraInicio())) {

            throw new BusinessRuleException(
                    "El psicólogo ya tiene una cita programada en ese horario.");
        }

        if (repository.existsByPacienteIdAndFechaHoraInicioLessThanAndFechaHoraFinGreaterThan(
                dto.getPacienteId(),
                dto.getFechaHoraFin(),
                dto.getFechaHoraInicio())) {

            throw new BusinessRuleException(
                    "El paciente ya tiene una cita programada en ese horario.");
        }
    }
}