package com.clinica.psicologia.system.security.config;

import com.clinica.psicologia.system.security.exception.RestAccessDeniedHandler;
import com.clinica.psicologia.system.security.exception.RestAuthenticationEntryPoint;
import com.clinica.psicologia.system.security.filter.JwtFilter;
import com.clinica.psicologia.system.security.service.SecurityUserService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

        private final JwtFilter jwtFilter;
        private final SecurityUserService userService;
        private final PasswordEncoder passwordEncoder;

        private final RestAuthenticationEntryPoint authenticationEntryPoint;
        private final RestAccessDeniedHandler accessDeniedHandler;

        public SecurityConfig(
                        JwtFilter jwtFilter,
                        SecurityUserService userService,
                        PasswordEncoder passwordEncoder,
                        RestAuthenticationEntryPoint authenticationEntryPoint,
                        RestAccessDeniedHandler accessDeniedHandler) {
                this.jwtFilter = jwtFilter;
                this.userService = userService;
                this.passwordEncoder = passwordEncoder;
                this.authenticationEntryPoint = authenticationEntryPoint;
                this.accessDeniedHandler = accessDeniedHandler;
        }

        @Bean
        public DaoAuthenticationProvider authenticationProvider() {

                DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userService);

                provider.setPasswordEncoder(passwordEncoder);

                return provider;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> {
                                })
                                .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint)
                                                .accessDeniedHandler(accessDeniedHandler))
                                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth

                                                // =========================
                                                // PUBLIC AUTH ENDPOINTS
                                                // =========================
                                                .requestMatchers(
                                                                "/api/auth/login",
                                                                "/api/auth/register",
                                                                "/api/auth/refresh-token",
                                                                "/api/auth/forgot-password",
                                                                "/api/auth/reset-password",
                                                                "/actuator/mappings")
                                                .permitAll()

                                                // =========================
                                                // USER MANAGEMENT
                                                // =========================

                                                // READ
                                                .requestMatchers(HttpMethod.GET, "/api/usuarios")
                                                .access(hasPermission("USUARIO_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/usuarios/*")
                                                .access(hasPermission("USUARIO_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/usuarios/*/roles")
                                                .access(hasPermission("USUARIO_READ"))

                                                // WRITE (CREATE + UPDATE + STATUS + ROLES ASSIGNMENT)
                                                .requestMatchers(HttpMethod.POST, "/api/usuarios")
                                                .access(hasPermission("USUARIO_WRITE"))

                                                .requestMatchers(HttpMethod.PUT, "/api/usuarios/*")
                                                .access(hasPermission("USUARIO_WRITE"))

                                                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/*/estado")
                                                .access(hasPermission("USUARIO_WRITE"))

                                                .requestMatchers(HttpMethod.POST, "/api/usuarios/*/roles")
                                                .access(hasPermission("USUARIO_WRITE"))

                                                // DELETE USER ONLY
                                                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/*")
                                                .access(hasPermission("USUARIO_DELETE"))

                                                // DELETE ROLE ASSIGNMENT
                                                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/*/roles/*")
                                                .access(hasPermission("USUARIO_WRITE"))

                                                .requestMatchers(HttpMethod.GET, "/api/usuarios/*/cita")
                                                .access(hasPermission("USUARIO_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/usuarios/*/sesion")
                                                .access(hasPermission("USUARIO_READ"))

                                                // =========================
                                                // ROLE MANAGEMENT
                                                // =========================

                                                .requestMatchers(HttpMethod.GET, "/api/roles")
                                                .access(hasPermission("ROL_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/roles/*")
                                                .access(hasPermission("ROL_READ"))

                                                .requestMatchers(HttpMethod.POST, "/api/roles")
                                                .access(hasPermission("ROL_WRITE"))

                                                .requestMatchers(HttpMethod.PUT, "/api/roles/*")
                                                .access(hasPermission("ROL_WRITE"))

                                                .requestMatchers(HttpMethod.PATCH, "/api/roles/*/estado")
                                                .access(hasPermission("ROL_WRITE"))

                                                .requestMatchers(HttpMethod.DELETE, "/api/roles/*")
                                                .access(hasPermission("ROL_DELETE"))

                                                // =========================
                                                // PERMISSION MANAGEMENT
                                                // =========================

                                                // READ
                                                .requestMatchers(HttpMethod.GET, "/api/permisos")
                                                .access(hasPermission("PERMISO_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/permisos/*")
                                                .access(hasPermission("PERMISO_READ"))

                                                // CREATE
                                                .requestMatchers(HttpMethod.POST, "/api/permisos")
                                                .access(hasPermission("PERMISO_WRITE"))

                                                // UPDATE
                                                .requestMatchers(HttpMethod.PUT, "/api/permisos/*")
                                                .access(hasPermission("PERMISO_WRITE"))

                                                // DELETE
                                                .requestMatchers(HttpMethod.DELETE, "/api/permisos/*")
                                                .access(hasPermission("PERMISO_DELETE"))

                                                // =========================
                                                // ROLE-PERMISSION ASSIGNMENT
                                                // =========================

                                                // GET ROLE PERMISSIONS
                                                .requestMatchers(HttpMethod.GET, "/api/roles/*/permisos")
                                                .access(hasPermission("ROL_READ"))

                                                // ASSIGN PERMISSION
                                                .requestMatchers(HttpMethod.POST, "/api/roles/*/permisos")
                                                .access(hasPermission("ROL_WRITE"))

                                                // REMOVE PERMISSION
                                                .requestMatchers(HttpMethod.DELETE, "/api/roles/*/permisos/*")
                                                .access(hasPermission("ROL_WRITE"))

                                                // =========================
                                                // MODULE MANAGEMENT
                                                // =========================

                                                .requestMatchers(HttpMethod.GET, "/api/modulos/**")
                                                .access(hasPermission("MODULO_READ"))

                                                .requestMatchers(HttpMethod.POST, "/api/modulos/**")
                                                .access(hasPermission("MODULO_WRITE"))

                                                .requestMatchers(HttpMethod.PUT, "/api/modulos/**")
                                                .access(hasPermission("MODULO_WRITE"))

                                                .requestMatchers(HttpMethod.PATCH, "/api/modulos/**")
                                                .access(hasPermission("MODULO_WRITE"))

                                                .requestMatchers(HttpMethod.DELETE, "/api/modulos/**")
                                                .access(hasPermission("MODULO_DELETE"))

                                                // =========================
                                                // OPTION MANAGEMENT
                                                // =========================

                                                // READ
                                                .requestMatchers(HttpMethod.GET, "/api/opciones")
                                                .access(hasPermission("OPCION_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/opciones/tree")
                                                .access(hasPermission("OPCION_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/opciones/*")
                                                .access(hasPermission("OPCION_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/opciones/modulo/*")
                                                .access(hasPermission("OPCION_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/opciones/*/hijas")
                                                .access(hasPermission("OPCION_READ"))

                                                // CREATE
                                                .requestMatchers(HttpMethod.POST, "/api/opciones")
                                                .access(hasPermission("OPCION_WRITE"))

                                                // UPDATE
                                                .requestMatchers(HttpMethod.PUT, "/api/opciones/*")
                                                .access(hasPermission("OPCION_WRITE"))

                                                .requestMatchers(HttpMethod.PATCH, "/api/opciones/*/estado")
                                                .access(hasPermission("OPCION_WRITE"))

                                                // DELETE
                                                .requestMatchers(HttpMethod.DELETE, "/api/opciones/*")
                                                .access(hasPermission("OPCION_DELETE"))

                                                // =========================
                                                // ROLE OPTION ASSIGNMENT
                                                // =========================

                                                .requestMatchers(HttpMethod.GET, "/api/roles/*/opciones")
                                                .access(hasPermission("ROL_READ"))

                                                .requestMatchers(HttpMethod.POST, "/api/roles/*/opciones")
                                                .access(hasPermission("ROL_WRITE"))

                                                .requestMatchers(HttpMethod.DELETE, "/api/roles/*/opciones/*")
                                                .access(hasPermission("ROL_WRITE"))

                                                // =========================
                                                // PATIENT MODULE
                                                // =========================
                                                .requestMatchers(HttpMethod.POST, "/api/paciente/*/asignar")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                .requestMatchers(HttpMethod.POST, "/api/paciente/*/reasignar")
                                                .access(hasPermission("PACIENTE_REASIGNAR"))

                                                .requestMatchers(HttpMethod.GET, "/api/paciente/*/asignaciones")
                                                .access(hasPermission("PACIENTE_READ"))

                                                .requestMatchers(HttpMethod.DELETE, "/api/paciente/*/asignaciones")
                                                .access(hasPermission("PACIENTE_DELETE"))

                                                .requestMatchers(HttpMethod.GET, "/api/paciente/*/alergia")
                                                .access(hasPermission("PACIENTE_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/paciente/*/cita")
                                                .access(hasPermission("PACIENTE_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/paciente/*/sesion")
                                                .access(hasPermission("PACIENTE_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/paciente/*/medicamento")
                                                .access(hasPermission("PACIENTE_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/paciente/**")
                                                .access(hasPermission("PACIENTE_READ"))

                                                .requestMatchers(HttpMethod.POST, "/api/paciente/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                .requestMatchers(HttpMethod.PUT, "/api/paciente/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                // =========================
                                                // EMERGENCY CONTACTS
                                                // ========================= "/api/contacto-emergencia"

                                                .requestMatchers(HttpMethod.GET, "/api/contacto-emergencia/**")
                                                .access(hasPermission("PACIENTE_READ"))

                                                .requestMatchers(HttpMethod.POST, "/api/contacto-emergencia/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                .requestMatchers(HttpMethod.PUT, "/api/contacto-emergencia/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                .requestMatchers(HttpMethod.PATCH, "/api/contacto-emergencia/*/estado")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                .requestMatchers(HttpMethod.DELETE, "/api/contacto-emergencia/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                // =========================
                                                // PACIENTE ALERGIAS
                                                // =========================
                                                .requestMatchers(HttpMethod.GET, "/api/paciente-alergia/**")
                                                .access(hasPermission("PACIENTE_READ"))

                                                .requestMatchers(HttpMethod.POST, "/api/paciente-alergia/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                .requestMatchers(HttpMethod.PUT, "/api/paciente-alergia/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                .requestMatchers(HttpMethod.PATCH, "/api/paciente-alergia/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                .requestMatchers(HttpMethod.DELETE, "/api/paciente-alergia/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                // =========================
                                                // PACIENTE MEDICAMENTOS
                                                // =========================
                                                .requestMatchers(HttpMethod.GET, "/api/paciente-medicamentos/**")
                                                .access(hasPermission("PACIENTE_READ"))

                                                .requestMatchers(HttpMethod.POST, "/api/paciente-medicamentos/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                .requestMatchers(HttpMethod.PUT, "/api/paciente-medicamentos/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                .requestMatchers(HttpMethod.PATCH, "/api/paciente-medicamentos/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                .requestMatchers(HttpMethod.DELETE, "/api/paciente-medicamentos/**")
                                                .access(hasPermission("PACIENTE_WRITE"))

                                                // =========================
                                                // APPOINTMENTS
                                                // =========================
                                                .requestMatchers(HttpMethod.POST, "/api/cita/*/cancelar")
                                                .access(hasPermission("CITA_WRITE"))

                                                .requestMatchers(HttpMethod.GET, "/api/cita/*/cancelacion")
                                                .access(hasPermission("CITA_READ"))
                                                
                                                .requestMatchers(HttpMethod.GET, "/api/cita/**")
                                                .access(hasPermission("CITA_READ"))

                                                .requestMatchers(HttpMethod.POST, "/api/cita/**")
                                                .access(hasPermission("CITA_WRITE"))

                                                .requestMatchers(HttpMethod.PUT, "/api/cita/**")
                                                .access(hasPermission("CITA_WRITE"))

                                                .requestMatchers(HttpMethod.PATCH, "/api/cita/**")
                                                .access(hasPermission("CITA_WRITE"))

                                                .requestMatchers(HttpMethod.DELETE, "/api/cita/**")
                                                .access(hasPermission("CITA_DELETE"))

                                                // =========================
                                                // INTERVENTION
                                                // =========================
                                                .requestMatchers(HttpMethod.POST, "/api/intervencion")
                                                .access(hasPermission("SESION_WRITE"))

                                                .requestMatchers(HttpMethod.GET, "/api/intervencion")
                                                .access(hasPermission("SESION_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/intervencion/*")
                                                .access(hasPermission("SESION_READ"))

                                                .requestMatchers(HttpMethod.PUT, "/api/intervencion/*")
                                                .access(hasPermission("SESION_WRITE"))

                                                .requestMatchers(HttpMethod.PATCH, "/api/intervencion/*/estado")
                                                .access(hasPermission("SESION_WRITE"))

                                                .requestMatchers(HttpMethod.DELETE, "/api/intervencion/*")
                                                .access(hasPermission("SESION_WRITE"))

                                                // =========================
                                                // CLINICAL SESSIONS
                                                // =========================
                                                .requestMatchers(HttpMethod.POST, "/api/sesion")
                                                .access(hasPermission("SESION_WRITE"))

                                                .requestMatchers(HttpMethod.GET, "/api/sesion")
                                                .access(hasPermission("SESION_READ"))

                                                .requestMatchers(HttpMethod.GET, "/api/sesion/*")
                                                .access(hasPermission("SESION_READ"))

                                                .requestMatchers(HttpMethod.PUT, "/api/sesion/*")
                                                .access(hasPermission("SESION_WRITE"))

                                                .requestMatchers(HttpMethod.DELETE, "/api/sesion/*")
                                                .access(hasPermission("SESION_WRITE"))

                                                // =========================
                                                // MEDICAL HISTORY
                                                // =========================
                                                .requestMatchers(HttpMethod.GET, "/api/api/historial-medico/**")
                                                .access(hasPermission("PACIENTE_READ"))

                                                .requestMatchers(HttpMethod.POST, "/api/api/historial-medico/**")
                                                .access(hasPermission("PACIENTE_WRITE"))
                                                
                                                // =========================
                                                // CDSS DIAGNOSTIC ENGINE
                                                // =========================
                                                .requestMatchers("/api/diagnostico/ejecutar/**")
                                                .access(hasPermission("DIAGNOSTICO_EXECUTE"))

                                                .requestMatchers("/api/diagnostico/validar/**")
                                                .access(hasPermission("DIAGNOSTICO_VALIDAR"))

                                                // =========================
                                                // REPORTS
                                                // =========================
                                                .requestMatchers("/api/reportes/**")
                                                .access(hasPermission("REPORTE_READ"))

                                                // =========================
                                                // AUDIT LOG
                                                // =========================
                                                .requestMatchers("/api/bitacora/**")
                                                .access(hasPermission("BITACORA_READ"))

                                                // =========================
                                                // CATALOG MANAGEMENT
                                                // =========================
                                                .requestMatchers(HttpMethod.GET, "/api/catalogos/**")
                                                .access(hasPermission("CATALOGO_READ"))

                                                .requestMatchers(HttpMethod.POST, "/api/catalogos/**")
                                                .access(hasPermission("CATALOGO_WRITE"))

                                                .requestMatchers(HttpMethod.PUT, "/api/catalogos/**")
                                                .access(hasPermission("CATALOGO_WRITE"))

                                                .requestMatchers(HttpMethod.PATCH, "/api/catalogos/**")
                                                .access(hasPermission("CATALOGO_WRITE"))

                                                .requestMatchers(HttpMethod.DELETE, "/api/catalogos/**")
                                                .access(hasPermission("CATALOGO_WRITE"))

                                                // =========================
                                                // ADMIN OVERRIDE
                                                // =========================
                                                .requestMatchers("/api/admin/**")
                                                .access(hasPermission("ADMIN_FULL"))

                                                // =========================
                                                // FALLBACK
                                                // =========================
                                                .requestMatchers("/error").permitAll()
                                                .anyRequest().authenticated())
                                .authenticationProvider(authenticationProvider())
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        private AuthorizationManager<RequestAuthorizationContext> hasPermission(String permission) {

                return (authentication, context) -> {

                        boolean granted = authentication.get()
                                        .getAuthorities()
                                        .stream()
                                        .anyMatch(a -> a.getAuthority().equals("ADMIN_FULL")
                                                        || a.getAuthority().equals(permission));

                        return new AuthorizationDecision(granted);
                };
        }
}