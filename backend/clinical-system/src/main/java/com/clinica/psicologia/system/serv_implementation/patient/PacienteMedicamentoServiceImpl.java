package com.clinica.psicologia.system.serv_implementation.patient;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.patient.PacienteMedicamentoRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteMedicamentoResponseDTO;
import com.clinica.psicologia.system.mapper.patient.PacienteMedicamentoMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.Medicamento;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.patient.PacienteMedicamento;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.MedicamentoRepository;
import com.clinica.psicologia.system.repository.patient.PacienteMedicamentoRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.patient.PacienteMedicamentoService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteMedicamentoServiceImpl
        implements PacienteMedicamentoService {

    private final PacienteMedicamentoRepository repository;
    private final PacienteRepository pacienteRepository;
    private final MedicamentoRepository medicamentoRepository;
    private final EstadoRepository estadoRepository;
    private final PacienteMedicamentoMapper mapper;

    @Override
    public PacienteMedicamentoResponseDTO create(
            PacienteMedicamentoRequestDTO dto) {

        Paciente paciente = pacienteRepository
                .findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Paciente no encontrado: " + dto.getPacienteId()));

        Medicamento medicamento = medicamentoRepository
                .findById(dto.getMedicamentoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medicamento no encontrado: " + dto.getMedicamentoId()));

        Estado estadoActivo = estadoRepository
                .findById(1)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Estado ACTIVO no encontrado"));

        PacienteMedicamento entity = new PacienteMedicamento();

        entity.setPaciente(paciente);
        entity.setMedicamento(medicamento);

        mapper.updateEntity(entity, dto);

        entity.setEstado(estadoActivo);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PacienteMedicamentoResponseDTO> findAll() {

        return mapper.toResponseDTOList(
                repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public PacienteMedicamentoResponseDTO findById(
            Integer id) {

        PacienteMedicamento entity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medicamento del paciente no encontrado: " + id));

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PacienteMedicamentoResponseDTO> getByPatient(
            Integer pacienteId) {

        return mapper.toResponseDTOList(
                repository.findByPacienteId(pacienteId));
    }

    @Override
    public PacienteMedicamentoResponseDTO update(
            Integer id,
            PacienteMedicamentoRequestDTO dto) {

        PacienteMedicamento entity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medicamento del paciente no encontrado: " + id));

        Medicamento medicamento = medicamentoRepository
                .findById(dto.getMedicamentoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medicamento no encontrado: " + dto.getMedicamentoId()));

        entity.setMedicamento(medicamento);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void changeStatus(
            Integer id,
            Integer estadoId) {

        PacienteMedicamento entity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medicamento del paciente no encontrado"));

        Estado estado = estadoRepository
                .findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Estado no encontrado"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(
            Integer id) {

        PacienteMedicamento entity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medicamento del paciente no encontrado"));

        repository.delete(entity);
    }
}