package com.clinica.psicologia.system.serv_implementation.catalog;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.NivelRiesgoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.NivelRiesgoResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.NivelRiesgoMapper;
import com.clinica.psicologia.system.model.catalog.NivelRiesgo;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.NivelRiesgoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.NivelRiesgoService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

@Service
public class NivelRiesgoServiceImpl
        extends AbstractCatalogService<NivelRiesgo, NivelRiesgoRequestDTO, NivelRiesgoResponseDTO>
        implements NivelRiesgoService {

    private final NivelRiesgoRepository repository;

    private final String duplicateMessage = "Risk level already exists";

    public NivelRiesgoServiceImpl(
            NivelRiesgoRepository repository,
            EstadoRepository estadoRepository,
            ApplicationSupportService supportService,
            NivelRiesgoMapper mapper) {

        super(
                repository,
                estadoRepository,
                supportService,
                mapper);

        this.repository = repository;
    }

    @Override
    protected NivelRiesgo createEntity() {

        return new NivelRiesgo();
    }

    @Override
    protected String getNombre(
            NivelRiesgoRequestDTO request) {

        return request.getNombre();
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
