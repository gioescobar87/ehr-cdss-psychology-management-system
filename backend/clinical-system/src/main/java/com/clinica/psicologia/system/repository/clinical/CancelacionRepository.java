package com.clinica.psicologia.system.repository.clinical;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.Cancelacion;

public interface CancelacionRepository
        extends JpaRepository<Cancelacion, Integer> {

    Optional<Cancelacion> findByCitaId(Integer citaId);

    boolean existsByCitaId(Integer citaId);

}