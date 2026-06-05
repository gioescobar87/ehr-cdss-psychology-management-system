package com.clinica.psicologia.system.security.filter;

import com.clinica.psicologia.system.security.service.JwtService;
import com.clinica.psicologia.system.security.service.SecurityUserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final SecurityUserService userService;

    public JwtFilter(
            JwtService jwtService,
            SecurityUserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        return path.startsWith("/auth")
                || path.startsWith("/dev")
                || path.startsWith("/error");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        //System.out.println("//////////////////////////////////////////////////////////////////////// AUTH HEADER: " + header);

        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {

            String username = jwtService.extractUsername(token);
            var user = userService.loadUserByUsername(username);
            //System.out.println("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX AUTHORITIES -> " + user.getAuthorities());
            if (!jwtService.isTokenValid(token, user)) {

                unauthorized(response,
                        "INVALID_OR_EXPIRED_TOKEN",
                        "JWT token invalid or expired");

                return;
            }

            if (SecurityContextHolder.getContext()
                    .getAuthentication() == null) {

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities());

                SecurityContextHolder.getContext()
                        .setAuthentication(auth);
            }

        } catch (Exception ex) {
            System.out.println("EXCEPCIÓN: " + ex);
            unauthorized(response,
                    "INVALID_TOKEN",
                    "JWT token invalid");

            return;
        }

        chain.doFilter(request, response);
    }

    private void unauthorized(
            HttpServletResponse response,
            String error,
            String message) throws IOException {

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        response.getWriter().write(
                """
                        {
                          "status":401,
                          "error":"%s",
                          "message":"%s"
                        }
                        """.formatted(error, message));

        response.getWriter().flush();
    }
}