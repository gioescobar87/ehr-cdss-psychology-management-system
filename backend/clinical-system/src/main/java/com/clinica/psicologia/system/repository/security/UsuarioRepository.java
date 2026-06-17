package com.clinica.psicologia.system.repository.security;

import com.clinica.psicologia.system.model.security.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByCorreo(String correo);

    Optional<Usuario> findByCorreo(String correo);

    List<Usuario> findAllByOrderByNombreAsc();

    boolean existsByUsernameAndIdNot(String username, Integer id);

    boolean existsByCorreoAndIdNot(String correo, Integer id);

    @Query("""
        SELECT u
        FROM Usuario u
        JOIN FETCH u.estado
        WHERE u.username = :username
    """)
    Optional<Usuario> findByUsernameWithEstado(String username);
}