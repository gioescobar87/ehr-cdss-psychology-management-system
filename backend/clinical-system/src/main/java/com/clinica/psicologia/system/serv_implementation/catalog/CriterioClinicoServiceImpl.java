package com.clinica.psicologia.system.serv_implementation.catalog;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.CriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.CriterioClinicoResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.CriterioClinicoMapper;
import com.clinica.psicologia.system.model.catalog.CategoriaCriterioClinico;
import com.clinica.psicologia.system.model.catalog.CriterioClinico;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.repository.catalog.CategoriaCriterioClinicoRepository;
import com.clinica.psicologia.system.repository.catalog.CriterioClinicoRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.catalog.CriterioClinicoService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CriterioClinicoServiceImpl implements CriterioClinicoService {

    private final CriterioClinicoRepository repository;
    private final CategoriaCriterioClinicoRepository categoriaRepository;
    private final EstadoRepository estadoRepository;
    private final CriterioClinicoMapper mapper;
    private final ApplicationSupportService supportService;

    private static final String DUPLICATE_MESSAGE = "Clinical criterion already exists";

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<CriterioClinicoResponseDTO> findAll() {

        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public CriterioClinicoResponseDTO findById(Integer id) {
        CriterioClinico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion not found"));

        return mapper.toResponse(entity);
    }

    @Override
    public CriterioClinicoResponseDTO create(CriterioClinicoRequestDTO request) {

        if (repository.existsByNombre(request.getNombre())) {

            throw new DuplicateResourceException(DUPLICATE_MESSAGE);
        }

        CategoriaCriterioClinico categoria = categoriaRepository.findById(request.getCategoriaCriterioClinicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion category not found"));

        Estado estado = supportService.getActiveState();

        CriterioClinico entity = new CriterioClinico();

        entity.setNombre(request.getNombre());
        entity.setCodigo(request.getCodigo());
        entity.setDescripcion(request.getDescripcion());
        entity.setCategoriaCriterioClinico(categoria);
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public CriterioClinicoResponseDTO update(Integer id, CriterioClinicoRequestDTO request) {
        CriterioClinico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion not found"));

        if (repository.existsByNombreAndIdNot(request.getNombre(), id)) {

            throw new DuplicateResourceException(DUPLICATE_MESSAGE);
        }

        CategoriaCriterioClinico categoria = categoriaRepository.findById(request.getCategoriaCriterioClinicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion category not found"));

        entity.setNombre(request.getNombre());
        entity.setCodigo(request.getCodigo());
        entity.setDescripcion(request.getDescripcion());
        entity.setCategoriaCriterioClinico(categoria);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public void changeStatus(Integer id, Integer estadoId) {

        CriterioClinico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion not found"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(Integer id) {

        CriterioClinico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion not found"));

        repository.delete(entity);
    }
}