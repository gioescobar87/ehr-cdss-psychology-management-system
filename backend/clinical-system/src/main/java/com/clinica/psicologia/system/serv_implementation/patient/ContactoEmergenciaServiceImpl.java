package com.clinica.psicologia.system.serv_implementation.patient;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.patient.ContactoEmergenciaRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.ContactoEmergenciaResponseDTO;
import com.clinica.psicologia.system.mapper.patient.ContactoEmergenciaMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.Parentesco;
import com.clinica.psicologia.system.model.patient.ContactoEmergencia;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.ParentescoRepository;
import com.clinica.psicologia.system.repository.patient.ContactoEmergenciaRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.patient.ContactoEmergenciaService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ContactoEmergenciaServiceImpl
        implements ContactoEmergenciaService {

    private final ContactoEmergenciaRepository repository;
    private final PacienteRepository pacienteRepository;
    private final ParentescoRepository parentescoRepository;
    private final EstadoRepository estadoRepository;
    private final ContactoEmergenciaMapper mapper;

    @Override
    public ContactoEmergenciaResponseDTO create(
            ContactoEmergenciaRequestDTO dto) {

        Paciente paciente = pacienteRepository
                .findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado: " + dto.getPacienteId()));

        Parentesco parentesco = parentescoRepository
                .findById(dto.getParentescoId())
                .orElseThrow(() -> new ResourceNotFoundException("Parentesco no encontrado: " + dto.getParentescoId()));

        Estado estadoActivo = estadoRepository
                .findById(1)
                .orElseThrow(() -> new ResourceNotFoundException("Estado ACTIVO no encontrado"));

        ContactoEmergencia entity = new ContactoEmergencia();

        entity.setPaciente(paciente);
        entity.setParentesco(parentesco);
        entity.setNombre(dto.getNombre());
        entity.setTelefono(dto.getTelefono());
        entity.setDireccion(dto.getDireccion());
        entity.setObservaciones(dto.getObservaciones());
        entity.setEstado(estadoActivo);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ContactoEmergenciaResponseDTO> findAll() {

        return mapper.toResponseDTOList(
                repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public ContactoEmergenciaResponseDTO findById(
            Integer id) {

        ContactoEmergencia entity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contacto de emergencia no encontrado: " + id));

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ContactoEmergenciaResponseDTO> getByPatient(
            Integer pacienteId) {

        return mapper.toResponseDTOList(
                repository.findByPacienteId(pacienteId));
    }

    @Override
    public ContactoEmergenciaResponseDTO update(
            Integer id,
            ContactoEmergenciaRequestDTO dto) {

        ContactoEmergencia entity = repository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contacto de emergencia no encontrado: " + id));

        Parentesco parentesco = parentescoRepository
                .findById(dto.getParentescoId())
                .orElseThrow(() -> new ResourceNotFoundException("Parentesco no encontrado: " + dto.getParentescoId()));

        entity.setNombre(dto.getNombre());
        entity.setParentesco(parentesco);
        entity.setTelefono(dto.getTelefono());
        entity.setDireccion(dto.getDireccion());
        entity.setObservaciones(dto.getObservaciones());

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional
    public void changeStatus(Integer id, Integer estadoId) {
        ContactoEmergencia entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        ContactoEmergencia entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        repository.delete(entity);
    }
}