package com.clinica.psicologia.system.serv_implementation.expert_system;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.expert_system.ReglaNodoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.ReglaNodoResponseDTO;
import com.clinica.psicologia.system.mapper.expert_system.ReglaNodoMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.expert_system.NodoArbol;
import com.clinica.psicologia.system.model.expert_system.ReglaNodo;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.expert_system.NodoArbolRepository;
import com.clinica.psicologia.system.repository.expert_system.ReglaNodoRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.expert_system.ReglaNodoService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReglaNodoServiceImpl implements ReglaNodoService {

    private final ReglaNodoRepository repository;
    private final NodoArbolRepository nodoRepository;
    private final EstadoRepository estadoRepository;
    private final ReglaNodoMapper mapper;

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ReglaNodoResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public ReglaNodoResponseDTO findById(Integer id) {

        ReglaNodo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Node rule not found."));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ReglaNodoResponseDTO> getByNodoOrigen(Integer nodoOrigenId) {
        return mapper.toResponseList(repository.findByNodoOrigenIdOrderById(nodoOrigenId));
    }

    @Override
    public ReglaNodoResponseDTO create(ReglaNodoRequestDTO request) {

        NodoArbol origen = nodoRepository.findById(request.getNodoOrigenId())
                .orElseThrow(() -> new ResourceNotFoundException("Source node not found."));

        NodoArbol destino = nodoRepository.findById(request.getNodoDestinoId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination node not found."));

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found."));

        validateNodes(origen, destino);

        validateNoCycle(origen, destino);

        validateDuplicateRule(
                origen.getId(),
                request.getCampoEvaluado(),
                request.getOperador(),
                request.getValorComparacion());

        ReglaNodo entity = new ReglaNodo();

        mapper.updateEntity(entity, request);

        entity.setNodoOrigen(origen);
        entity.setNodoDestino(destino);
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public ReglaNodoResponseDTO update(Integer id, ReglaNodoRequestDTO request) {

        ReglaNodo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Node rule not found."));

        NodoArbol origen = nodoRepository.findById(request.getNodoOrigenId())
                .orElseThrow(() -> new ResourceNotFoundException("Source node not found."));

        NodoArbol destino = nodoRepository.findById(request.getNodoDestinoId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination node not found."));

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found."));

        validateNodes(origen, destino);

        validateNoCycle(origen, destino, id);

        if (!Objects.equals(entity.getNodoOrigen().getId(), origen.getId())
                || !Objects.equals(entity.getCampoEvaluado(), request.getCampoEvaluado())
                || !Objects.equals(entity.getOperador(), request.getOperador())
                || !Objects.equals(entity.getValorComparacion(), request.getValorComparacion())) {

            validateDuplicateRule(
                    origen.getId(),
                    request.getCampoEvaluado(),
                    request.getOperador(),
                    request.getValorComparacion(),
                    id);
        }

        mapper.updateEntity(entity, request);

        entity.setNodoOrigen(origen);
        entity.setNodoDestino(destino);
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public void changeStatus(Integer id, Integer estadoId) {

        ReglaNodo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Node rule not found."));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found."));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(Integer id) {

        ReglaNodo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Node rule not found."));

        repository.delete(entity);
    }

    private void validateNodes(NodoArbol origen, NodoArbol destino) {

        if (origen.getId().equals(destino.getId())) {
            throw new BusinessRuleException("A node cannot point to itself.");
        }

        if (!origen.getArbolDiagnostico().getId()
                .equals(destino.getArbolDiagnostico().getId())) {

            throw new BusinessRuleException("Both nodes must belong to the same diagnostic tree.");
        }

        if (Boolean.TRUE.equals(origen.getEsTerminal())) {
            throw new BusinessRuleException("A terminal node cannot have outgoing rules.");
        }

        if ("ROOT".equalsIgnoreCase(destino.getTipoNodo())) {
            throw new BusinessRuleException("A rule cannot point to the root node.");
        }
    }

    private void validateDuplicateRule(
            Integer nodoOrigenId,
            String campoEvaluado,
            String operador,
            String valorComparacion) {

        if (repository.existsByNodoOrigenIdAndCampoEvaluadoIgnoreCaseAndOperadorIgnoreCaseAndValorComparacionIgnoreCase(
                nodoOrigenId,
                campoEvaluado,
                operador,
                valorComparacion)) {

            throw new DuplicateResourceException(
                    "An identical rule already exists for the selected source node.");
        }
    }

    private void validateDuplicateRule(
            Integer nodoOrigenId,
            String campoEvaluado,
            String operador,
            String valorComparacion,
            Integer id) {

        if (repository
                .existsByNodoOrigenIdAndCampoEvaluadoIgnoreCaseAndOperadorIgnoreCaseAndValorComparacionIgnoreCaseAndIdNot(
                        nodoOrigenId,
                        campoEvaluado,
                        operador,
                        valorComparacion,
                        id)) {

            throw new DuplicateResourceException(
                    "An identical rule already exists for the selected source node.");
        }
    }

    private void validateNoCycle(
            NodoArbol origen,
            NodoArbol destino) {

        if (canReachNode(
                destino.getId(),
                origen.getId(),
                new HashSet<>(),
                null)) {

            throw new BusinessRuleException(
                    "This rule would create a circular path in the diagnostic tree.");
        }
    }

    private void validateNoCycle(
            NodoArbol origen,
            NodoArbol destino,
            Integer ruleIdToIgnore) {

        if (canReachNode(
                destino.getId(),
                origen.getId(),
                new HashSet<>(),
                ruleIdToIgnore)) {

            throw new BusinessRuleException(
                    "This rule would create a circular path in the diagnostic tree.");
        }
    }

    private boolean canReachNode(
            Integer currentNodeId,
            Integer targetNodeId,
            Set<Integer> visited,
            Integer ruleIdToIgnore) {

        if (!visited.add(currentNodeId)) {
            return false;
        }

        List<ReglaNodo> rules = repository.findByNodoOrigenId(currentNodeId);

        for (ReglaNodo rule : rules) {

            if (ruleIdToIgnore != null
                    && rule.getId().equals(ruleIdToIgnore)) {
                continue;
            }

            Integer nextNodeId = rule.getNodoDestino().getId();

            if (nextNodeId.equals(targetNodeId)) {
                return true;
            }

            if (canReachNode(
                    nextNodeId,
                    targetNodeId,
                    visited,
                    ruleIdToIgnore)) {

                return true;
            }
        }

        return false;
    }
}