package com.clinica.psicologia.system.service.catalog.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.ParentescoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.ParentescoResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.ParentescoMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.Parentesco;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.ParentescoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.catalog.ParentescoService;

import jakarta.transaction.Transactional;

@Service
public class ParentescoServiceImpl implements ParentescoService {
    private final ParentescoRepository repository;
    private final EstadoRepository estadoRepository;
    private final ParentescoMapper mapper;
    private final String duplicateMessage = "Relationship already exists";

    public ParentescoServiceImpl(ParentescoRepository repository, EstadoRepository estadoRepository,
            ParentescoMapper mapper) {
        this.repository = repository;
        this.estadoRepository = estadoRepository;
        this.mapper = mapper;
    }

    @Override
    public List<ParentescoResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    public ParentescoResponseDTO findById(Integer id) {
        Parentesco entity = repository.findById(id)
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
    public ParentescoResponseDTO create(ParentescoRequestDTO request) {
        validateDuplicate(request.getNombre());

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        Parentesco entity = new Parentesco();

        mapper.updateEntity(entity, request);

        entity.setEstado(estado);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public ParentescoResponseDTO update(Integer id, ParentescoRequestDTO request) {
        Parentesco entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        validateDuplicate(request.getNombre(), id);

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        mapper.updateEntity(entity, request);

        entity.setEstado(estado);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public void changeStatus(Integer id, Integer estadoId) {
        Parentesco entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Parentesco entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        repository.delete(entity);
    }
}
