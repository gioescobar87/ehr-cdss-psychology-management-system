package com.clinica.psicologia.system.security.service;

import com.clinica.psicologia.system.model.security.*;
import com.clinica.psicologia.system.repository.security.*;
import com.clinica.psicologia.system.security.model.SecurityUser;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SecurityUserService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioRolRepository usuarioRolRepository;
    private final RolPermisoRepository rolPermisoRepository;

    public SecurityUserService(
            UsuarioRepository usuarioRepository,
            UsuarioRolRepository usuarioRolRepository,
            RolPermisoRepository rolPermisoRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioRolRepository = usuarioRolRepository;
        this.rolPermisoRepository = rolPermisoRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        List<UsuarioRol> rolesUsuario =
                usuarioRolRepository.findByUsuario(usuario);

        Set<SimpleGrantedAuthority> authorities =
                new HashSet<>();

        for (UsuarioRol ur : rolesUsuario) {

            Rol rol = ur.getRol();

            authorities.add(
                    new SimpleGrantedAuthority(
                            "ROLE_" + rol.getNombreRol().trim().toUpperCase()
                    )
            );

            List<RolPermiso> permisos =
                    rolPermisoRepository.findByRol(rol);

            for (RolPermiso rp : permisos) {
                authorities.add(
                        new SimpleGrantedAuthority(
                                rp.getPermiso().getNombrePermiso().trim().toUpperCase()
                        )
                );
            }
        }

        return new SecurityUser(usuario, authorities);
    }
}