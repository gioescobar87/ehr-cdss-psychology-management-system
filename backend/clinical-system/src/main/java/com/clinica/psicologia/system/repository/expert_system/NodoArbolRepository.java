package com.clinica.psicologia.system.repository.expert_system;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.expert_system.NodoArbol;

public interface NodoArbolRepository extends JpaRepository<NodoArbol, Integer> {

    List<NodoArbol> findByArbolDiagnosticoIdOrderByOrden(Integer arbolDiagnosticoId);

    List<NodoArbol> findByNodoPadreIdOrderByOrden(Integer nodoPadreId);

    Optional<NodoArbol> findByArbolDiagnosticoIdAndNodoPadreIsNull(Integer arbolDiagnosticoId);
}