package com.clinica.psicologia.system.repository.clinical;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.PacienteDiagnostico;

public interface PacienteDiagnosticoRepository
        extends JpaRepository<PacienteDiagnostico, Integer> {

    List<PacienteDiagnostico> findByPacienteId(
            Integer pacienteId);

        Optional<PacienteDiagnostico> findBySesionIdAndDiagnosticoId(Integer sesionId, Integer diagnosticoId);
}