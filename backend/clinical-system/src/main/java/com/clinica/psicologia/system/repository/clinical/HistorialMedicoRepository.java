package com.clinica.psicologia.system.repository.clinical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinica.psicologia.system.model.clinical.HistorialMedico;

@Repository
public interface HistorialMedicoRepository extends JpaRepository<HistorialMedico, Integer>{
    List<HistorialMedico> findByPacienteId(Integer pacienteId);

    List<HistorialMedico> findByPacienteIdAndEstadoId(Integer pacienteId,Integer estadoId);
}
