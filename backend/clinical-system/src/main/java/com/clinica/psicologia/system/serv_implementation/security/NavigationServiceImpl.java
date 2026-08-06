package com.clinica.psicologia.system.serv_implementation.security;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.dto.response.security.NavigationModuleResponseDTO;
import com.clinica.psicologia.system.dto.response.security.NavigationOptionResponseDTO;
import com.clinica.psicologia.system.model.security.Modulo;
import com.clinica.psicologia.system.model.security.Opcion;
import com.clinica.psicologia.system.model.security.RolOpcion;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.security.RolOpcionRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRolRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.security.NavigationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NavigationServiceImpl implements NavigationService {

    private final UsuarioRepository usuarioRepository;

    private final UsuarioRolRepository usuarioRolRepository;

    private final RolOpcionRepository rolOpcionRepository;

    @Override
    public List<NavigationModuleResponseDTO> getNavigation() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        Usuario usuario = usuarioRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        List<Integer> roleIds =
                usuarioRolRepository
                        .findByUsuarioId(usuario.getId())
                        .stream()
                        .map(usuarioRol -> usuarioRol.getRol().getId())
                        .distinct()
                        .toList();

        if (roleIds.isEmpty()) {
            return List.of();
        }

        List<RolOpcion> roleOptions =
                rolOpcionRepository.findNavigationByRoleIds(roleIds);

        Map<Integer, NavigationModuleResponseDTO> modules =
                new LinkedHashMap<>();

        Map<Integer, NavigationOptionResponseDTO> options =
                new LinkedHashMap<>();

        Map<Integer, Integer> optionModuleMap =
                new LinkedHashMap<>();

        /*
         * Create Module and Option DTOs
         */
        for (RolOpcion roleOption : roleOptions) {

            Opcion option = roleOption.getOpcion();

            Modulo module = option.getModulo();

            NavigationModuleResponseDTO moduleDto =
                    modules.computeIfAbsent(
                            module.getId(),
                            id -> {

                                NavigationModuleResponseDTO dto =
                                        new NavigationModuleResponseDTO();

                                dto.setId(module.getId());
                                dto.setNombre(module.getNombre());
                                dto.setIcono(module.getIcono());
                                dto.setOrden(module.getOrden());

                                return dto;
                            });

            if (options.containsKey(option.getId())) {
                continue;
            }

            NavigationOptionResponseDTO optionDto =
                    new NavigationOptionResponseDTO();

            optionDto.setId(option.getId());

            optionDto.setNombre(option.getNombre());

            optionDto.setRutaFrontend(option.getRutaFrontend());

            optionDto.setComponente(option.getComponente());

            optionDto.setIcono(option.getIcono());

            optionDto.setOrden(option.getOrden());

            if (option.getOpcionPadre() != null) {

                optionDto.setParentId(
                        option.getOpcionPadre().getId());
            }

            options.put(
                    option.getId(),
                    optionDto);

            optionModuleMap.put(
                    option.getId(),
                    moduleDto.getId());
        }

        /*
         * Build hierarchy
         */
        for (NavigationOptionResponseDTO option : options.values()) {

            if (option.getParentId() == null) {

                modules.get(
                        optionModuleMap.get(option.getId()))
                        .getOpciones()
                        .add(option);

                continue;
            }

            NavigationOptionResponseDTO parent =
                    options.get(option.getParentId());

            if (parent != null) {

                parent.getChildren().add(option);

            } else {

                modules.get(
                        optionModuleMap.get(option.getId()))
                        .getOpciones()
                        .add(option);
            }
        }

        /*
         * Sort modules and options
         */
        List<NavigationModuleResponseDTO> result =
                new ArrayList<>(modules.values());

        result.sort(
                Comparator.comparing(
                        NavigationModuleResponseDTO::getOrden));

        result.forEach(module ->
                sortOptions(module.getOpciones()));

        return result;
    }

    private void sortOptions(
            List<NavigationOptionResponseDTO> options) {

        options.sort(
                Comparator.comparing(
                        NavigationOptionResponseDTO::getOrden));

        options.forEach(option ->
                sortOptions(option.getChildren()));
    }
}