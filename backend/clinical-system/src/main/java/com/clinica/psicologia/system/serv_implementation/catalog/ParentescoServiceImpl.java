package com.clinica.psicologia.system.serv_implementation.catalog;

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
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParentescoServiceImpl implements ParentescoService {
    private final ParentescoRepository repository;
    private final EstadoRepository estadoRepository;
    private final ParentescoMapper mapper;
    private final String duplicateMessage = "Relationship already exists";
    private final ApplicationSupportService supportService;

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

        Estado estado = supportService.getActiveState();

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
        mapper.updateEntity(entity, request);

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
