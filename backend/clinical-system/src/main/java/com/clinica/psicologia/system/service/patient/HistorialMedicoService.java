package com.clinica.psicologia.system.service.patient;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.model.clinical.HistorialMedico;
import com.clinica.psicologia.system.repository.patient.HistorialMedicoRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HistorialMedicoService {
    private final HistorialMedicoRepository repository;

    public HistorialMedico historialMedico(){
        throw new UnsupportedOperationException();
    }

    public HistorialMedico obtenerHistorialMedico(Long id){
        throw new UnsupportedOperationException();
    }
}
