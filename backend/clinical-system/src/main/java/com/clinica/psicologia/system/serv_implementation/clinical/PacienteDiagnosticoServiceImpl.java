package com.clinica.psicologia.system.serv_implementation.clinical;

import com.clinica.psicologia.system.repository.expert_system.EvaluacionDiagnosticaRepository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.PacienteDiagnosticoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.PacienteDiagnosticoResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.PacienteDiagnosticoMapper;
import com.clinica.psicologia.system.model.catalog.CriterioClinico;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.clinical.PacienteDiagnostico;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.clinical.SesionCriterioClinico;
import com.clinica.psicologia.system.model.expert_system.ArbolDiagnostico;
import com.clinica.psicologia.system.model.expert_system.EvaluacionCriterioClinico;
import com.clinica.psicologia.system.model.expert_system.EvaluacionDiagnostica;
import com.clinica.psicologia.system.model.expert_system.NodoArbol;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.repository.catalog.DiagnosticoRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.clinical.PacienteDiagnosticoRepository;
import com.clinica.psicologia.system.repository.clinical.SesionCriterioClinicoRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.expert_system.ArbolDiagnosticoRepository;
import com.clinica.psicologia.system.repository.expert_system.EvaluacionCriterioClinicoRepository;
import com.clinica.psicologia.system.repository.expert_system.NodoArbolRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.PacienteDiagnosticoService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;
import com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteDiagnosticoServiceImpl implements PacienteDiagnosticoService {

        private final EvaluacionDiagnosticaRepository evaluacionDiagnosticaRepository;
        private final PacienteDiagnosticoRepository repository;
        private final PacienteRepository pacienteRepository;
        private final DiagnosticoRepository diagnosticoRepository;
        private final EstadoRepository estadoRepository;
        private final PacienteDiagnosticoMapper mapper;
        private final ApplicationSupportService supportService;
        private final ArbolDiagnosticoRepository arbolRepository;
        private final NodoArbolRepository nodoRepository;
        private final SesionCriterioClinicoRepository criterioRepository;
        private final ClinicalAuthorizationService authService;
        private final EvaluacionCriterioClinicoRepository bitacoraRepository;
        private final SesionRepository sesionRepository;

        @Override
        public PacienteDiagnosticoResponseDTO create(PacienteDiagnosticoRequestDTO dto) {

                Sesion sesion = sesionRepository.findById(dto.getSesionId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Sesión no encontrada: " + dto.getSesionId()));

                Paciente paciente = pacienteRepository
                                .findById(sesion.getPaciente().getId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Paciente no encontrado: " + sesion.getPaciente().getId()));

                Diagnostico diagnostico = diagnosticoRepository
                                .findById(dto.getDiagnosticoId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Diagnóstico no encontrado: " + dto.getDiagnosticoId()));

                Estado estado = estadoRepository
                                .findById(supportService.getActiveState().getId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Estado no encontrado: " + supportService.getActiveState()));

                PacienteDiagnostico entity = new PacienteDiagnostico();

                entity.setPaciente(paciente);
                entity.setDiagnostico(diagnostico);
                entity.setSesion(sesion);
                entity.setEstado(estado);
                entity.setFechaDiagnostico(sesion.getFechaSesion().toLocalDate());
                entity.setDiagnosticoInicial(dto.getDiagnosticoInicial());

                entity = repository.save(entity);

                if (dto.getDiagnosticoInicial()) {
                        ejecutaMotorInferencia(sesion);
                }

                return mapper.toResponseDTO(entity);
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public List<PacienteDiagnosticoResponseDTO> findAll() {
                return mapper.toResponseDTOList(repository.findAll());
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public PacienteDiagnosticoResponseDTO findById(Integer id) {

                PacienteDiagnostico entity = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Patient diagnosis not found"));

                return mapper.toResponseDTO(entity);
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public List<PacienteDiagnosticoResponseDTO> getByPatient(Integer pacienteId) {
                return mapper.toResponseDTOList(repository.findByPacienteId(pacienteId));
        }

        @Override
        public void changeStatus(Integer id) {

                PacienteDiagnostico entity = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Patient diagnosis not found"));

                Estado estado = entity.getEstado().getId() == supportService.getActiveState().getId()
                                ? supportService.getInactiveState()
                                : supportService.getActiveState();

                entity.setEstado(estado);

                repository.save(entity);
        }

        private Diagnostico ejecutaMotorInferencia(Sesion sesion) {

                // 1. Load the symptoms/criteria recorded during the session
                List<SesionCriterioClinico> sintomas = criterioRepository.findBySesionIdOrderByIdAsc(sesion.getId());

                Set<Integer> criteriosSesion = sintomas.stream()
                                .map(s -> s.getCriterioClinico().getId())
                                .collect(Collectors.toSet());

                // 2. Load only active diagnostic trees
                List<ArbolDiagnostico> arboles = arbolRepository
                                .findAllByEstadoId(supportService.getActiveState().getId());

                EvaluacionDiagnostica evaluacion = new EvaluacionDiagnostica();

                evaluacion.setSesion(sesion);
                evaluacion.setUsuario(authService.getAuthenticatedUser());
                evaluacion.setFechaEvaluacion(sesion.getFechaSesion());
                evaluacion.setDiagnosticoConfirmado(false);

                // 3. Execute every active tree
                Diagnostico diagnosticoSugerido = null;

                for (ArbolDiagnostico arbol : arboles) {

                        NodoArbol raiz = nodoRepository.findRootNode(arbol.getId()).orElse(null);

                        Diagnostico resultado = evaluarNodo(raiz, criteriosSesion, evaluacion);

                        if (resultado != null) {
                                diagnosticoSugerido = resultado;
                                break;
                        }
                }

                evaluacion.setDiagnosticoSugerido(diagnosticoSugerido);
                evaluacion.setDiagnosticoConfirmado(false);
                evaluacion.setFechaInferencia(sesion.getFechaSesion());

                evaluacionDiagnosticaRepository.save(evaluacion);

                return diagnosticoSugerido;
        }

        private Diagnostico evaluarNodo(NodoArbol nodo, Set<Integer> criteriosSesion,
                        EvaluacionDiagnostica evaluacion) {

                if (nodo == null) {
                        return null;
                }
                if (nodo.getDiagnostico() != null) {
                        return nodo.getDiagnostico();
                }

                CriterioClinico criterio = nodo.getCriterioClinico();
                if (criterio == null) {
                        return null;
                }

                boolean presente = criteriosSesion.contains(criterio.getId());
                NodoArbol siguiente;

                if (presente) {
                        registrarCriterioEvaluado(evaluacion, criterio);
                        siguiente = nodo.getNodoPresente();
                } else {
                        siguiente = nodo.getNodoAusente();
                }

                return evaluarNodo(siguiente, criteriosSesion, evaluacion);
        }

        private void registrarCriterioEvaluado(EvaluacionDiagnostica evaluacion, CriterioClinico criterio) {

                EvaluacionCriterioClinico registro = new EvaluacionCriterioClinico();

                registro.setEvaluacionDiagnostica(evaluacion);
                registro.setCriterioClinico(criterio);

                bitacoraRepository.save(registro);
        }

}