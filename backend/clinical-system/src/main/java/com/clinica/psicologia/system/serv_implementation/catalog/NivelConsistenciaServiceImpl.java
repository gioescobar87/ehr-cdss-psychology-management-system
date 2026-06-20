package com.clinica.psicologia.system.serv_implementation.catalog;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.NivelConsistenciaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.NivelConsistenciaResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.NivelConsistenciaMapper;
import com.clinica.psicologia.system.model.catalog.NivelConsistencia;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.NivelConsistenciaRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.NivelConsistenciaService;

@Service
public class NivelConsistenciaServiceImpl
        extends AbstractCatalogService<NivelConsistencia, NivelConsistenciaRequestDTO, NivelConsistenciaResponseDTO>
        implements NivelConsistenciaService {

    private final NivelConsistenciaRepository repository;

    private final String duplicateMessage = "Consistency level already exists";

    public NivelConsistenciaServiceImpl(
            NivelConsistenciaRepository repository,
            EstadoRepository estadoRepository,
            NivelConsistenciaMapper mapper) {

        super(
                repository,
                estadoRepository,
                mapper);

        this.repository = repository;
    }

    @Override
    protected NivelConsistencia createEntity() {

        return new NivelConsistencia();
    }

    @Override
    protected String getNombre(
            NivelConsistenciaRequestDTO request) {

        return request.getNombre();
    }

    @Override
    protected Integer extractEstadoId(
            NivelConsistenciaRequestDTO request) {

        return request.getEstadoId();
    }

    @Override
    protected void validateDuplicate(
            String nombre) {

        if (repository.existsByNombre(nombre)) {

            throw new DuplicateResourceException(
                    duplicateMessage);
        }
    }

    @Override
    protected void validateDuplicate(
            String nombre,
            Integer id) {

        if (repository.existsByNombreAndIdNot(
                nombre,
                id)) {

            throw new DuplicateResourceException(
                    duplicateMessage);
        }
    }
}
