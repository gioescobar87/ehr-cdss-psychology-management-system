package com.clinica.psicologia.system.serv_implementation.catalog;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.TipoSustanciaAlergenaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.TipoSustanciaAlergenaResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.TipoSustanciaAlergenaMapper;
import com.clinica.psicologia.system.model.catalog.TipoSustanciaAlergena;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.TipoSustanciaAlergenaRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.TipoSustanciaAlergenaService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

@Service
public class TipoSustanciaAlergenaServiceImpl extends
        AbstractCatalogService<TipoSustanciaAlergena, TipoSustanciaAlergenaRequestDTO, TipoSustanciaAlergenaResponseDTO>
        implements TipoSustanciaAlergenaService {
            
    private final TipoSustanciaAlergenaRepository repository;

    private final String duplicateMessage = "Risk level already exists";

    public TipoSustanciaAlergenaServiceImpl(
            TipoSustanciaAlergenaRepository repository,
            EstadoRepository estadoRepository,
            ApplicationSupportService supportService,
            TipoSustanciaAlergenaMapper mapper) {

        super(
                repository,
                estadoRepository,
                supportService,
                mapper);

        this.repository = repository;
    }

    @Override
    protected TipoSustanciaAlergena createEntity() {

        return new TipoSustanciaAlergena();
    }

    @Override
    protected String getNombre(
            TipoSustanciaAlergenaRequestDTO request) {

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
