package com.clinica.psicologia.system.serv_implementation.expert_system;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.expert_system.ArbolDiagnosticoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.ArbolDiagnosticoResponseDTO;
import com.clinica.psicologia.system.mapper.expert_system.ArbolDiagnosticoMapper;
import com.clinica.psicologia.system.model.catalog.CategoriaDiagnostica;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.expert_system.ArbolDiagnostico;
import com.clinica.psicologia.system.repository.catalog.CategoriaDiagnosticaRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.expert_system.ArbolDiagnosticoRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.expert_system.ArbolDiagnosticoService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ArbolDiagnosticoServiceImpl implements ArbolDiagnosticoService {

    private final ArbolDiagnosticoRepository repository;
    private final CategoriaDiagnosticaRepository categoriaRepository;
    private final EstadoRepository estadoRepository;
    private final ApplicationSupportService common;
    private final ArbolDiagnosticoMapper mapper;
    private final ApplicationSupportService applicationSupportService;

    private static final String DUPLICATE_CODE = "A tree with the same code and version already exists.";
    private static final String DUPLICATE_NAME = "A tree with the same name already exists.";

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ArbolDiagnosticoResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public ArbolDiagnosticoResponseDTO findById(Integer id) {
        ArbolDiagnostico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic tree not found."));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ArbolDiagnosticoResponseDTO> getByCategoriaDiagnostica(Integer categoriaId) {
        return mapper.toResponseList(repository.findByCategoriaDiagnosticaId(categoriaId));
    }

    @Override
    public ArbolDiagnosticoResponseDTO create(ArbolDiagnosticoRequestDTO request) {

        validateDuplicates(request);

        CategoriaDiagnostica categoria = categoriaRepository.findById(request.getCategoriaDiagnosticaId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic category not found."));

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found."));

        ArbolDiagnostico entity = new ArbolDiagnostico();

        mapper.updateEntity(entity, request);

        entity.setCategoriaDiagnostica(categoria);
        entity.setEstado(estado);
        entity.setFechaCreacion(LocalDateTime.now());

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public ArbolDiagnosticoResponseDTO update(Integer id, ArbolDiagnosticoRequestDTO request) {

        ArbolDiagnostico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic tree not found."));

        validateDuplicates(request, id);

        CategoriaDiagnostica categoria = categoriaRepository.findById(request.getCategoriaDiagnosticaId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic category not found."));

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found."));

        mapper.updateEntity(entity, request);

        entity.setCategoriaDiagnostica(categoria);
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public void toggleStatus(Integer id) {

        ArbolDiagnostico entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Diagnostic tree not found."));

        if (entity.getEstado().getId().equals(common.getActiveState().getId())) {

            entity.setEstado(common.getInactiveState());

        } else {

            validateSingleActiveVersion(entity);

            entity.setEstado(common.getActiveState());
        }

        repository.save(entity);
    }

    @Override
    public void activate(Integer id) {

        ArbolDiagnostico tree = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Diagnostic tree not found."));

        Estado active = applicationSupportService.getActiveState();
        Estado inactive = applicationSupportService.getInactiveState();

        List<ArbolDiagnostico> activeTrees =
                repository.findByCodigoArbolAndEstadoId(tree.getCodigoArbol(), active.getId());

        for (ArbolDiagnostico activeTree : activeTrees) {

            if (!activeTree.getId().equals(tree.getId())) {

                activeTree.setEstado(inactive);
            }
        }

        tree.setEstado(active);

        repository.saveAll(activeTrees);
        repository.save(tree);
    }

    @Override
    public void delete(Integer id) {

        ArbolDiagnostico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic tree not found."));

        repository.delete(entity);
    }

    private void validateDuplicates(ArbolDiagnosticoRequestDTO request) {

        if (repository.existsByCodigoArbolAndVersion(request.getCodigoArbol(), request.getVersion())) {
            throw new DuplicateResourceException(DUPLICATE_CODE);
        }

        if (repository.existsByNombre(request.getNombre())) {
            throw new DuplicateResourceException(DUPLICATE_NAME);
        }
    }

    private void validateDuplicates(ArbolDiagnosticoRequestDTO request, Integer id) {

        if (repository.existsByCodigoArbolAndVersionAndIdNot(request.getCodigoArbol(), request.getVersion(), id)) {
            throw new DuplicateResourceException(DUPLICATE_CODE);
        }

        if (repository.existsByNombreAndIdNot(request.getNombre(), id)) {
            throw new DuplicateResourceException(DUPLICATE_NAME);
        }
    }

    private void validateSingleActiveVersion(ArbolDiagnostico entity) {

    if (repository.existsByCodigoArbolAndEstadoNombreAndIdNot(entity.getCodigoArbol(),"ACTIVO",entity.getId())) {
        throw new BusinessRuleException("Another active version of this diagnostic tree already exists.");
    }
}
}