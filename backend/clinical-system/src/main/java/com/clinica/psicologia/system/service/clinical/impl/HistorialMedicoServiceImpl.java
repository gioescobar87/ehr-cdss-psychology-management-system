package com.clinica.psicologia.system.service.clinical.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.HistorialMedicoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.HistorialMedicoResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.HistorialMedicoMapper;
import com.clinica.psicologia.system.model.catalog.CondicionMedica;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.clinical.HistorialMedico;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.repository.catalog.CondicionMedicaRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.clinical.HistorialMedicoRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.service.clinical.HistorialMedicoService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HistorialMedicoServiceImpl implements HistorialMedicoService {
    private final HistorialMedicoRepository historialMedicoRepository;
    private final PacienteRepository pacienteRepository;
    private final CondicionMedicaRepository condicionMedicaRepository;
    private final EstadoRepository estadoRepository;
    private final HistorialMedicoMapper historialMedicoMapper;

    //CREAR HISTORIAL MEDICO
    @Override
    public HistorialMedicoResponseDTO crear(HistorialMedicoRequestDTO dto){
        Paciente paciente = pacienteRepository.findById(dto.pacienteId())
            .orElseThrow(()->
                new RuntimeException(
                    "Paciente no encontrado: " + dto.pacienteId()
                )
        );

        CondicionMedica condicionMedica = condicionMedicaRepository.findById(dto.condicionMedicaId())
            .orElseThrow(()->
                new RuntimeException(
                    "Condicion médica no encontrada: " + dto.condicionMedicaId()
                )
        );

        Estado estadoActivo = estadoRepository.findById(1)
            .orElseThrow(()->
                new RuntimeException(
                    "Estado ACTIVO no encontrado"
                )
        );

        HistorialMedico historialMedico = historialMedicoMapper.toEntity(dto);

        historialMedico.setPaciente(paciente);
        historialMedico.setCondicionMedica(condicionMedica);
        historialMedico.setEstado(estadoActivo);

        historialMedico = historialMedicoRepository.save(historialMedico);

        return historialMedicoMapper.toResponse(historialMedico);
    }

    //OBTENER HISTORIAL POR PACIENTE
    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<HistorialMedicoResponseDTO> obtenerPorPaciente(Integer pacienteId){
        return historialMedicoRepository
            .findByPacienteId(pacienteId)
            .stream()
            .map(historialMedicoMapper::toResponse)
            .toList();
    }
}
