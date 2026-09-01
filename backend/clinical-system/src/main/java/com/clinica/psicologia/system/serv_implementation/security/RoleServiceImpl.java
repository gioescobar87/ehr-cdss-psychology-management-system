package com.clinica.psicologia.system.serv_implementation.security;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.dto.request.security.RolRequestDTO;
import com.clinica.psicologia.system.dto.response.security.RolResponseDTO;
import com.clinica.psicologia.system.mapper.security.RolMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.security.Rol;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.security.RolRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRolRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.security.RoleService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RolRepository rolRepository;
    private final EstadoRepository estadoRepository;
    private final RolMapper rolMapper;
    private final UsuarioRolRepository usuarioRolRepository;
    private final ApplicationSupportService supportService;

    @Override
    public List<RolResponseDTO> findAll() {
        return rolMapper.toResponseList(rolRepository.findAll());
    }

    @Override
    public RolResponseDTO findById(Integer id) {

        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        return rolMapper.toResponse(rol);
    }

    @Override
    @Transactional
    public RolResponseDTO create(RolRequestDTO request) {

        if (rolRepository.existsByNombre(request.getNombre())) {
            throw new DuplicateResourceException("Role already exists");
        }

        Rol rol = new Rol();
        rol.setNombre(request.getNombre());
        rol.setDescripcion(request.getDescripcion());
        rol.setEstado(supportService.getActiveState());

        return rolMapper.toResponse(rolRepository.save(rol));
    }

    @Override
    @Transactional
    public RolResponseDTO update(Integer id, RolRequestDTO request) {

        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        if (rolRepository.existsByNombreAndIdNot(request.getNombre(), id)) {
            throw new DuplicateResourceException("Role already exists");
        }

        rol.setNombre(request.getNombre());
        rol.setDescripcion(request.getDescripcion());

        return rolMapper.toResponse(rolRepository.save(rol));
    }

    @Override
    @Transactional
    public void changeStatus(Integer id, Integer estadoId) {

        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        rol.setEstado(estado);

        rolRepository.save(rol);
    }

    @Override
    @Transactional
    public void delete(Integer id) {

        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        if (usuarioRolRepository.existsByRol(rol)) {
            throw new DuplicateResourceException(
                    "Role cannot be deleted because it is assigned to users");
        }

        rolRepository.delete(rol);
    }
}