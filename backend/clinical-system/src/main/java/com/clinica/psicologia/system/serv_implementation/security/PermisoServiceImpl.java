package com.clinica.psicologia.system.serv_implementation.security;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.dto.request.security.PermisoRequestDTO;
import com.clinica.psicologia.system.dto.response.security.PermisoResponseDTO;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.security.Permiso;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.security.PermisoRepository;
import com.clinica.psicologia.system.repository.security.RolPermisoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.security.PermisoService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PermisoServiceImpl implements PermisoService {

    private final EstadoRepository estadoRepository;
    private final PermisoRepository permisoRepository;
    private final RolPermisoRepository rolPermisoRepository;
    private final ApplicationSupportService supportService;

    @Override
    public List<PermisoResponseDTO> findAll() {
        return permisoRepository
                .findAllByOrderByNombreAsc()
                .stream()
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

        if (permisoRepository.existsByNombre(
                request.getNombre())) {

            throw new DuplicateResourceException("Permission already exists");
        }

        Permiso permiso = new Permiso();

        permiso.setNombre(request.getNombre());
        permiso.setDescripcion(request.getDescripcion());
        permiso.setEstado(supportService.getActiveState());

        return toDTO(permisoRepository.save(permiso));
    }

    @Override
    @Transactional
    public PermisoResponseDTO update(Integer id, PermisoRequestDTO request) {

        Permiso permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

        if (permisoRepository.existsByNombreAndIdNot(request.getNombre(), id)) {
            throw new DuplicateResourceException(
                    "Permission already exists");
        }

        permiso.setNombre(request.getNombre());
        permiso.setDescripcion(request.getDescripcion());

        return toDTO(permisoRepository.save(permiso));
    }

    @Override
    @Transactional
    public void delete(Integer id) {

        Permiso permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

        if (rolPermisoRepository.existsByPermiso(permiso)) {
            throw new DuplicateResourceException(
                    "Permission cannot be deleted because it is assigned to roles");
        }

        permisoRepository.delete(permiso);
    }

    private PermisoResponseDTO toDTO(Permiso permiso) {
        PermisoResponseDTO dto = new PermisoResponseDTO();
        dto.setId(permiso.getId());
        dto.setNombre(permiso.getNombre());
        dto.setDescripcion(permiso.getDescripcion());
        dto.setEstadoId(permiso.getEstado().getId());
        dto.setEstado(permiso.getEstado().getNombre());
        return dto;
    }

    @Override
    @Transactional
    public void changeStatus(Integer id, Integer estadoId) {

        Permiso permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Option not found"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        permiso.setEstado(estado);

        permisoRepository.save(permiso);
    }
}