package com.clinica.psicologia.system.service.security;

import java.util.List;

import com.clinica.psicologia.system.dto.request.security.UsuarioRequestDTO;
import com.clinica.psicologia.system.dto.response.security.UsuarioResponseDTO;
import com.clinica.psicologia.system.dto.response.security.UsuarioRolResponseDTO;

public interface UsuarioService {

    List<UsuarioResponseDTO> findAll();

    UsuarioResponseDTO findById(Integer id);

    UsuarioResponseDTO create(
            UsuarioRequestDTO request);

    UsuarioResponseDTO update(
            Integer id,
            UsuarioRequestDTO request);

    void changeStatus(
            Integer id,
            Integer estadoId);

    void delete(Integer id);

    List<UsuarioRolResponseDTO> getRoles(
            Integer usuarioId);

    void assignRole(
            Integer usuarioId,
            Integer rolId);

    void removeRole(
            Integer usuarioId,
            Integer rolId);
}