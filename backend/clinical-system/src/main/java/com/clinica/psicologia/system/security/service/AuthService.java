package com.clinica.psicologia.system.security.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.security.PasswordResetToken;
import com.clinica.psicologia.system.model.security.RefreshToken;
import com.clinica.psicologia.system.model.security.Rol;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.model.security.UsuarioRol;
import com.clinica.psicologia.system.repository.security.PasswordResetTokenRepository;
import com.clinica.psicologia.system.repository.security.RefreshTokenRepository;
import com.clinica.psicologia.system.repository.security.RolRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRolRepository;
import com.clinica.psicologia.system.security.dto.ChangePasswordRequest;
import com.clinica.psicologia.system.security.dto.ForgotPasswordRequest;
import com.clinica.psicologia.system.security.dto.ForgotPasswordResponse;
import com.clinica.psicologia.system.security.dto.LoginRequest;
import com.clinica.psicologia.system.security.dto.RegisterRequest;
import com.clinica.psicologia.system.security.dto.ResetPasswordRequest;
import com.clinica.psicologia.system.security.dto.UserProfileResponse;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.InvalidCredentialsException;
import com.clinica.psicologia.system.security.exception.custom.InvalidTokenException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;

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
        private final RefreshTokenRepository refreshTokenRepository;
        private final PasswordResetTokenRepository passwordResetTokenRepository;
        // private final JavaMailSender mailSender;

        public AuthService(AuthenticationManager authenticationManager, SecurityUserService userService,
                        JwtService jwtService, RefreshTokenService refreshTokenService,
                        UsuarioRepository usuarioRepository,
                        RolRepository rolRepository, UsuarioRolRepository usuarioRolRepository,
                        PasswordEncoder passwordEncoder,
                        RefreshTokenRepository refreshTokenRepository,
                        PasswordResetTokenRepository passwordResetTokenRepository
        // JavaMailSender mailSender
        ) {
                this.authenticationManager = authenticationManager;
                this.userService = userService;
                this.jwtService = jwtService;
                this.refreshTokenService = refreshTokenService;
                this.usuarioRepository = usuarioRepository;
                this.rolRepository = rolRepository;
                this.usuarioRolRepository = usuarioRolRepository;
                this.passwordEncoder = passwordEncoder;
                this.refreshTokenRepository = refreshTokenRepository;
                this.passwordResetTokenRepository = passwordResetTokenRepository;
                // this.mailSender = mailSender;
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
        public void register(RegisterRequest request) {
                if (usuarioRepository.existsByUsername(request.getUsername())) {
                        throw new DuplicateResourceException("Username already exists");
                }

                if (usuarioRepository.existsByCorreo(request.getCorreo())) {
                        throw new DuplicateResourceException(
                                        "Email already exists");
                }

                Usuario usuario = new Usuario();
                Estado estado = new Estado();
                estado.setId(1);
                usuario.setEstado(estado);
                usuario.setUsername(request.getUsername());
                usuario.setPassword(passwordEncoder.encode(request.getPassword()));
                usuario.setNombre(request.getNombre());
                usuario.setApellido(request.getApellido());
                usuario.setCorreo(request.getCorreo());

                Usuario usuarioGuardado = usuarioRepository.save(usuario);

                Rol rol = rolRepository.findByNombre(request.getRoleName()).orElseThrow();

                UsuarioRol usuarioRol = new UsuarioRol();
                usuarioRol.setUsuario(usuarioGuardado);
                usuarioRol.setRol(rol);

                usuarioRolRepository.save(usuarioRol);
        }

        @Transactional
        public void logout(String refreshToken) {
                RefreshToken token = refreshTokenRepository.findByToken(refreshToken)
                                .orElseThrow(() -> new InvalidTokenException(
                                                "Invalid refresh token"));

                refreshTokenRepository.delete(token);
        }

        public UserProfileResponse getCurrentUser(String username) {

                Usuario usuario = usuarioRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                List<String> roles = usuarioRolRepository.findByUsuario(usuario)
                                .stream()
                                .map(ur -> ur.getRol().getNombre())
                                .toList();

                UserProfileResponse response = new UserProfileResponse();

                response.setId(usuario.getId());
                response.setUsername(usuario.getUsername());
                response.setNombre(usuario.getNombre());
                response.setApellido(usuario.getApellido());
                response.setCorreo(usuario.getCorreo());
                response.setRoles(roles);

                return response;
        }

        @Transactional
        public void changePassword(
                        String username,
                        ChangePasswordRequest request) {

                Usuario usuario = usuarioRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                if (!passwordEncoder.matches(
                                request.getCurrentPassword(),
                                usuario.getPassword())) {

                        throw new InvalidCredentialsException(
                                        "Current password is incorrect");
                }

                usuario.setPassword(
                                passwordEncoder.encode(
                                                request.getNewPassword()));

                usuarioRepository.save(usuario);
                refreshTokenRepository.deleteByUsuario(usuario);
        }

        /*
         * @Transactional
         * public void forgotPassword(ForgotPasswordRequest request) {
         * 
         * Usuario usuario = usuarioRepository
         * .findByCorreo(request.getEmail())
         * .orElseThrow(() ->
         * new RuntimeException("User not found"));
         * 
         * passwordResetTokenRepository.deleteByUsuario(usuario);
         * 
         * PasswordResetToken token = new PasswordResetToken();
         * 
         * token.setUsuario(usuario);
         * token.setToken(UUID.randomUUID().toString());
         * 
         * token.setFechaExpiracion(
         * LocalDateTime.now().plusHours(1));
         * 
         * token.setUsado(false);
         * 
         * passwordResetTokenRepository.save(token);
         * 
         * // sendResetEmail(usuario, token.getToken());
         * 
         * System.out.println("PASSWORD RESET TOKEN: " + token.getToken());
         * }
         */

        /*
         * private void sendResetEmail(
         * Usuario usuario,
         * String token) {
         * 
         * String resetUrl =
         * "https://frontend-url/reset-password?token="
         * + token;
         * 
         * SimpleMailMessage message =
         * new SimpleMailMessage();
         * 
         * message.setTo(usuario.getCorreo());
         * 
         * message.setSubject(
         * "Restablecimiento de contraseña");
         * 
         * message.setText(
         * "Para restablecer su contraseña visite:\n\n"
         * + resetUrl);
         * 
         * mailSender.send(message);
         * }
         */

        @Transactional
        public void resetPassword(
                        ResetPasswordRequest request) {

                PasswordResetToken token = passwordResetTokenRepository
                                .findByToken(request.getToken())
                                .orElseThrow(() -> new InvalidTokenException(
                                                "Invalid token"));

                if (token.isUsado()) {
                        throw new InvalidTokenException(
                                        "Token already used");
                }

                if (token.getFechaExpiracion()
                                .isBefore(LocalDateTime.now())) {

                        throw new InvalidTokenException(
                                        "Token expired");
                }

                Usuario usuario = token.getUsuario();

                usuario.setPassword(
                                passwordEncoder.encode(
                                                request.getNewPassword()));

                usuarioRepository.save(usuario);

                refreshTokenRepository.deleteByUsuario(usuario);

                token.setUsado(true);

                passwordResetTokenRepository.save(token);
        }

        @Transactional
        public ForgotPasswordResponse forgotPassword(
                        ForgotPasswordRequest request) {

                Usuario usuario = usuarioRepository
                                .findByCorreo(request.getEmail())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                passwordResetTokenRepository.deleteByUsuario(usuario);

                PasswordResetToken token = new PasswordResetToken();

                token.setUsuario(usuario);
                token.setToken(UUID.randomUUID().toString());
                token.setFechaExpiracion(
                                LocalDateTime.now().plusHours(1));
                token.setUsado(false);

                passwordResetTokenRepository.save(token);

                return new ForgotPasswordResponse(
                                token.getToken());
        }

        @Transactional
        public void logoutAll(String username) {

                Usuario usuario = usuarioRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                refreshTokenRepository.deleteByUsuario(usuario);
        }
}
