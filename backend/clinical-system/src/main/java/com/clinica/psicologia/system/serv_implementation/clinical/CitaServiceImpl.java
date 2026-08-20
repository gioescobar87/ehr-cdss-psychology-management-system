package com.clinica.psicologia.system.serv_implementation.clinical;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.CancelarCitaRequestDTO;
import com.clinica.psicologia.system.dto.request.clinical.CitaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.CancelacionResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.CitaResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.CancelacionMapper;
import com.clinica.psicologia.system.mapper.clinical.CitaMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.clinical.Cancelacion;
import com.clinica.psicologia.system.model.clinical.Cita;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.clinical.CancelacionRepository;
import com.clinica.psicologia.system.repository.clinical.CitaRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.security.model.SecurityUser;
import com.clinica.psicologia.system.service.clinical.CitaService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

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
        private final CancelacionRepository cancelacionRepository;
        private final CancelacionMapper cancelacionMapper;
        private final SesionRepository sesionRepository;
        private final ApplicationSupportService supportService;

        @Override
        public CitaResponseDTO create(CitaRequestDTO dto) {

                validarFechas(dto);

                validarTraslapes(dto);

                Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Paciente no encontrado: " + dto.getPacienteId()));

                Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Usuario no encontrado: " + dto.getUsuarioId()));

                Estado estado = estadoRepository.findById(dto.getEstadoId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Estado no encontrado: " + dto.getEstadoId()));

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

                return toResponseDTOWithSession(entity);
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

                validarTraslapes(dto);

                entity.setPaciente(paciente);
                entity.setUsuario(usuario);
                entity.setEstado(estado);

                mapper.updateEntity(entity, dto);

                entity = repository.save(entity);

                return toResponseDTOWithSession(entity);
        }

        @Override
        public void changeStatus(Integer id, Integer estadoId) {

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

                if (repository.existsByUsuarioIdAndEstadoIdNotAndFechaHoraInicioLessThanAndFechaHoraFinGreaterThan(
                                dto.getUsuarioId(),
                                supportService.getEstado("CANCELADA").getId(),
                                dto.getFechaHoraFin(),
                                dto.getFechaHoraInicio())) {

                        throw new BusinessRuleException(
                                        "El psicólogo ya tiene una cita programada en ese horario.");
                }

                if (repository.existsByPacienteIdAndEstadoIdNotAndFechaHoraInicioLessThanAndFechaHoraFinGreaterThan(
                                dto.getPacienteId(),
                                supportService.getEstado("CANCELADA").getId(),
                                dto.getFechaHoraFin(),
                                dto.getFechaHoraInicio())) {

                        throw new BusinessRuleException(
                                        "El paciente ya tiene una cita programada en ese horario.");
                }
        }

        private Usuario getAuthenticatedUser() {
                SecurityUser securityUser = (SecurityUser) SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

                return securityUser.getUsuario();
        }

        @Override
        public CitaResponseDTO cancelar(Integer citaId, CancelarCitaRequestDTO request) {

                Cita cita = repository.findById(citaId)
                                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada: " + citaId));

                if (cancelacionRepository.existsByCitaId(citaId)) {
                        throw new BusinessRuleException("La cita ya fue cancelada.");
                }

                Usuario usuario = getAuthenticatedUser();

                Cancelacion cancelacion = new Cancelacion();

                cancelacion.setCita(cita);
                cancelacion.setUsuario(usuario);
                cancelacion.setMotivoCancelacion(request.getMotivoCancelacion());
                cancelacion.setFechaCancelacion(LocalDateTime.now());

                cancelacionRepository.save(cancelacion);

                Estado estadoCancelado = estadoRepository
                                .findById(7)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Estado CANCELADO no encontrado."));

                cita.setEstado(estadoCancelado);

                repository.save(cita);

                return toResponseDTOWithSession(cita);
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public CancelacionResponseDTO getCancelacion(Integer citaId) {
                Cancelacion cancelacion = cancelacionRepository
                                .findByCitaId(citaId)
                                .orElseThrow(() -> new ResourceNotFoundException("La cita no posee cancelación."));

                return cancelacionMapper.toResponseDTO(cancelacion);
        }

        private CitaResponseDTO toResponseDTOWithSession(Cita cita) {
                CitaResponseDTO dto = mapper.toResponseDTO(cita);
                sesionRepository.findFirstByCitaId(cita.getId()).ifPresent(sesion -> dto.setSesionId(sesion.getId()));
                return dto;
        }
}