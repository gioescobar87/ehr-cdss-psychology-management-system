package com.clinica.psicologia.system.security.config;

import com.clinica.psicologia.system.security.exception.RestAccessDeniedHandler;
import com.clinica.psicologia.system.security.exception.RestAuthenticationEntryPoint;
import com.clinica.psicologia.system.security.filter.JwtFilter;
import com.clinica.psicologia.system.security.service.SecurityUserService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
                                                .anyRequest().permitAll())
                                                /* .requestMatchers(
                                                                "/auth/login",
                                                                "/auth/register",
                                                                "/auth/refresh",
                                                                "/dev/**")
                                                .permitAll()
                                                .anyRequest().authenticated()) */
                                .authenticationProvider(authenticationProvider())
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        /*
         * @Bean
         * public SecurityFilterChain filterChain(
         * org.springframework.security.config.annotation.web.builders.HttpSecurity http
         * ) throws Exception {
         * 
         * http
         * .csrf(csrf -> csrf.disable())
         * .sessionManagement(sm ->
         * sm.sessionCreationPolicy(
         * SessionCreationPolicy.STATELESS
         * )
         * )
         * .authorizeHttpRequests(auth -> auth
         * .requestMatchers("/auth/**").permitAll()
         * .anyRequest().authenticated()
         * )
         * .formLogin(form -> form.disable())
         * .httpBasic(basic -> basic.disable())
         * .addFilterBefore(
         * jwtFilter,
         * org.springframework.security.web.authentication.
         * UsernamePasswordAuthenticationFilter.class
         * );
         * 
         * return http.build();
         * }
         */
        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }
}