package com.clinica.psicologia.system.serv_implementation.expert_system;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.expert_system.NodoArbolRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.NodoArbolResponseDTO;
import com.clinica.psicologia.system.mapper.expert_system.NodoArbolMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.expert_system.ArbolDiagnostico;
import com.clinica.psicologia.system.model.expert_system.NodoArbol;
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
    private final EstadoRepository estadoRepository;
    private final NodoArbolMapper mapper;

    private static final Set<String> TIPOS_VALIDOS = Set.of(
            "ROOT",
            "QUESTION",
            "DIAGNOSIS");

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<NodoArbolResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public NodoArbolResponseDTO findById(Integer id) {

        NodoArbol entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tree node not found."));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<NodoArbolResponseDTO> getByArbolDiagnostico(Integer arbolDiagnosticoId) {

        return mapper.toResponseList(
                repository.findByArbolDiagnosticoIdOrderByOrden(arbolDiagnosticoId));
    }

    @Override
    public NodoArbolResponseDTO create(NodoArbolRequestDTO request) {

        ArbolDiagnostico arbol = arbolRepository.findById(request.getArbolDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic tree not found."));

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found."));

        NodoArbol nodoPadre = null;

        if (request.getNodoPadreId() != null) {

            nodoPadre = repository.findById(request.getNodoPadreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent node not found."));

            validateSameTree(arbol, nodoPadre);

            validateParentIsNotTerminal(nodoPadre);

            validateSiblingOrder(
                    nodoPadre.getId(),
                    request.getOrden());
        } else {

            validateSingleRoot(arbol.getId());
        }

        validateTipoNodo(request.getTipoNodo());

        NodoArbol entity = new NodoArbol();

        mapper.updateEntity(entity, request);

        entity.setArbolDiagnostico(arbol);
        entity.setNodoPadre(nodoPadre);
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public NodoArbolResponseDTO update(Integer id, NodoArbolRequestDTO request) {

        NodoArbol entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tree node not found."));

        ArbolDiagnostico arbol = arbolRepository.findById(request.getArbolDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic tree not found."));

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found."));

        NodoArbol nodoPadre = null;

        if (request.getNodoPadreId() != null) {

            nodoPadre = repository.findById(request.getNodoPadreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent node not found."));

            if (entity.getId().equals(nodoPadre.getId())) {
                throw new BusinessRuleException("A node cannot be its own parent.");
            }

            validateNoCycle(entity, nodoPadre);

            validateSameTree(arbol, nodoPadre);

            validateParentIsNotTerminal(nodoPadre);

            if (!Objects.equals(
                    entity.getNodoPadre() == null ? null : entity.getNodoPadre().getId(),
                    nodoPadre.getId())
                    || !Objects.equals(entity.getOrden(), request.getOrden())) {

                validateSiblingOrder(
                        nodoPadre.getId(),
                        request.getOrden(),
                        id);
            }
        } else {

            Optional<NodoArbol> root = repository.findFirstByArbolDiagnosticoIdAndNodoPadreIsNull(
                    arbol.getId());

            if (root.isPresent() && !root.get().getId().equals(id)) {
                throw new BusinessRuleException(
                        "The tree already has a root node.");
            }
        }

        validateTipoNodo(request.getTipoNodo());

        validateTerminalNodeUpdate(entity, request);

        mapper.updateEntity(entity, request);

        entity.setArbolDiagnostico(arbol);
        entity.setNodoPadre(nodoPadre);
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public void changeStatus(Integer id, Integer estadoId) {

        NodoArbol entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tree node not found."));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found."));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(Integer id) {

        NodoArbol entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tree node not found."));

        if (repository.existsByNodoPadreId(id)) {
            throw new BusinessRuleException("Cannot delete a node that has child nodes.");
        }

        repository.delete(entity);
    }

    private void validateTipoNodo(String tipo) {
        if (!TIPOS_VALIDOS.contains(tipo.toUpperCase())) {
            throw new BusinessRuleException("Invalid node type.");
        }
    }

    private void validateSingleRoot(Integer arbolId) {
        if (repository.existsByArbolDiagnosticoIdAndNodoPadreIsNull(arbolId)) {
            throw new BusinessRuleException("The tree already contains a root node.");
        }
    }

    private void validateSameTree(ArbolDiagnostico arbol, NodoArbol padre) {
        if (!padre.getArbolDiagnostico().getId().equals(arbol.getId())) {
            throw new BusinessRuleException("The parent node belongs to another diagnostic tree.");
        }
    }

    private void validateParentIsNotTerminal(NodoArbol padre) {
        if (Boolean.TRUE.equals(padre.getEsTerminal())) {
            throw new BusinessRuleException("A terminal node cannot have child nodes.");
        }
    }

    private void validateSiblingOrder(Integer padreId, Integer orden) {
        if (orden != null && repository.existsByNodoPadreIdAndOrden(padreId, orden)) {
            throw new BusinessRuleException("Another sibling already uses the specified order.");
        }
    }

    private void validateSiblingOrder(Integer padreId, Integer orden, Integer id) {
        if (orden != null && repository.existsByNodoPadreIdAndOrdenAndIdNot(padreId, orden, id)) {
            throw new BusinessRuleException("Another sibling already uses the specified order.");
        }
    }

    private void validateNoCycle(NodoArbol node, NodoArbol newParent) {

        NodoArbol current = newParent;

        while (current != null) {

            if (current.getId().equals(node.getId())) {
                throw new BusinessRuleException(
                        "This operation would create a circular reference in the diagnostic tree.");
            }

            current = current.getNodoPadre();
        }
    }

    private void validateTerminalNodeUpdate(NodoArbol entity, NodoArbolRequestDTO request) {
        if (Boolean.TRUE.equals(request.getEsTerminal()) && repository.existsByNodoPadreId(entity.getId())) {
            throw new BusinessRuleException("A node with child nodes cannot be marked as terminal.");
        }
    }
}