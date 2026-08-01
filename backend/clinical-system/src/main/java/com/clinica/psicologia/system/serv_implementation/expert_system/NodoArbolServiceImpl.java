package com.clinica.psicologia.system.serv_implementation.expert_system;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.expert_system.NodoArbolRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.NodoArbolResponseDTO;
import com.clinica.psicologia.system.mapper.expert_system.NodoArbolMapper;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.expert_system.ArbolDiagnostico;
import com.clinica.psicologia.system.model.expert_system.NodoArbol;
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
    private final EstadoRepository estadoRepository;
    private final NodoArbolRepository nodoRepository;
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
        return mapper.toResponseList(repository.findByArbolDiagnosticoIdOrderByOrden(arbolDiagnosticoId));
    }

    @Override
    public NodoArbolResponseDTO create(NodoArbolRequestDTO request) {

        ArbolDiagnostico arbol = arbolRepository.findById(request.getArbolDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic tree not found"));

        NodoArbol nodoPadre = null;

        if (request.getNodoPadreId() != null) {

            nodoPadre = nodoRepository.findById(request.getNodoPadreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent node not found"));

            if (nodoPadre != null && !nodoPadre.getArbolDiagnostico().getId().equals(arbol.getId())) {
                throw new BusinessRuleException("Parent node belongs to another diagnostic tree");
            }
        }

        Diagnostico diagnostico = null;

        if (request.getDiagnosticoId() != null) {

            diagnostico = diagnosticoRepository.findById(request.getDiagnosticoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));
        }

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        NodoArbol entity = new NodoArbol();

        entity.setArbolDiagnostico(arbol);
        entity.setNodoPadre(nodoPadre);
        entity.setDiagnostico(diagnostico);
        entity.setDescripcion(request.getDescripcion());
        entity.setOrden(request.getOrden());
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public NodoArbolResponseDTO update(Integer id, NodoArbolRequestDTO request) {

        NodoArbol entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tree node not found"));

        ArbolDiagnostico arbol = arbolRepository.findById(request.getArbolDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic tree not found"));

        NodoArbol nodoPadre = null;

        if (request.getNodoPadreId() != null) {

            nodoPadre = nodoRepository.findById(request.getNodoPadreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent node not found"));

            if (nodoPadre != null && !nodoPadre.getArbolDiagnostico().getId().equals(arbol.getId())) {
                throw new BusinessRuleException("Parent node belongs to another diagnostic tree");
            }

            if (nodoPadre != null && nodoPadre.getId().equals(id)) {
                throw new BusinessRuleException("A node cannot be its own parent");
            }
        }

        Diagnostico diagnostico = null;

        if (request.getDiagnosticoId() != null) {

            diagnostico = diagnosticoRepository.findById(request.getDiagnosticoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));
        }

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        entity.setArbolDiagnostico(arbol);
        entity.setNodoPadre(nodoPadre);
        entity.setDiagnostico(diagnostico);
        entity.setDescripcion(request.getDescripcion());
        entity.setOrden(request.getOrden());
        entity.setEstado(estado);

        entity = repository.save(entity);

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
}