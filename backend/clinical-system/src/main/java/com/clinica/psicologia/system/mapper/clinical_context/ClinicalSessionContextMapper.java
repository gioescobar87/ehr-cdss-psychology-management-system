package com.clinica.psicologia.system.mapper.clinical_context;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextAllergyDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextDiagnosisDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextObjectiveDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextPatientDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextPreviewDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextPsychologicalTestDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextRiskDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalContextSessionDTO;
import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalSessionContextResponseDTO;
import com.clinica.psicologia.system.model.clinical.AplicacionPrueba;
import com.clinica.psicologia.system.model.clinical.EvaluacionRiesgo;
import com.clinica.psicologia.system.model.clinical.ObjetivoTerapia;
import com.clinica.psicologia.system.model.clinical.PacienteDiagnostico;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.patient.PacienteAlergia;

@Component
public class ClinicalSessionContextMapper {

    public ClinicalContextPatientDTO toPatientDTO(Paciente paciente) {

        ClinicalContextPatientDTO dto = new ClinicalContextPatientDTO();

        dto.setId(paciente.getId());
        dto.setNombre(paciente.getNombre());
        dto.setApellido(paciente.getApellido());
        dto.setDpi(paciente.getDpi());
        dto.setFechaNacimiento(paciente.getFechaNacimiento());
        dto.setSexo(paciente.getSexo());
        dto.setTelefono(paciente.getTelefono());
        dto.setDireccion(paciente.getDireccion());
        dto.setOcupacion(paciente.getOcupacion());
        dto.setMotivoConsulta(paciente.getMotivoInicio());

        if (paciente.getEstadoCivil() != null) {
            dto.setEstadoCivil(paciente.getEstadoCivil().getNombre());
        }

        if (paciente.getNivelEscolaridad() != null) {
            dto.setNivelEscolaridad(paciente.getNivelEscolaridad().getNombre());
        }

        return dto;
    }

    public ClinicalContextDiagnosisDTO toDiagnosisDTO(
            PacienteDiagnostico diagnostico) {

        ClinicalContextDiagnosisDTO dto = new ClinicalContextDiagnosisDTO();

        dto.setId(diagnostico.getId());
        dto.setDiagnosticoId(diagnostico.getDiagnostico().getId());
        dto.setCodigoDsm(diagnostico.getDiagnostico().getCodigoDsm());
        dto.setNombre(diagnostico.getDiagnostico().getNombre());
        dto.setFechaDiagnostico(diagnostico.getFechaDiagnostico());
        dto.setSesionId(diagnostico.getSesion().getId());

        if (diagnostico.getDiagnostico().getCategoriaDiagnostica() != null) {
            dto.setCategoriaDiagnostica(diagnostico.getDiagnostico().getCategoriaDiagnostica().getNombre());
        }

        return dto;
    }

    public ClinicalContextAllergyDTO toAllergyDTO(PacienteAlergia pacienteAlergia) {

        ClinicalContextAllergyDTO dto = new ClinicalContextAllergyDTO();

        dto.setId(pacienteAlergia.getId());
        dto.setTipoReaccion(pacienteAlergia.getTipoReaccion());
        dto.setObservaciones(pacienteAlergia.getObservaciones());

        if (pacienteAlergia.getSustanciaAlergena() != null) {
            dto.setSustanciaAlergena(pacienteAlergia.getSustanciaAlergena().getNombre());
        }

        if (pacienteAlergia.getNivelSeveridadAlergia() != null) {
            dto.setNivelSeveridad(pacienteAlergia.getNivelSeveridadAlergia().getNombre());
        }

        return dto;
    }

    public ClinicalContextPsychologicalTestDTO toPsychologicalTestDTO(AplicacionPrueba aplicacionPrueba) {

        ClinicalContextPsychologicalTestDTO dto = new ClinicalContextPsychologicalTestDTO();

        dto.setId(aplicacionPrueba.getId());
        dto.setFechaAplicacion(aplicacionPrueba.getFechaAplicacion());
        dto.setSesionId(aplicacionPrueba.getSesion().getId());
        if (aplicacionPrueba.getPruebaPsicologica() != null) {
            dto.setPruebaPsicologicaId(aplicacionPrueba.getPruebaPsicologica().getId());
            dto.setPruebaNombre(aplicacionPrueba.getPruebaPsicologica().getNombre());
        }

        return dto;
    }

    public ClinicalContextRiskDTO toRiskDTO(EvaluacionRiesgo evaluacionRiesgo) {

        ClinicalContextRiskDTO dto = new ClinicalContextRiskDTO();

        dto.setId(evaluacionRiesgo.getId());
        dto.setObservaciones(evaluacionRiesgo.getObservaciones());
        dto.setFecha(evaluacionRiesgo.getFecha());

        if (evaluacionRiesgo.getTipoRiesgo() != null) {
            dto.setTipoRiesgoId(evaluacionRiesgo.getTipoRiesgo().getId());
            dto.setTipoRiesgo(evaluacionRiesgo.getTipoRiesgo().getNombre());
        }

        if (evaluacionRiesgo.getNivelRiesgo() != null) {
            dto.setNivelRiesgoId(evaluacionRiesgo.getNivelRiesgo().getId());
            dto.setNivelRiesgo(evaluacionRiesgo.getNivelRiesgo().getNombre());
        }

        return dto;
    }

    public ClinicalContextObjectiveDTO toObjectiveDTO(ObjetivoTerapia objetivoTerapia) {

        ClinicalContextObjectiveDTO dto = new ClinicalContextObjectiveDTO();

        dto.setId(objetivoTerapia.getId());
        dto.setDescripcion(objetivoTerapia.getDescripcion());
        dto.setFechaInicio(objetivoTerapia.getFechaInicio());
        dto.setFechaMeta(objetivoTerapia.getFechaMeta());

        if (objetivoTerapia.getEstado() != null) {
            dto.setEstado(objetivoTerapia.getEstado().getNombre());
        }

        return dto;
    }

    public ClinicalContextSessionDTO toSessionDTO(Sesion sesion) {

        ClinicalContextSessionDTO dto = new ClinicalContextSessionDTO();

        dto.setId(sesion.getId());
        dto.setFechaSesion(sesion.getFechaSesion());

        if (sesion.getTipoSesion() != null) {
            dto.setTipoSesion(sesion.getTipoSesion().getNombre());
        }

        if (sesion.getEstado() != null) {
            dto.setEstado(sesion.getEstado().getNombre());
        }

        if (sesion.getCita() != null) {
            dto.setCitaId(sesion.getCita().getId());
            dto.setMotivoCita(sesion.getCita().getMotivo());
        }

        return dto;
    }

    public ClinicalSessionContextResponseDTO toResponseDTO(
            Sesion currentSession,
            List<ClinicalContextDiagnosisDTO> diagnoses,
            List<ClinicalContextAllergyDTO> allergies,
            List<ClinicalContextPsychologicalTestDTO> psychologicalTests,
            long psychologicalTestsTotal,
            List<ClinicalContextRiskDTO> risks,
            long risksTotal,
            List<ClinicalContextObjectiveDTO> objectives,
            long objectivesTotal,
            List<ClinicalContextSessionDTO> recentSessions,
            long sessionsTotal) {

        ClinicalSessionContextResponseDTO response = new ClinicalSessionContextResponseDTO();

        response.setPatient(toPatientDTO(currentSession.getPaciente()));
        response.setCurrentSession(toSessionDTO(currentSession));
        response.setDiagnoses(diagnoses);
        response.setAllergies(allergies);
        response.setPsychologicalTests(
                createPreview(psychologicalTests, psychologicalTestsTotal));

        response.setRisks(
                createPreview(risks, risksTotal));

        response.setObjectives(
                createPreview(objectives, objectivesTotal));

        response.setRecentSessions(
                createPreview(recentSessions, sessionsTotal));

        return response;
    }

    private <T> ClinicalContextPreviewDTO<T> createPreview(List<T> items, long total) {

        ClinicalContextPreviewDTO<T> preview = new ClinicalContextPreviewDTO<>();

        preview.setItems(items);
        preview.setTotal(total);

        return preview;
    }
}