package com.clinica.psicologia.system.serv_implementation.report;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.dto.response.clinical.CitaResponseDTO;
import com.clinica.psicologia.system.dto.response.report.CoordinatorPatientResponseDTO;
import com.clinica.psicologia.system.dto.response.report.CoordinatorSummaryResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.CitaMapper;
import com.clinica.psicologia.system.model.clinical.Cita;
import com.clinica.psicologia.system.model.patient.PacienteAsignacion;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.report.CoordinatorReportRepository;
import com.clinica.psicologia.system.security.model.SecurityUser;
import com.clinica.psicologia.system.service.report.CoordinatorReportService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CoordinatorReportServiceImpl implements CoordinatorReportService {

        private final CoordinatorReportRepository repository;
        private final CitaMapper citaMapper;

        @Override
        public List<CoordinatorSummaryResponseDTO> getSummary(LocalDate startDate, LocalDate endDate) {
                Integer coordinatorId = authenticatedUser().getId();
                List<Usuario> psychologists = repository.findPsychologists(coordinatorId);
                List<Cita> appointments = repository.findScopedAppointments(
                                coordinatorId, startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay());
                Set<Integer> cancelledIds = new HashSet<>(repository.findCancelledAppointmentIds(
                                coordinatorId, startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay()));
                Map<Integer, Long> patientCounts = repository.findCurrentAssignments(coordinatorId).stream()
                                .collect(Collectors.groupingBy(a -> a.getPsicologo().getId(), Collectors.mapping(
                                                a -> a.getPaciente().getId(), Collectors.toSet())))
                                .entrySet().stream()
                                .collect(Collectors.toMap(Map.Entry::getKey, entry -> (long) entry.getValue().size()));
                Map<Integer, List<Cita>> appointmentsByPsychologist = appointments.stream()
                                .collect(Collectors.groupingBy(cita -> cita.getUsuario().getId()));

                return psychologists.stream().map(psychologist -> {
                        List<Cita> psychologistAppointments = appointmentsByPsychologist
                                        .getOrDefault(psychologist.getId(), List.of());
                        long cancelledCount = psychologistAppointments.stream()
                                        .filter(cita -> cancelledIds.contains(cita.getId())).count();
                        long appointmentCount = psychologistAppointments.size();
                        long attendedCount = psychologistAppointments.stream()
                                        .filter(cita -> "COMPLETADA".equalsIgnoreCase(cita.getEstado().getNombre()))
                                        .count();
                        double cancellationRate = appointmentCount == 0 ? 0 : cancelledCount * 100.0 / appointmentCount;
                        return new CoordinatorSummaryResponseDTO(
                                        psychologist.getId(), fullName(psychologist),
                                        patientCounts.getOrDefault(psychologist.getId(), 0L),
                                        appointmentCount, attendedCount, cancelledCount, cancellationRate);
                }).sorted((left, right) -> Double.compare(right.getCancellationRate(), left.getCancellationRate()))
                                .toList();
        }

        @Override
        public List<CoordinatorPatientResponseDTO> getPatients(String status, Integer psychologistId, String search) {
                Integer coordinatorId = authenticatedUser().getId();
                String normalizedSearch = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);
                return repository.findCurrentAssignments(coordinatorId).stream()
                                .filter(assignment -> psychologistId == null
                                                || assignment.getPsicologo().getId().equals(psychologistId))
                                .filter(assignment -> status == null || status.isBlank()
                                                || assignment.getPaciente().getEstado().getNombre()
                                                                .equalsIgnoreCase(status))
                                .filter(assignment -> normalizedSearch.isBlank()
                                                || fullName(assignment.getPaciente()).toLowerCase(Locale.ROOT)
                                                                .contains(normalizedSearch))
                                .map(this::toPatientResponse)
                                .toList();
        }

        @Override
        public List<CitaResponseDTO> getAgenda(LocalDate startDate) {
                Integer coordinatorId = authenticatedUser().getId();
                return repository.findScopedAppointments(
                                coordinatorId, startDate.atStartOfDay(), startDate.plusDays(5).atStartOfDay())
                                .stream().map(this::toAgendaResponse).toList();
        }

        private CoordinatorPatientResponseDTO toPatientResponse(PacienteAsignacion assignment) {
                var patient = assignment.getPaciente();
                return new CoordinatorPatientResponseDTO(
                                patient.getId(), fullName(patient), assignment.getPsicologo().getId(),
                                fullName(assignment.getPsicologo()),
                                patient.getEstado().getNombre(), patient.getFechaInicio(), patient.getMotivoInicio(),
                                patient.getFechaCierre(), patient.getMotivoCierre());
        }

        private CitaResponseDTO toAgendaResponse(Cita cita) {
                CitaResponseDTO response = citaMapper.toResponseDTO(cita);
                response.setTieneSesion(false);
                response.setSesionId(null);
                return response;
        }

        private Usuario authenticatedUser() {
                return ((SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                                .getUsuario();
        }

        private String fullName(Usuario user) {
                return user.getNombre() + " " + user.getApellido();
        }

        private String fullName(com.clinica.psicologia.system.model.patient.Paciente patient) {
                return patient.getNombre() + " " + patient.getApellido();
        }
}