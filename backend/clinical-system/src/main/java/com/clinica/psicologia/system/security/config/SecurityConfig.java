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
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
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

        /*
         * @Bean
         * public PasswordEncoder passwordEncoder(){
         * return new BCryptPasswordEncoder();
         * }
         */

        @Bean
        public DaoAuthenticationProvider authenticationProvider() {

                DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userService);

                provider.setPasswordEncoder(passwordEncoder);

                return provider;
        }

        /*
         * //TEMPORALMENTE PERMITIRÁ ACCESO LIBRE
         * 
         * @Bean
         * public SecurityFilterChain filterChain(HttpSecurity http)
         * throws Exception {
         * 
         * http
         * .csrf(csrf -> csrf.disable())
         * .authorizeHttpRequests(auth ->
         * auth.anyRequest().permitAll()
         * );
         * 
         * return http.build();
         * }
         */

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
                                                .hasAuthority("USUARIO_READ")

                                                .requestMatchers(HttpMethod.GET, "/api/usuarios/*")
                                                .hasAuthority("USUARIO_READ")

                                                .requestMatchers(HttpMethod.GET, "/api/usuarios/*/roles")
                                                .hasAuthority("USUARIO_READ")

                                                // WRITE (CREATE + UPDATE + STATUS + ROLES ASSIGNMENT)
                                                .requestMatchers(HttpMethod.POST, "/api/usuarios")
                                                .hasAuthority("USUARIO_WRITE")

                                                .requestMatchers(HttpMethod.PUT, "/api/usuarios/*")
                                                .hasAuthority("USUARIO_WRITE")

                                                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/*/estado")
                                                .hasAuthority("USUARIO_WRITE")

                                                .requestMatchers(HttpMethod.POST, "/api/usuarios/*/roles")
                                                .hasAuthority("USUARIO_WRITE")

                                                // DELETE USER ONLY
                                                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/*")
                                                .hasAuthority("USUARIO_DELETE")

                                                // DELETE ROLE ASSIGNMENT
                                                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/*/roles/*")
                                                .hasAuthority("USUARIO_WRITE")

                                                // =========================
                                                // ROLE MANAGEMENT
                                                // =========================

                                                .requestMatchers(HttpMethod.GET, "/api/roles")
                                                .hasAuthority("ROL_READ")

                                                .requestMatchers(HttpMethod.GET, "/api/roles/*")
                                                .hasAuthority("ROL_READ")

                                                .requestMatchers(HttpMethod.POST, "/api/roles")
                                                .hasAuthority("ROL_WRITE")

                                                .requestMatchers(HttpMethod.PUT, "/api/roles/*")
                                                .hasAuthority("ROL_WRITE")

                                                .requestMatchers(HttpMethod.PATCH, "/api/roles/*/estado")
                                                .hasAuthority("ROL_WRITE")

                                                .requestMatchers(HttpMethod.DELETE, "/api/roles/*")
                                                .hasAuthority("ROL_DELETE")

                                                // =========================
                                                // PERMISSION MANAGEMENT
                                                // =========================

                                                // READ
                                                .requestMatchers(HttpMethod.GET, "/api/permisos")
                                                .hasAuthority("PERMISO_READ")

                                                .requestMatchers(HttpMethod.GET, "/api/permisos/*")
                                                .hasAuthority("PERMISO_READ")

                                                // CREATE
                                                .requestMatchers(HttpMethod.POST, "/api/permisos")
                                                .hasAuthority("PERMISO_WRITE")

                                                // UPDATE
                                                .requestMatchers(HttpMethod.PUT, "/api/permisos/*")
                                                .hasAuthority("PERMISO_WRITE")

                                                // DELETE
                                                .requestMatchers(HttpMethod.DELETE, "/api/permisos/*")
                                                .hasAuthority("PERMISO_DELETE")

                                                // ROLE-PERMISSION ASSIGNMENTS
                                                .requestMatchers(HttpMethod.GET, "/api/roles/*/permisos")
                                                .hasAuthority("PERMISO_READ")

                                                .requestMatchers(HttpMethod.POST, "/api/roles/*/permisos")
                                                .hasAuthority("PERMISO_WRITE")

                                                .requestMatchers(HttpMethod.DELETE, "/api/roles/*/permisos/*")
                                                .hasAuthority("PERMISO_DELETE")

                                                // =========================
                                                // ROLE-PERMISSION ASSIGNMENT
                                                // =========================

                                                // GET ROLE PERMISSIONS
                                                .requestMatchers(HttpMethod.GET, "/api/roles/*/permisos")
                                                .hasAuthority("ROL_READ")

                                                // ASSIGN PERMISSION
                                                .requestMatchers(HttpMethod.POST, "/api/roles/*/permisos")
                                                .hasAuthority("ROL_WRITE")

                                                // REMOVE PERMISSION
                                                .requestMatchers(HttpMethod.DELETE, "/api/roles/*/permisos/*")
                                                .hasAuthority("ROL_WRITE")

                                                // =========================
                                                // MODULE MANAGEMENT
                                                // =========================

                                                .requestMatchers(HttpMethod.GET, "/api/modulos/**")
                                                .hasAuthority("MODULO_READ")

                                                .requestMatchers(HttpMethod.POST, "/api/modulos/**")
                                                .hasAuthority("MODULO_WRITE")

                                                .requestMatchers(HttpMethod.PUT, "/api/modulos/**")
                                                .hasAuthority("MODULO_WRITE")

                                                .requestMatchers(HttpMethod.PATCH, "/api/modulos/**")
                                                .hasAuthority("MODULO_WRITE")

                                                .requestMatchers(HttpMethod.DELETE, "/api/modulos/**")
                                                .hasAuthority("MODULO_DELETE")

                                                // =========================
                                                // OPTION MANAGEMENT
                                                // =========================

                                                // READ
                                                .requestMatchers(HttpMethod.GET, "/api/opciones")
                                                .hasAuthority("OPCION_READ")

                                                .requestMatchers(HttpMethod.GET, "/api/opciones/tree")
                                                .hasAuthority("OPCION_READ")

                                                .requestMatchers(HttpMethod.GET, "/api/opciones/*")
                                                .hasAuthority("OPCION_READ")

                                                .requestMatchers(HttpMethod.GET, "/api/opciones/modulo/*")
                                                .hasAuthority("OPCION_READ")

                                                .requestMatchers(HttpMethod.GET, "/api/opciones/*/hijas")
                                                .hasAuthority("OPCION_READ")

                                                // CREATE
                                                .requestMatchers(HttpMethod.POST, "/api/opciones")
                                                .hasAuthority("OPCION_WRITE")

                                                // UPDATE
                                                .requestMatchers(HttpMethod.PUT, "/api/opciones/*")
                                                .hasAuthority("OPCION_WRITE")

                                                .requestMatchers(HttpMethod.PATCH, "/api/opciones/*/estado")
                                                .hasAuthority("OPCION_WRITE")

                                                // DELETE
                                                .requestMatchers(HttpMethod.DELETE, "/api/opciones/*")
                                                .hasAuthority("OPCION_DELETE")

                                                // =========================
                                                // PATIENT MODULE
                                                // =========================
                                                .requestMatchers(HttpMethod.GET, "/api/pacientes/**")
                                                .hasAuthority("PACIENTE_READ")

                                                .requestMatchers(HttpMethod.POST, "/api/pacientes/**")
                                                .hasAuthority("PACIENTE_WRITE")

                                                .requestMatchers(HttpMethod.PUT, "/api/pacientes/**")
                                                .hasAuthority("PACIENTE_WRITE")

                                                .requestMatchers(HttpMethod.PUT, "/api/pacientes/reasignar/**")
                                                .hasAuthority("PACIENTE_REASIGNAR")

                                                // =========================
                                                // MEDICAL HISTORY
                                                // =========================
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/api/historial-medico/**")
                                                .hasAuthority("PACIENTE_READ")

                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/api/historial-medico/**")
                                                .hasAuthority("PACIENTE_WRITE")

                                                // =========================
                                                // CLINICAL SESSIONS
                                                // =========================
                                                .requestMatchers(HttpMethod.GET, "/api/sesiones/**")
                                                .hasAuthority("SESION_READ")

                                                .requestMatchers(HttpMethod.POST, "/api/sesiones/**")
                                                .hasAuthority("SESION_WRITE")

                                                // =========================
                                                // APPOINTMENTS
                                                // =========================
                                                .requestMatchers(HttpMethod.GET, "/api/citas/**")
                                                .hasAuthority("CITA_READ")

                                                .requestMatchers(HttpMethod.POST, "/api/citas/**")
                                                .hasAuthority("CITA_WRITE")

                                                // =========================
                                                // CDSS DIAGNOSTIC ENGINE
                                                // =========================
                                                .requestMatchers("/api/diagnostico/ejecutar/**")
                                                .hasAuthority("DIAGNOSTICO_EXECUTE")

                                                .requestMatchers("/api/diagnostico/validar/**")
                                                .hasAuthority("DIAGNOSTICO_VALIDAR")

                                                // =========================
                                                // REPORTS
                                                // =========================
                                                .requestMatchers("/api/reportes/**")
                                                .hasAuthority("REPORTE_READ")

                                                // =========================
                                                // AUDIT LOG
                                                // =========================
                                                .requestMatchers("/api/bitacora/**")
                                                .hasAuthority("BITACORA_READ")

                                                // =========================
                                                // CATALOG MANAGEMENT
                                                // =========================
                                                .requestMatchers(HttpMethod.GET, "/api/catalogos/**")
                                                .hasAuthority("CATALOGO_READ")

                                                .requestMatchers(HttpMethod.POST, "/api/catalogos/**")
                                                .hasAuthority("CATALOGO_WRITE")

                                                // =========================
                                                // ADMIN OVERRIDE
                                                // =========================
                                                .requestMatchers("/api/admin/**")
                                                .hasAuthority("ADMIN_FULL")

                                                // =========================
                                                // FALLBACK
                                                // =========================
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
}