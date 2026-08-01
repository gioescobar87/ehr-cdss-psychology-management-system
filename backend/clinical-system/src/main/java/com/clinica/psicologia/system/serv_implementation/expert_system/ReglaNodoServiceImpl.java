package com.clinica.psicologia.system.serv_implementation.expert_system;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.expert_system.ReglaNodoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.ReglaNodoResponseDTO;
import com.clinica.psicologia.system.mapper.expert_system.ReglaNodoMapper;
import com.clinica.psicologia.system.model.catalog.CriterioClinico;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.expert_system.NodoArbol;
import com.clinica.psicologia.system.model.expert_system.ReglaNodo;
import com.clinica.psicologia.system.repository.catalog.CriterioClinicoRepository;
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
    private final CriterioClinicoRepository criterioRepository;
    private final EstadoRepository estadoRepository;
    private final ReglaNodoMapper mapper;

    private static final String DUPLICATE_MESSAGE = "A rule already exists for this node and clinical criterion";

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ReglaNodoResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public ReglaNodoResponseDTO findById(Integer id) {

        ReglaNodo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Node rule not found"));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ReglaNodoResponseDTO> findByNodoOrigen(Integer nodoOrigenId) {
        return mapper.toResponseList(repository.findByNodoOrigenId(nodoOrigenId));
    }

    @Override
    public ReglaNodoResponseDTO create(ReglaNodoRequestDTO request) {

        if (repository.existsByNodoOrigenIdAndCriterioClinicoId(request.getNodoOrigenId(),
                request.getCriterioClinicoId())) {
            throw new DuplicateResourceException(DUPLICATE_MESSAGE);
        }

        NodoArbol nodoOrigen = nodoRepository.findById(request.getNodoOrigenId())
                .orElseThrow(() -> new ResourceNotFoundException("Source node not found"));

        NodoArbol nodoDestino = nodoRepository.findById(request.getNodoDestinoId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination node not found"));

        CriterioClinico criterio = criterioRepository.findById(request.getCriterioClinicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion not found"));

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        validateRule(nodoOrigen, nodoDestino);

        ReglaNodo entity = new ReglaNodo();

        entity.setNodoOrigen(nodoOrigen);
        entity.setNodoDestino(nodoDestino);
        entity.setCriterioClinico(criterio);
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public ReglaNodoResponseDTO update(Integer id, ReglaNodoRequestDTO request) {

        ReglaNodo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Node rule not found"));

        if (!entity.getNodoOrigen().getId().equals(request.getNodoOrigenId())
                || !entity.getCriterioClinico().getId().equals(request.getCriterioClinicoId())) {

            if (repository.existsByNodoOrigenIdAndCriterioClinicoId(request.getNodoOrigenId(),
                    request.getCriterioClinicoId())) {
                throw new DuplicateResourceException(DUPLICATE_MESSAGE);
            }
        }

        NodoArbol nodoOrigen = nodoRepository.findById(request.getNodoOrigenId())
                .orElseThrow(() -> new ResourceNotFoundException("Source node not found"));

        NodoArbol nodoDestino = nodoRepository.findById(request.getNodoDestinoId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination node not found"));

        CriterioClinico criterio = criterioRepository.findById(request.getCriterioClinicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion not found"));

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        validateRule(nodoOrigen, nodoDestino);

        entity.setNodoOrigen(nodoOrigen);
        entity.setNodoDestino(nodoDestino);
        entity.setCriterioClinico(criterio);
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public void changeStatus(Integer id, Integer estadoId) {

        ReglaNodo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Node rule not found"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(Integer id) {

        ReglaNodo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Node rule not found"));

        repository.delete(entity);
    }

    private void validateRule(NodoArbol nodoOrigen, NodoArbol nodoDestino) {

        if (!nodoOrigen.getArbolDiagnostico().getId().equals(nodoDestino.getArbolDiagnostico().getId())) {
            throw new BusinessRuleException("Source and destination nodes must belong to the same diagnostic tree");
        }

        if (nodoOrigen.getDiagnostico() != null) {
            throw new BusinessRuleException("A terminal node cannot have outgoing rules");
        }

        if (nodoOrigen.getId().equals(nodoDestino.getId())) {
            throw new BusinessRuleException("Source and destination nodes cannot be the same");
        }
    }
}