package com.clinica.psicologia.system.repository.catalog;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.catalog.Estado;

public interface EstadoRepository extends JpaRepository<Estado,Integer> {
    Optional<Estado> findById(Integer id);

    Optional<Estado> getByNombre(String nombre);

    boolean existsByNombre(String nombre);

    boolean existsByNombreAndIdNot(
            String nombre,
            Integer id);
}
