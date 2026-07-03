package com.clinica.psicologia.system.serv_implementation.catalog;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.DiagnosticoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.DiagnosticoResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.DiagnosticoMapper;
import com.clinica.psicologia.system.model.catalog.CategoriaDiagnostica;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.repository.catalog.CategoriaDiagnosticaRepository;
import com.clinica.psicologia.system.repository.catalog.DiagnosticoRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.catalog.DiagnosticoService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DiagnosticoServiceImpl
        implements DiagnosticoService {

    private final DiagnosticoRepository repository;
    private final CategoriaDiagnosticaRepository categoriaRepository;
    private final EstadoRepository estadoRepository;
    private final DiagnosticoMapper mapper;

    private static final String DUPLICATE_MESSAGE =
            "Diagnosis already exists";

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<DiagnosticoResponseDTO> findAll() {

        return mapper.toResponseList(
                repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public DiagnosticoResponseDTO findById(
            Integer id) {

        Diagnostico entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Diagnosis not found"));

        return mapper.toResponse(entity);
    }

    @Override
    public DiagnosticoResponseDTO create(
            DiagnosticoRequestDTO request) {

        if (repository.existsByNombre(
                request.getNombre())) {

            throw new DuplicateResourceException(
                    DUPLICATE_MESSAGE);
        }

        CategoriaDiagnostica categoria =
                categoriaRepository.findById(
                        request.getCategoriaDiagnosticaId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Diagnostic category not found"));

        Estado estado =
                estadoRepository.findById(
                        request.getEstadoId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "State not found"));

        Diagnostico entity =
                new Diagnostico();

        entity.setNombre(request.getNombre());
        entity.setCodigoDsm(request.getCodigoDsm());
        entity.setDescripcion(request.getDescripcion());
        entity.setCategoriaDiagnostica(categoria);
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public DiagnosticoResponseDTO update(
            Integer id,
            DiagnosticoRequestDTO request) {

        Diagnostico entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Diagnosis not found"));

        if (repository.existsByNombreAndIdNot(
                request.getNombre(),
                id)) {

            throw new DuplicateResourceException(
                    DUPLICATE_MESSAGE);
        }

        CategoriaDiagnostica categoria =
                categoriaRepository.findById(
                        request.getCategoriaDiagnosticaId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Diagnostic category not found"));

        Estado estado =
                estadoRepository.findById(
                        request.getEstadoId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "State not found"));

        entity.setNombre(request.getNombre());
        entity.setCodigoDsm(request.getCodigoDsm());
        entity.setDescripcion(request.getDescripcion());
        entity.setCategoriaDiagnostica(categoria);
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public void changeStatus(
            Integer id,
            Integer estadoId) {

        Diagnostico entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Diagnosis not found"));

        Estado estado = estadoRepository.findById(
                estadoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "State not found"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(
            Integer id) {

        Diagnostico entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Diagnosis not found"));

        repository.delete(entity);
    }
}