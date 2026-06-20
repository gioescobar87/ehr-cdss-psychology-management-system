package com.clinica.psicologia.system.serv_implementation.security;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.dto.request.security.ModuloRequestDTO;
import com.clinica.psicologia.system.dto.response.security.ModuloResponseDTO;
import com.clinica.psicologia.system.mapper.security.ModuloMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.security.Modulo;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.security.ModuloRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.security.ModuloService;

@Service
public class ModuloServiceImpl
        implements ModuloService {

    private final ModuloRepository moduloRepository;
    private final EstadoRepository estadoRepository;
    private final ModuloMapper moduloMapper;

    public ModuloServiceImpl(
            ModuloRepository moduloRepository,
            EstadoRepository estadoRepository,
            ModuloMapper moduloMapper) {

        this.moduloRepository = moduloRepository;
        this.estadoRepository = estadoRepository;
        this.moduloMapper = moduloMapper;
    }

    @Override
    public List<ModuloResponseDTO> findAll() {

        return moduloMapper.toResponseList(
                moduloRepository.findAll());
    }

    @Override
    public ModuloResponseDTO findById(
            Integer id) {

        Modulo modulo = moduloRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Module not found"));

        return moduloMapper.toResponse(modulo);
    }

    @Override
    @Transactional
    public ModuloResponseDTO create(
            ModuloRequestDTO request) {

        if (moduloRepository.existsByNombre(
                request.getNombre())) {

            throw new DuplicateResourceException(
                    "Module already exists");
        }

        Estado estado = estadoRepository.findById(
                request.getEstadoId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "State not found"));

        Modulo modulo = new Modulo();

        modulo.setNombre(
                request.getNombre());

        modulo.setDescripcion(
                request.getDescripcion());

        modulo.setEstado(estado);

        return moduloMapper.toResponse(
                moduloRepository.save(modulo));
    }

    @Override
    @Transactional
    public ModuloResponseDTO update(
            Integer id,
            ModuloRequestDTO request) {

        Modulo modulo = moduloRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Module not found"));

        if (moduloRepository.existsByNombreAndIdNot(
                request.getNombre(),
                id)) {

            throw new DuplicateResourceException(
                    "Module already exists");
        }

        Estado estado = estadoRepository.findById(
                request.getEstadoId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "State not found"));

        modulo.setNombre(
                request.getNombre());

        modulo.setDescripcion(
                request.getDescripcion());

        modulo.setEstado(estado);

        return moduloMapper.toResponse(
                moduloRepository.save(modulo));
    }

    @Override
    @Transactional
    public void changeStatus(
            Integer id,
            Integer estadoId) {

        Modulo modulo = moduloRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Module not found"));

        Estado estado = estadoRepository.findById(
                estadoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "State not found"));

        modulo.setEstado(estado);

        moduloRepository.save(modulo);
    }

    @Override
    @Transactional
    public void delete(
            Integer id) {

        Modulo modulo = moduloRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Module not found"));

        moduloRepository.delete(modulo);
    }
}