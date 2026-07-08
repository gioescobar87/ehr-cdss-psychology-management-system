package com.clinica.psicologia.system.repository.clinical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.ObjetivoTerapia;

public interface ObjetivoTerapiaRepository extends JpaRepository<ObjetivoTerapia, Integer> {

    List<ObjetivoTerapia> findByPlanTratamientoId(Integer planTratamientoId);

    boolean existsByPlanTratamientoIdAndDescripcionIgnoreCase(Integer planTratamientoId, String descripcion);

    boolean existsByPlanTratamientoIdAndDescripcionIgnoreCaseAndIdNot(Integer planTratamientoId, String descripcion,
            Integer id);
}