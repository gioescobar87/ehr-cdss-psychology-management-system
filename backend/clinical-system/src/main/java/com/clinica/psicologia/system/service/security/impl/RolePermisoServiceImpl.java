package com.clinica.psicologia.system.service.security.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.dto.response.security.RolPermisoResponseDTO;
import com.clinica.psicologia.system.model.security.Permiso;
import com.clinica.psicologia.system.model.security.Rol;
import com.clinica.psicologia.system.model.security.RolPermiso;
import com.clinica.psicologia.system.repository.security.PermisoRepository;
import com.clinica.psicologia.system.repository.security.RolPermisoRepository;
import com.clinica.psicologia.system.repository.security.RolRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.security.RolePermisoService;

@Service
public class RolePermisoServiceImpl implements RolePermisoService {

        private final RolRepository rolRepository;
        private final PermisoRepository permisoRepository;
        private final RolPermisoRepository rolPermisoRepository;

        public RolePermisoServiceImpl(
                        RolRepository rolRepository,
                        PermisoRepository permisoRepository,
                        RolPermisoRepository rolPermisoRepository) {

                this.rolRepository = rolRepository;
                this.permisoRepository = permisoRepository;
                this.rolPermisoRepository = rolPermisoRepository;
        }

        @Override
        public List<RolPermisoResponseDTO> getPermissionsByRole(Integer rolId) {

                Rol rol = rolRepository.findById(rolId)
                                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

                return rolPermisoRepository.findByRol(rol).stream()
                                .map(rp -> {
                                        RolPermisoResponseDTO dto = new RolPermisoResponseDTO();
                                        dto.setId(rp.getPermiso().getId());
                                        dto.setNombre(rp.getPermiso().getNombre());
                                        return dto;
                                })
                                .toList();
        }

        @Override
        @Transactional
        public void assignPermission(Integer rolId, Integer permisoId) {

                Rol rol = rolRepository.findById(rolId)
                                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

                Permiso permiso = permisoRepository.findById(permisoId)
                                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

                if (rolPermisoRepository.existsByRolAndPermiso(rol, permiso)) {

                        throw new DuplicateResourceException(
                                        "Permission already assigned to role");
                }

                RolPermiso rp = new RolPermiso();
                rp.setRol(rol);
                rp.setPermiso(permiso);

                rolPermisoRepository.save(rp);
        }

        @Override
        @Transactional
        public void removePermission(Integer rolId, Integer permisoId) {

                Rol rol = rolRepository.findById(rolId)
                                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

                Permiso permiso = permisoRepository.findById(permisoId)
                                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

                RolPermiso rolPermiso = rolPermisoRepository
                                .findByRolAndPermiso(
                                                rol,
                                                permiso)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Role-Permission relation not found"));

                rolPermisoRepository.delete(rolPermiso);
        }
}