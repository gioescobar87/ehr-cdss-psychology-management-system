package com.clinica.psicologia.system.serv_implementation.catalog;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.NivelEscolaridadRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.NivelEscolaridadResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.NivelEscolaridadMapper;
import com.clinica.psicologia.system.model.catalog.NivelEscolaridad;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.NivelEscolaridadRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.NivelEscolaridadService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

@Service
public class NivelEscolaridadServiceImpl
        extends AbstractCatalogService<NivelEscolaridad, NivelEscolaridadRequestDTO, NivelEscolaridadResponseDTO>
        implements NivelEscolaridadService {

    private final NivelEscolaridadRepository repository;

    public NivelEscolaridadServiceImpl(
            NivelEscolaridadRepository repository,
            EstadoRepository estadoRepository,
            ApplicationSupportService supportService,
            NivelEscolaridadMapper mapper) {

        super(
                repository,
                estadoRepository,
                supportService,
                mapper);

        this.repository = repository;
    }

    @Override
    protected NivelEscolaridad createEntity() {

        return new NivelEscolaridad();
    }

    @Override
    protected String getNombre(
            NivelEscolaridadRequestDTO request) {

        return request.getNombre();
    }

    @Override
    protected void validateDuplicate(
            String nombre) {

        if (repository.existsByNombre(nombre)) {

            throw new DuplicateResourceException(
                    "Education grade already exists");
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
                    "Education grade already exists");
        }
    }
}
