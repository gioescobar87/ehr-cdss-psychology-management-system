package com.clinica.psicologia.system.serv_implementation.catalog;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.EstadoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.EstadoResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.EstadoMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.catalog.EstadoService;

import jakarta.transaction.Transactional;

@Service
public class EstadoServiceImpl implements EstadoService {
    private final EstadoRepository repository;
    private final EstadoMapper mapper;
    private final String duplicateMessage = "State already exists";

    public EstadoServiceImpl(EstadoRepository repository, EstadoRepository estadoRepository,
            EstadoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<EstadoResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    public EstadoResponseDTO findById(Integer id) {
        Estado entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        return mapper.toResponse(entity);
    }

    private void validateDuplicate(String nombre) {
        if (repository.existsByNombre(nombre)) {
            throw new DuplicateResourceException(duplicateMessage);
        }
    }

    private void validateDuplicate(String nombre, Integer id) {
        if (repository.existsByNombreAndIdNot(nombre, id)) {
            throw new DuplicateResourceException(duplicateMessage);
        }
    }

    @Override
    public EstadoResponseDTO create(EstadoRequestDTO request) {
        validateDuplicate(request.getNombre());

        Estado entity = new Estado();

        mapper.updateEntity(entity, request);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public EstadoResponseDTO update(Integer id, EstadoRequestDTO request) {
        Estado entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        validateDuplicate(request.getNombre(), id);

        mapper.updateEntity(entity, request);
        
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Estado entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        repository.delete(entity);
    }
}
