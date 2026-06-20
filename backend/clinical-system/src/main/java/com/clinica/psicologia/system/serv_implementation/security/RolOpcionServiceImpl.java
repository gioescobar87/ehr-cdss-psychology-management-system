package com.clinica.psicologia.system.serv_implementation.security;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.dto.request.security.RolOpcionRequestDTO;
import com.clinica.psicologia.system.dto.response.security.RolOpcionResponseDTO;
import com.clinica.psicologia.system.mapper.security.RolOpcionMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.security.Opcion;
import com.clinica.psicologia.system.model.security.Rol;
import com.clinica.psicologia.system.model.security.RolOpcion;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.security.OpcionRepository;
import com.clinica.psicologia.system.repository.security.RolOpcionRepository;
import com.clinica.psicologia.system.repository.security.RolRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.security.RolOpcionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RolOpcionServiceImpl
        implements RolOpcionService {

    private final RolRepository rolRepository;

    private final OpcionRepository opcionRepository;

    private final RolOpcionRepository rolOpcionRepository;

    private final EstadoRepository estadoRepository;

    private final RolOpcionMapper rolOpcionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<RolOpcionResponseDTO> findByRolId(
            Integer rolId) {

        if (!rolRepository.existsById(
                rolId)) {

            throw new ResourceNotFoundException(
                    "Role not found");
        }

        return rolOpcionMapper.toResponseDTOList(
                rolOpcionRepository.findByRolId(
                        rolId));
    }

    @Override
    public RolOpcionResponseDTO assign(
            Integer rolId,
            RolOpcionRequestDTO request) {

        Rol rol = rolRepository.findById(
                rolId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found"));

        Opcion opcion = opcionRepository.findById(
                request.getOpcionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Option not found"));

        Estado estado = estadoRepository.findById(
                request.getEstadoId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "State not found"));

        if (rolOpcionRepository
                .existsByRolIdAndOpcionId(
                        rolId,
                        request.getOpcionId())) {

            throw new DuplicateResourceException(
                    "Option already assigned to role");
        }

        RolOpcion entity =
                new RolOpcion();

        entity.setRol(rol);

        entity.setOpcion(opcion);

        entity.setVisible(
                request.getVisible());

        entity.setEstado(estado);

        entity =
                rolOpcionRepository.save(
                        entity);

        return rolOpcionMapper.toResponseDTO(
                entity);
    }

    @Override
    public void remove(
            Integer rolId,
            Integer opcionId) {

        if (!rolOpcionRepository
                .existsByRolIdAndOpcionId(
                        rolId,
                        opcionId)) {

            throw new ResourceNotFoundException(
                    "Role option assignment not found");
        }

        rolOpcionRepository
                .deleteByRolIdAndOpcionId(
                        rolId,
                        opcionId);
    }
}