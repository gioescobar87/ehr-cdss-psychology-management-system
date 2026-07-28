package com.clinica.psicologia.system.repository.expert_system;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.expert_system.ArbolDiagnostico;

public interface ArbolDiagnosticoRepository extends JpaRepository<ArbolDiagnostico, Integer> {

    List<ArbolDiagnostico> findByCategoriaDiagnosticaId(Integer categoriaDiagnosticaId);

    Optional<ArbolDiagnostico> findByCodigoArbolAndVersion(String codigoArbol, Integer version);

    boolean existsByCodigoArbolAndVersion(String codigoArbol, Integer version);

    boolean existsByCodigoArbolAndVersionAndIdNot(String codigoArbol, Integer version, Integer id);

    boolean existsByNombre(String nombre);

    boolean existsByNombreAndIdNot(String nombre, Integer id);

    Optional<ArbolDiagnostico> findFirstByCategoriaDiagnosticaIdAndEstadoNombreOrderByVersionDesc(
            Integer categoriaDiagnosticaId, String estado);

    boolean existsByCodigoArbolAndEstadoNombreAndIdNot(String codigoArbol, String estado, Integer id);

    List<ArbolDiagnostico> findByCodigoArbolAndEstadoId(String codigoArbol, Integer estadoId);
}