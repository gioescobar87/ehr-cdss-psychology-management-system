package com.clinica.psicologia.system.repository.expert_system;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.expert_system.NodoArbol;

public interface NodoArbolRepository extends JpaRepository<NodoArbol, Integer> {

    List<NodoArbol> findByArbolDiagnosticoIdOrderByOrden(Integer arbolId);

    List<NodoArbol> findByNodoPadreIdOrderByOrden(Integer nodoPadreId);

    boolean existsByArbolDiagnosticoIdAndNodoPadreIsNull(Integer arbolId);

    boolean existsByNodoPadreIdAndOrden(Integer nodoPadreId, Integer orden);

    boolean existsByNodoPadreIdAndOrdenAndIdNot(Integer nodoPadreId, Integer orden, Integer id);

    boolean existsByNodoPadreId(Integer nodoPadreId);

    Optional<NodoArbol> findFirstByArbolDiagnosticoIdAndNodoPadreIsNull(Integer arbolId);
}