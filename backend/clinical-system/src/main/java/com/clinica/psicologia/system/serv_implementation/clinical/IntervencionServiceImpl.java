package com.clinica.psicologia.system.serv_implementation.clinical;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.IntervencionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.IntervencionResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.IntervencionMapper;
import com.clinica.psicologia.system.model.catalog.TipoIntervencion;
import com.clinica.psicologia.system.model.clinical.Intervencion;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.TipoIntervencionRepository;
import com.clinica.psicologia.system.repository.clinical.IntervencionRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.clinical.IntervencionService;

@Service
public class IntervencionServiceImpl
        extends AbstractCatalogService<Intervencion, IntervencionRequestDTO, IntervencionResponseDTO>
        implements IntervencionService {

    private final IntervencionRepository repository;

    private final TipoIntervencionRepository tipoIntervencionRepository;

    private static final String DUPLICATE_MESSAGE = "La intervención ya existe.";

    public IntervencionServiceImpl(
            IntervencionRepository repository,
            EstadoRepository estadoRepository,
            TipoIntervencionRepository tipoIntervencionRepository,
            IntervencionMapper mapper) {

        super(
                repository,
                estadoRepository,
                mapper);

        this.repository = repository;
        this.tipoIntervencionRepository = tipoIntervencionRepository;
    }

    @Override
    protected Intervencion createEntity() {
        return new Intervencion();
    }

    @Override
    protected String getNombre(IntervencionRequestDTO request) {
        return request.getNombre();
    }

    @Override
    protected Integer extractEstadoId(IntervencionRequestDTO request) {
        return request.getEstadoId();
    }

    @Override
    protected void validateDuplicate(String nombre) {
        if (repository.existsByNombre(nombre)) {
            throw new DuplicateResourceException(
                    DUPLICATE_MESSAGE);
        }
    }

    @Override
    protected void validateDuplicate(String nombre, Integer id) {
        if (repository.existsByNombreAndIdNot(nombre, id)) {

            throw new DuplicateResourceException(DUPLICATE_MESSAGE);
        }
    }

    @Override
    protected void validateAdditionalFields(Intervencion entity, IntervencionRequestDTO request) {
        assignTipoIntervencion(entity, request.getTipoIntervencionId());
    }

    @Override
    protected void validateAdditionalFields(Intervencion entity, IntervencionRequestDTO request, Integer id) {
        assignTipoIntervencion(entity, request.getTipoIntervencionId());
    }

    private void assignTipoIntervencion(Intervencion entity, Integer tipoIntervencionId) {

        TipoIntervencion tipoIntervencion = tipoIntervencionRepository
                .findById(tipoIntervencionId)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de intervención no encontrado."));

        entity.setTipoIntervencion(tipoIntervencion);
    }

}