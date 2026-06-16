package com.clinica.psicologia.system.service.security.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.dto.request.security.PermisoRequestDTO;
import com.clinica.psicologia.system.dto.response.security.PermisoResponseDTO;
import com.clinica.psicologia.system.model.security.Modulo;
import com.clinica.psicologia.system.model.security.Permiso;
import com.clinica.psicologia.system.repository.security.ModuloRepository;
import com.clinica.psicologia.system.repository.security.PermisoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.security.PermisoService;

@Service
public class PermisoServiceImpl implements PermisoService {

    private final PermisoRepository permisoRepository;
    private final ModuloRepository moduloRepository;

    public PermisoServiceImpl(PermisoRepository permisoRepository, ModuloRepository moduloRepository) {
        this.permisoRepository = permisoRepository;
        this.moduloRepository = moduloRepository;
    }

    @Override
    public List<PermisoResponseDTO> findAll() {
        return permisoRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public PermisoResponseDTO findById(Integer id) {
        Permiso permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

        return toDTO(permiso);
    }

    @Override
    @Transactional
    public PermisoResponseDTO create(PermisoRequestDTO request) {

        Permiso permiso = new Permiso();
        permiso.setNombre(request.getNombre());
        permiso.setDescripcion(request.getDescripcion());

        Modulo modulo = moduloRepository
                .findById(request.getModuloId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Module not found"));

        permiso.setModulo(modulo);

        return toDTO(permisoRepository.save(permiso));
    }

    @Override
    @Transactional
    public PermisoResponseDTO update(Integer id, PermisoRequestDTO request) {

        Permiso permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

        permiso.setNombre(request.getNombre());
        permiso.setDescripcion(request.getDescripcion());

        Modulo modulo = moduloRepository
                .findById(request.getModuloId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Module not found"));

        permiso.setModulo(modulo);

        return toDTO(permisoRepository.save(permiso));
    }

    @Override
    @Transactional
    public void delete(Integer id) {

        Permiso permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

        permisoRepository.delete(permiso);
    }

    private PermisoResponseDTO toDTO(Permiso permiso) {
        PermisoResponseDTO dto = new PermisoResponseDTO();
        dto.setId(permiso.getId());
        dto.setNombre(permiso.getNombre());
        dto.setDescripcion(permiso.getDescripcion());
        return dto;
    }
}