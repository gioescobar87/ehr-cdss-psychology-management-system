package com.clinica.psicologia.system.service.security.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.dto.request.security.UsuarioRequestDTO;
import com.clinica.psicologia.system.dto.response.security.UsuarioResponseDTO;
import com.clinica.psicologia.system.dto.response.security.UsuarioRolResponseDTO;
import com.clinica.psicologia.system.mapper.security.UsuarioMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.security.Rol;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.model.security.UsuarioRol;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.security.RolRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRolRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.security.UsuarioService;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final EstadoRepository estadoRepository;
    private final RolRepository rolRepository;
    private final UsuarioRolRepository usuarioRolRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(
            UsuarioRepository usuarioRepository,
            EstadoRepository estadoRepository,
            RolRepository rolRepository,
            UsuarioRolRepository usuarioRolRepository,
            UsuarioMapper usuarioMapper,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.estadoRepository = estadoRepository;
        this.rolRepository = rolRepository;
        this.usuarioRolRepository = usuarioRolRepository;
        this.usuarioMapper = usuarioMapper;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // GET ALL USERS
    // =========================
    @Override
    public List<UsuarioResponseDTO> findAll() {

        List<Usuario> usuarios = usuarioRepository.findAllByOrderByNombreAsc();

        return usuarioMapper.toResponseDTOList(usuarios);
    }

    // =========================
    // GET USER BY ID
    // =========================
    @Override
    public UsuarioResponseDTO findById(Integer id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return usuarioMapper.toResponseDTO(usuario);
    }

    // =========================
    // CREATE USER (ADMIN)
    // =========================
    @Override
    @Transactional
    public UsuarioResponseDTO create(UsuarioRequestDTO request) {

        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }

        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new DuplicateResourceException("Email already exists");
        }

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setCorreo(request.getCorreo());
        usuario.setEstado(estado);

        // Option A: temporary password (must be changed via auth flow)
        usuario.setPassword(passwordEncoder.encode("Temp123*"));

        Usuario saved = usuarioRepository.save(usuario);

        return usuarioMapper.toResponseDTO(saved);
    }

    // =========================
    // UPDATE USER
    // =========================
    @Override
    @Transactional
    public UsuarioResponseDTO update(Integer id, UsuarioRequestDTO request) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (usuarioRepository.existsByUsernameAndIdNot(request.getUsername(), id)) {
            throw new DuplicateResourceException("Username already exists");
        }

        if (usuarioRepository.existsByCorreoAndIdNot(request.getCorreo(), id)) {
            throw new DuplicateResourceException("Email already exists");
        }

        Estado estado = estadoRepository.findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        usuario.setUsername(request.getUsername());
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setCorreo(request.getCorreo());
        usuario.setEstado(estado);

        Usuario updated = usuarioRepository.save(usuario);

        return usuarioMapper.toResponseDTO(updated);
    }

    // =========================
    // CHANGE STATUS
    // =========================
    @Override
    @Transactional
    public void changeStatus(Integer id, Integer estadoId) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        usuario.setEstado(estado);

        usuarioRepository.save(usuario);
    }

    // =========================
    // DELETE USER
    // =========================
    @Override
    @Transactional
    public void delete(Integer id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        usuarioRolRepository.findByUsuario(usuario)
                .forEach(usuarioRolRepository::delete);

        usuarioRepository.delete(usuario);
    }

    // =========================
    // GET USER ROLES
    // =========================
    @Override
    public List<UsuarioRolResponseDTO> getRoles(Integer usuarioId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Rol> roles = usuarioRolRepository.findByUsuario(usuario)
                .stream()
                .map(UsuarioRol::getRol)
                .toList();

        return roles.stream()
                .map(usuarioMapper::toRolResponseDTO)
                .toList();
    }

    // =========================
    // ASSIGN ROLE
    // =========================
    @Override
    @Transactional
    public void assignRole(Integer usuarioId, Integer rolId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Rol rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        if (usuarioRolRepository.existsByUsuarioAndRol(usuario, rol)) {
            throw new DuplicateResourceException("User already has this role");
        }

        UsuarioRol usuarioRol = new UsuarioRol();
        usuarioRol.setUsuario(usuario);
        usuarioRol.setRol(rol);

        usuarioRolRepository.save(usuarioRol);
    }

    // =========================
    // REMOVE ROLE
    // =========================
    @Override
    @Transactional
    public void removeRole(Integer usuarioId, Integer rolId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Rol rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        UsuarioRol usuarioRol = usuarioRolRepository.findByUsuarioAndRol(usuario, rol)
                .orElseThrow(() -> new ResourceNotFoundException("User role not found"));

        usuarioRolRepository.delete(usuarioRol);
    }
}