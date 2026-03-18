package com.clinica.psicologia.system.security.exception;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException{
        response.setContentType("application/json");
        response.setStatus((HttpServletResponse.SC_FORBIDDEN));

        String body = """
                {
                    "status": 403,
                    "error": "FORBIDDEN",
                    "message": "Access denied",
                    "path": "%s"
                }
                """.formatted(request.getRequestURI());

        response.getWriter().write(body);
        response.getWriter().flush();
    }
}
