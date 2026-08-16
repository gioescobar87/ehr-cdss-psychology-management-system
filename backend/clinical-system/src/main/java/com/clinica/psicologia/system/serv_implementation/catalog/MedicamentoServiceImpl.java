package com.clinica.psicologia.system.serv_implementation.catalog;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.MedicamentoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.MedicamentoResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.MedicamentoMapper;
import com.clinica.psicologia.system.model.catalog.Medicamento;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.MedicamentoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.MedicamentoService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

@Service
public class MedicamentoServiceImpl
        extends AbstractCatalogService<Medicamento, MedicamentoRequestDTO, MedicamentoResponseDTO>
        implements MedicamentoService {
    private final MedicamentoRepository repository;

    private final String duplicateMessage = "Risk level already exists";

    public MedicamentoServiceImpl(
            MedicamentoRepository repository,
            EstadoRepository estadoRepository,
            ApplicationSupportService supportService,
            MedicamentoMapper mapper) {

        super(
                repository,
                estadoRepository,
                supportService,
                mapper);

        this.repository = repository;
    }

    @Override
    protected Medicamento createEntity() {

        return new Medicamento();
    }

    @Override
    protected String getNombre(
            MedicamentoRequestDTO request) {

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
