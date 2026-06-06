package com.clinica.psicologia.system.security.service;

import com.clinica.psicologia.system.model.security.*;
import com.clinica.psicologia.system.repository.security.*;
import com.clinica.psicologia.system.security.exception.custom.AccountDisabledException;
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
                        RolPermisoRepository rolPermisoRepository) {
                this.usuarioRepository = usuarioRepository;
                this.usuarioRolRepository = usuarioRolRepository;
                this.rolPermisoRepository = rolPermisoRepository;
        }

        @Override
        public UserDetails loadUserByUsername(String username)
                        throws UsernameNotFoundException {

                Usuario usuario = usuarioRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                String estado = usuario.getEstado()
                                .getNombreEstado()
                                .trim()
                                .toUpperCase();

                if (!EstadoConstants.ACTIVO.equals(estado)) {
                        String estadoUsuario = StateDefinition(estado);
                        throw new AccountDisabledException(
                                        estadoUsuario + " account: " + username);
                }

                List<UsuarioRol> rolesUsuario = usuarioRolRepository.findByUsuario(usuario);

                Set<SimpleGrantedAuthority> authorities = new HashSet<>();

                for (UsuarioRol ur : rolesUsuario) {

                        Rol rol = ur.getRol();

                        authorities.add(
                                        new SimpleGrantedAuthority(
                                                        "ROLE_" + rol.getNombre().trim().toUpperCase()));

                        List<RolPermiso> permisos = rolPermisoRepository.findByRol(rol);

                        for (RolPermiso rp : permisos) {
                                authorities.add(
                                                new SimpleGrantedAuthority(
                                                                rp.getPermiso().getNombre().trim().toUpperCase()));
                        }
                }

                return new SecurityUser(usuario, authorities);
        }

        public final class EstadoConstants {

                private EstadoConstants() {
                }

                public static final String ACTIVO = "ACTIVO";
                public static final String INACTIVO = "INACTIVO";
                public static final String BLOQUEADO = "BLOQUEADO";
        }

        public String StateDefinition(String estado) {
                estado = estado.trim().toUpperCase();
                switch (estado) {
                        case "ACTIVO":
                                return "ACTIVE";
                        case "INACTIVO":
                                return "INACTIVE";
                        case "BLOQUEADO":
                                return "LOCKED";
                        default:
                                return "UNKNOWN";
                }
        }
}