package com.clinica.psicologia.system.mapper.security;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.security.UsuarioResponseDTO;
import com.clinica.psicologia.system.dto.response.security.UsuarioRolResponseDTO;
import com.clinica.psicologia.system.model.security.Rol;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.security.UsuarioRolRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UsuarioMapper {

    private final UsuarioRolRepository usuarioRolRepository;

    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {

        UsuarioResponseDTO dto = new UsuarioResponseDTO();

        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setCorreo(usuario.getCorreo());

        if (usuario.getEstado() != null) {
            dto.setEstadoId(usuario.getEstado().getId());
            dto.setEstado(usuario.getEstado().getNombre());
        }

        dto.setFechaCreacion(usuario.getFechaCreacion());
        dto.setFechaModificacion(usuario.getFechaModificacion());

        List<Rol> roles = usuarioRolRepository.findByUsuario(usuario)
                .stream()
                .map(usuarioRol -> usuarioRol.getRol())
                .toList();

        dto.setRoles(
                roles.stream()
                        .map(this::toRolResponseDTO)
                        .toList()
        );

        return dto;
    }

    public List<UsuarioResponseDTO> toResponseDTOList(
            List<Usuario> usuarios) {

        return usuarios.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public UsuarioRolResponseDTO toRolResponseDTO(Rol rol) {

        UsuarioRolResponseDTO dto =
                new UsuarioRolResponseDTO();

        dto.setId(rol.getId());
        dto.setNombre(rol.getNombre());

        return dto;
    }

    public List<UsuarioRolResponseDTO> toRolResponseDTOList(
            List<Rol> roles) {

        return roles.stream()
                .map(this::toRolResponseDTO)
                .toList();
    }
}