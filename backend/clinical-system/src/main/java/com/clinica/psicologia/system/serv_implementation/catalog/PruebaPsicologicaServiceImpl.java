package com.clinica.psicologia.system.serv_implementation.catalog;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.PruebaPsicologicaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.PruebaPsicologicaResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.PruebaPsicologicaMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.PruebaPsicologica;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.PruebaPsicologicaRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.catalog.PruebaPsicologicaService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PruebaPsicologicaServiceImpl implements PruebaPsicologicaService {
    private final PruebaPsicologicaRepository repository;
    private final EstadoRepository estadoRepository;
    private final PruebaPsicologicaMapper mapper;
    private final String duplicateMessage = "Relationship already exists";
    private final ApplicationSupportService supportService;

    @Override
    public List<PruebaPsicologicaResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    public PruebaPsicologicaResponseDTO findById(Integer id) {
        PruebaPsicologica entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        return mapper.toResponseDTO(entity);
    }

    private void validateDuplicate(String nombre) {
        if (repository.existsByNombre(nombre)) {throw new DuplicateResourceException(duplicateMessage);
        }
    }

    private void validateDuplicate(String nombre, Integer id) {
        if (repository.existsByNombreAndIdNot(nombre, id)) {
            throw new DuplicateResourceException(duplicateMessage);
        }
    }

    @Override
    public PruebaPsicologicaResponseDTO create(PruebaPsicologicaRequestDTO request) {

        validateDuplicate(request.getNombre());

        Estado estado = supportService.getActiveState();

        PruebaPsicologica entity = new PruebaPsicologica();

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
        entity.setObjetivoPrueba(request.getObjetivoPrueba());
        entity.setInstruccionesAplicacion(request.getInstruccionesAplicacion());
        entity.setConsideraciones(request.getConsideraciones());
        entity.setEstado(estado);
        
        return mapper.toResponseDTO(repository.save(entity));
    }

    @Override
    @Transactional
    public PruebaPsicologicaResponseDTO update(Integer id, PruebaPsicologicaRequestDTO request) {
        PruebaPsicologica entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        validateDuplicate(request.getNombre(), id);
        mapper.updateEntity(entity, request);

        return mapper.toResponseDTO(repository.save(entity));
    }

    @Override
    @Transactional
    public void changeStatus(Integer id, Integer estadoId) {
        PruebaPsicologica entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        PruebaPsicologica entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        repository.delete(entity);
    }
}
