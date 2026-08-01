package com.clinica.psicologia.system.serv_implementation.expert_system;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.expert_system.NodoArbolRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.NodoArbolResponseDTO;
import com.clinica.psicologia.system.mapper.expert_system.NodoArbolMapper;
import com.clinica.psicologia.system.model.catalog.CriterioClinico;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.expert_system.ArbolDiagnostico;
import com.clinica.psicologia.system.model.expert_system.NodoArbol;
import com.clinica.psicologia.system.repository.catalog.CriterioClinicoRepository;
import com.clinica.psicologia.system.repository.catalog.DiagnosticoRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.expert_system.ArbolDiagnosticoRepository;
import com.clinica.psicologia.system.repository.expert_system.NodoArbolRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.expert_system.NodoArbolService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NodoArbolServiceImpl implements NodoArbolService {

    private final NodoArbolRepository repository;
    private final ArbolDiagnosticoRepository arbolRepository;
    private final DiagnosticoRepository diagnosticoRepository;
    private final CriterioClinicoRepository criterioRepository;
    private final EstadoRepository estadoRepository;
    private final NodoArbolMapper mapper;

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<NodoArbolResponseDTO> findAll() {

        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public NodoArbolResponseDTO findById(Integer id) {

        NodoArbol entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tree node not found"));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<NodoArbolResponseDTO> findByArbolDiagnostico(Integer arbolDiagnosticoId) {

        return mapper.toResponseList(
                repository.findByArbolDiagnosticoId(arbolDiagnosticoId));
    }

    @Override
    public NodoArbolResponseDTO create(NodoArbolRequestDTO request) {

        ArbolDiagnostico arbol = arbolRepository.findById(
                request.getArbolDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic tree not found"));

        Diagnostico diagnostico = getDiagnostico(
                request.getDiagnosticoId());

        CriterioClinico criterio = getCriterio(request.getCriterioClinicoId());

        NodoArbol nodoSi = getNodo(request.getNodoPresenteId());

        NodoArbol nodoNo = getNodo(request.getNodoAusenteId());

        Estado estado = estadoRepository.findById(
                request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        validateNode(
                arbol,
                diagnostico,
                criterio,
                nodoSi,
                nodoNo,
                null);

        NodoArbol entity = new NodoArbol();

        entity.setArbolDiagnostico(arbol);
        entity.setDiagnostico(diagnostico);
        entity.setCriterioClinico(criterio);
        entity.setNodoPresente(nodoSi);
        entity.setNodoAusente(nodoNo);
        entity.setDescripcion(request.getDescripcion());
        entity.setEstado(estado);

        entity = repository.save(entity);

        validateRootUniqueness(entity.getArbolDiagnostico().getId());
        validateNoCycles(entity, new HashSet<>());

        return mapper.toResponse(entity);
    }

    @Override
    public NodoArbolResponseDTO update(Integer id, NodoArbolRequestDTO request) {

        NodoArbol entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tree node not found"));

        ArbolDiagnostico arbol = arbolRepository.findById(request.getArbolDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic tree not found"));

        Diagnostico diagnostico = getDiagnostico(request.getDiagnosticoId());

        CriterioClinico criterio = getCriterio(request.getCriterioClinicoId());

        NodoArbol nodoSi = getNodo(request.getNodoPresenteId());

        NodoArbol nodoNo = getNodo(request.getNodoAusenteId());

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        validateNode(
                arbol,
                diagnostico,
                criterio,
                nodoSi,
                nodoNo,
                entity);

        entity.setArbolDiagnostico(arbol);
        entity.setDiagnostico(diagnostico);
        entity.setCriterioClinico(criterio);
        entity.setNodoPresente(nodoSi);
        entity.setNodoAusente(nodoNo);
        entity.setDescripcion(request.getDescripcion());
        entity.setEstado(estado);

        entity = repository.save(entity);

        validateNoCycles(entity, new HashSet<>());

        validateRootUniqueness(entity.getArbolDiagnostico().getId());

        return mapper.toResponse(entity);
    }

    @Override
    public void changeStatus(Integer id, Integer estadoId) {

        NodoArbol entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tree node not found"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(Integer id) {

        NodoArbol entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tree node not found"));

        repository.delete(entity);
    }

    // ------------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------------

    private Diagnostico getDiagnostico(Integer id) {

        if (id == null) {
            return null;
        }

        return diagnosticoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));
    }

    private CriterioClinico getCriterio(Integer id) {

        if (id == null) {
            return null;
        }

        return criterioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion not found"));
    }

    private NodoArbol getNodo(Integer id) {

        if (id == null) {
            return null;
        }

        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tree node not found"));
    }

    private void validateNode(
            ArbolDiagnostico arbol,
            Diagnostico diagnostico,
            CriterioClinico criterio,
            NodoArbol nodoSi,
            NodoArbol nodoNo,
            NodoArbol currentNode) {

        boolean terminal = diagnostico != null;
        boolean decision = criterio != null;

        if (terminal == decision) {
            throw new BusinessRuleException("A node must be either a decision node or a terminal node.");
        }

        if (terminal) {

            if (nodoSi != null || nodoNo != null) {
                throw new BusinessRuleException("Terminal nodes cannot have child nodes.");
            }

            return;
        }

        if (nodoSi == null || nodoNo == null) {
            throw new BusinessRuleException(
                    "Decision nodes must define both YES and NO destinations.");
        }

        if (nodoSi.getId().equals(nodoNo.getId())) {
            throw new BusinessRuleException(
                    "YES and NO destinations must be different.");
        }

        if (!nodoSi.getArbolDiagnostico().getId().equals(arbol.getId())
                || !nodoNo.getArbolDiagnostico().getId().equals(arbol.getId())) {

            throw new BusinessRuleException(
                    "Child nodes must belong to the same diagnostic tree.");
        }

        if (currentNode != null) {

            if (nodoSi.getId().equals(currentNode.getId())
                    || nodoNo.getId().equals(currentNode.getId())) {

                throw new BusinessRuleException(
                        "A node cannot reference itself.");
            }
        }
    }

    private void validateNoCycles(NodoArbol currentNode, Set<Integer> visited) {

        if (currentNode == null) {
            return;
        }

        if (!visited.add(currentNode.getId())) {

            throw new BusinessRuleException(
                    "Diagnostic tree contains circular references.");
        }

        validateNoCycles(
                currentNode.getNodoPresente(),
                visited);

        validateNoCycles(
                currentNode.getNodoAusente(),
                visited);
    }

    private void validateRootUniqueness(Integer arbolId) {

        long roots = repository.countRootNodes(arbolId);

        if (roots > 1) {
            throw new BusinessRuleException(
                    "Diagnostic tree contains more than one root node.");
        }
    }
}