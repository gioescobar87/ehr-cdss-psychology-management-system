package com.clinica.psicologia.system.serv_implementation.catalog;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.TipoPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.TipoPruebaResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.TipoPruebaMapper;
import com.clinica.psicologia.system.model.catalog.TipoPrueba;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.TipoPruebaRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.TipoPruebaService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

@Service
public class TipoPruebaServiceImpl
        extends AbstractCatalogService<TipoPrueba, TipoPruebaRequestDTO, TipoPruebaResponseDTO>
        implements TipoPruebaService {
private final TipoPruebaRepository repository;

    private final String duplicateMessage = "Risk level already exists";

    public TipoPruebaServiceImpl(
            TipoPruebaRepository repository,
            EstadoRepository estadoRepository,
            ApplicationSupportService supportService,
            TipoPruebaMapper mapper) {

        super(
                repository,
                estadoRepository,
                supportService,
                mapper);

        this.repository = repository;
    }

    @Override
    protected TipoPrueba createEntity() {

        return new TipoPrueba();
    }

    @Override
    protected String getNombre(
            TipoPruebaRequestDTO request) {

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
