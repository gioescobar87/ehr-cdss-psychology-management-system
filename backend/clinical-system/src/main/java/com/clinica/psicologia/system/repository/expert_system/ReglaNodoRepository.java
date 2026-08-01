package com.clinica.psicologia.system.repository.expert_system;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.expert_system.ReglaNodo;

public interface ReglaNodoRepository extends JpaRepository<ReglaNodo, Integer> {

    List<ReglaNodo> findByNodoOrigenId(Integer nodoOrigenId);

    List<ReglaNodo> findByNodoOrigenArbolDiagnosticoId(Integer arbolDiagnosticoId);

    boolean existsByNodoOrigenIdAndCriterioClinicoId(Integer nodoOrigenId, Integer criterioClinicoId);

    List<ReglaNodo> findByNodoOrigenIdAndEstadoId(Integer nodoOrigenId, Integer estadoId);

    List<ReglaNodo> findByNodoOrigenIdAndEstadoNombre(Integer nodoOrigenId, String estado);
}