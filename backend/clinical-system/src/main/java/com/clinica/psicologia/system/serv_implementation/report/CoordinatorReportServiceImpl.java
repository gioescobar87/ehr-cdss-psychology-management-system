package com.clinica.psicologia.system.serv_implementation.report;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.dto.response.clinical.CitaResponseDTO;
import com.clinica.psicologia.system.dto.response.coordinator.CoordinatorPatientDiagnosisDTO;
import com.clinica.psicologia.system.dto.response.coordinator.CoordinatorPatientResponseDTO;
import com.clinica.psicologia.system.dto.response.coordinator.CoordinatorSummaryResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.CitaMapper;
import com.clinica.psicologia.system.model.CoordinatorAppointmentSessionProjection;
import com.clinica.psicologia.system.model.CoordinatorPatientCountProjection;
import com.clinica.psicologia.system.model.CoordinatorPatientDiagnosisProjection;
import com.clinica.psicologia.system.model.CoordinatorPatientSessionProjection;
import com.clinica.psicologia.system.model.CoordinatorSummaryMetricsProjection;
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
        public List<CoordinatorSummaryResponseDTO> getSummary(
                        LocalDate startDate,
                        LocalDate endDate) {

                Integer coordinatorId = authenticatedUser().getId();

                List<Usuario> psychologists = repository.findPsychologists(coordinatorId);

                Map<Integer, CoordinatorSummaryMetricsProjection> summaryMetrics = repository.findSummaryMetrics(
                                coordinatorId,
                                startDate.atStartOfDay(),
                                endDate.plusDays(1).atStartOfDay())
                                .stream()
                                .collect(Collectors.toMap(
                                                CoordinatorSummaryMetricsProjection::getPsychologistId,
                                                metrics -> metrics));

                Map<Integer, Long> patientCounts = repository
                                .findCurrentPatientCounts(coordinatorId)
                                .stream()
                                .collect(Collectors.toMap(
                                                CoordinatorPatientCountProjection::getPsychologistId,
                                                CoordinatorPatientCountProjection::getPatientCount));

                return psychologists.stream()
                                .map(psychologist -> {

                                        CoordinatorSummaryMetricsProjection metrics = summaryMetrics
                                                        .get(psychologist.getId());

                                        long appointmentCount = metrics == null
                                                        ? 0
                                                        : metrics.getAppointmentCount();

                                        long attendedCount = metrics == null
                                                        ? 0
                                                        : metrics.getAttendedCount();

                                        long cancelledCount = metrics == null
                                                        ? 0
                                                        : metrics.getCancelledCount();

                                        double cancellationRate = appointmentCount == 0
                                                        ? 0
                                                        : cancelledCount * 100.0 / appointmentCount;

                                        return new CoordinatorSummaryResponseDTO(
                                                        psychologist.getId(),
                                                        fullName(psychologist),
                                                        patientCounts.getOrDefault(
                                                                        psychologist.getId(),
                                                                        0L),
                                                        appointmentCount,
                                                        attendedCount,
                                                        cancelledCount,
                                                        cancellationRate);
                                })
                                .sorted((left, right) -> Double.compare(
                                                right.getCancellationRate(),
                                                left.getCancellationRate()))
                                .toList();
        }

        @Override
        public List<CoordinatorPatientResponseDTO> getPatients(
                        String status,
                        Integer psychologistId,
                        String search) {

                Integer coordinatorId = authenticatedUser().getId();

                String normalizedStatus = status == null || status.isBlank()
                                ? null
                                : status.trim();

                String normalizedSearch = search == null
                                ? ""
                                : search.trim().toLowerCase(Locale.ROOT);

                List<PacienteAsignacion> assignments = repository.findPatients(
                                coordinatorId,
                                normalizedStatus,
                                psychologistId);

                List<PacienteAsignacion> patients = assignments.stream()
                                .filter(assignment -> normalizedSearch.isEmpty()
                                                || fullPatientName(assignment)
                                                                .toLowerCase(Locale.ROOT)
                                                                .contains(normalizedSearch))
                                .toList();

                if (patients.isEmpty()) {
                        return List.of();
                }

                List<Integer> patientIds = patients.stream()
                                .map(assignment -> assignment.getPaciente().getId())
                                .toList();

                Map<Integer, List<CoordinatorPatientDiagnosisDTO>> diagnosesByPatient = repository
                                .findPatientDiagnoses(patientIds)
                                .stream()
                                .collect(Collectors.groupingBy(
                                                CoordinatorPatientDiagnosisProjection::getPatientId,
                                                LinkedHashMap::new,
                                                Collectors.mapping(
                                                                this::toDiagnosisResponse,
                                                                Collectors.toList())));

                Map<Integer, Integer> latestSessionByPatient = repository
                                .findLatestPatientSessions(patientIds)
                                .stream()
                                .collect(Collectors.toMap(
                                                CoordinatorPatientSessionProjection::getPatientId,
                                                CoordinatorPatientSessionProjection::getSessionId));

                return patients.stream()
                                .map(assignment -> {
                                        var patient = assignment.getPaciente();
                                        var psychologist = assignment.getPsicologo();

                                        return new CoordinatorPatientResponseDTO(
                                                patient.getId(),
                                                fullPatientName(assignment),
                                                psychologist.getId(),
                                                fullName(psychologist),
                                                patient.getEstado().getNombre(),
                                                patient.getFechaInicio(),
                                                patient.getMotivoInicio(),
                                                patient.getFechaCierre(),
                                                patient.getMotivoCierre(),
                                                patient.getRefiere(),
                                                latestSessionByPatient.get(patient.getId()),
                                                diagnosesByPatient.getOrDefault(
                                                                patient.getId(),
                                                                List.of()));
                                })
                                .toList();
        }

        @Override
        public List<CitaResponseDTO> getAgenda(LocalDate startDate) {

                Integer coordinatorId = authenticatedUser().getId();

                List<Cita> appointments = repository.findScopedAppointments(
                                coordinatorId,
                                startDate.atStartOfDay(),
                                startDate.plusDays(5).atStartOfDay());

                if (appointments.isEmpty()) {
                        return List.of();
                }

                Map<Integer, Integer> sessionByAppointment = repository
                                .findSessionsByAppointmentIds(appointments.stream()
                                                .map(Cita::getId)
                                                .toList())
                                .stream()
                                .collect(Collectors.toMap(
                                                CoordinatorAppointmentSessionProjection::getAppointmentId,
                                                CoordinatorAppointmentSessionProjection::getSessionId));

                return appointments.stream()
                                .map(appointment -> toAgendaResponse(
                                                appointment,
                                                sessionByAppointment.get(appointment.getId())))
                                .toList();
        }

        private CoordinatorPatientDiagnosisDTO toDiagnosisResponse(
                        CoordinatorPatientDiagnosisProjection diagnosis) {

                return new CoordinatorPatientDiagnosisDTO(
                                diagnosis.getDiagnosisId(),
                                diagnosis.getCode(),
                                diagnosis.getName(),
                                diagnosis.getDiagnosisDate(),
                                diagnosis.getInitial());
        }

        private CitaResponseDTO toAgendaResponse(Cita cita, Integer sessionId) {

                CitaResponseDTO response = citaMapper.toResponseDTO(cita, sessionId);

                return response;
        }

        private Usuario authenticatedUser() {

                return ((SecurityUser) SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal())
                                .getUsuario();
        }

        private String fullName(Usuario user) {

                return user.getNombre() + " " + user.getApellido();
        }

        private String fullPatientName(PacienteAsignacion assignment) {

                return assignment.getPaciente().getNombre()
                                + " "
                                + assignment.getPaciente().getApellido();
        }
}