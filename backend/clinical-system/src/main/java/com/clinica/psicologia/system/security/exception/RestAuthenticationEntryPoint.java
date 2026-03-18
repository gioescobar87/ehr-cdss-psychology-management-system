package com.clinica.psicologia.system.security.exception;

import jakarta.servlet.http.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String body = """
            {
              "status": 401,
              "error": "UNAUTHORIZED",
              "message": "Authentication required",
              "path": "%s"
            }
            """.formatted(request.getRequestURI());

        response.getWriter().write(body);
        response.getWriter().flush();
    }
}