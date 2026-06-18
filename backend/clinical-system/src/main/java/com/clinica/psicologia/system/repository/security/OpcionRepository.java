package com.clinica.psicologia.system.repository.security;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.security.Opcion;

public interface OpcionRepository extends JpaRepository<Opcion, Integer> {
    List<Opcion> findByModuloId(Integer moduloId);

    List<Opcion> findByOpcionPadreId(Integer opcionPadreId);

    boolean existsByOpcionPadreId(Integer opcionPadreId);

    boolean existsByNombre(String nombre);

    boolean existsByNombreAndIdNot(String nombre, Integer id);

    List<Opcion> findByEstadoId(Integer estadoId);
}
