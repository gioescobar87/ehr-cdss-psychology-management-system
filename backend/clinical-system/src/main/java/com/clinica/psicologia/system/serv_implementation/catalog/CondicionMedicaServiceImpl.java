package com.clinica.psicologia.system.serv_implementation.catalog;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.CondicionMedicaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.CondicionMedicaResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.CondicionMedicaMapper;
import com.clinica.psicologia.system.model.catalog.CondicionMedica;
import com.clinica.psicologia.system.repository.catalog.CondicionMedicaRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.CondicionMedicaService;

@Service
public class CondicionMedicaServiceImpl
        extends AbstractCatalogService<CondicionMedica, CondicionMedicaRequestDTO, CondicionMedicaResponseDTO>
        implements CondicionMedicaService {

    private final CondicionMedicaRepository repository;

    private static final String DUPLICATE_NAME_MESSAGE =
            "Medical condition already exists";

    private static final String DUPLICATE_CODE_MESSAGE =
            "Reference code already exists";

    public CondicionMedicaServiceImpl(
            CondicionMedicaRepository repository,
            EstadoRepository estadoRepository,
            CondicionMedicaMapper mapper) {

        super(
                repository,
                estadoRepository,
                mapper);

        this.repository = repository;
    }

    @Override
    protected CondicionMedica createEntity() {

        return new CondicionMedica();
    }

    @Override
    protected String getNombre(
            CondicionMedicaRequestDTO request) {

        return request.getNombre();
    }

    @Override
    protected Integer extractEstadoId(
            CondicionMedicaRequestDTO request) {

        return request.getEstadoId();
    }

    @Override
    protected void validateDuplicate(
            String nombre) {

        if (repository.existsByNombre(nombre)) {

            throw new DuplicateResourceException(
                    DUPLICATE_NAME_MESSAGE);
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
                    DUPLICATE_NAME_MESSAGE);
        }
    }

    @Override
    protected void validateAdditionalFields(
            CondicionMedicaRequestDTO request) {

        if (request.getCodigoReferencia() != null
                && !request.getCodigoReferencia().isBlank()
                && repository.existsByCodigoReferencia(
                        request.getCodigoReferencia())) {

            throw new DuplicateResourceException(
                    DUPLICATE_CODE_MESSAGE);
        }
    }

    @Override
    protected void validateAdditionalFields(
            CondicionMedicaRequestDTO request,
            Integer id) {

        if (request.getCodigoReferencia() != null
                && !request.getCodigoReferencia().isBlank()
                && repository.existsByCodigoReferenciaAndIdNot(
                        request.getCodigoReferencia(),
                        id)) {

            throw new DuplicateResourceException(
                    DUPLICATE_CODE_MESSAGE);
        }
    }
}