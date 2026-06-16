package com.clinica.psicologia.system.repository.security;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.security.Modulo;

public interface ModuloRepository extends JpaRepository<Modulo, Integer> {

    Optional<Modulo> findByNombre(String nombre);

    boolean existsByNombre(String nombre);

    boolean existsByNombreAndIdNot(String nombre, Integer id);
    
}
