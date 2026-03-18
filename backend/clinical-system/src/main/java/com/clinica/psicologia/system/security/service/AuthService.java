package com.clinica.psicologia.system.security.service;

import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.model.security.Rol;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.model.security.UsuarioRol;
import com.clinica.psicologia.system.repository.security.RolRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRolRepository;
import com.clinica.psicologia.system.security.dto.LoginRequest;
import com.clinica.psicologia.system.security.dto.RegisterRequest;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final SecurityUserService userService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final UsuarioRolRepository usuarioRolRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager, SecurityUserService userService,
            JwtService jwtService, RefreshTokenService refreshTokenService, UsuarioRepository usuarioRepository,
            RolRepository rolRepository, UsuarioRolRepository usuarioRolRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.usuarioRolRepository = usuarioRolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, String> login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        UserDetails user = userService.loadUserByUsername(request.getUsername());

        String access = jwtService.generateToken(user);

        String refresh = refreshTokenService.createRefreshToken(user.getUsername()).getToken();

        return Map.of(
                "accessToken", access,
                "refreshToken", refresh);
    }

    @Transactional
    public void register(RegisterRequest request){
        if(usuarioRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username already exists");
        }

        if(usuarioRepository.existsByCorreo(request.getCorreo())){
            throw new RuntimeException("Email already exists");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setCorreo(request.getCorreo());
        usuario.setIdEstado(1);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        Rol rol = rolRepository.findByNombreRol(request.getRoleName()).orElseThrow();
        
        UsuarioRol usuarioRol = new UsuarioRol();
        usuarioRol.setUsuario(usuarioGuardado);
        usuarioRol.setRol(rol);

        usuarioRolRepository.save(usuarioRol);
    }
}
