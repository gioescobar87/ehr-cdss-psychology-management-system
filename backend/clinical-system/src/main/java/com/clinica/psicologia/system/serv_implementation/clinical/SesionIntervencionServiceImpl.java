package com.clinica.psicologia.system.serv_implementation.clinical;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.SesionIntervencionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionIntervencionResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.SesionIntervencionMapper;
import com.clinica.psicologia.system.model.clinical.Intervencion;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.clinical.SesionIntervencion;
import com.clinica.psicologia.system.repository.clinical.IntervencionRepository;
import com.clinica.psicologia.system.repository.clinical.SesionIntervencionRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.SesionIntervencionService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SesionIntervencionServiceImpl implements SesionIntervencionService {
    private final SesionIntervencionRepository repository;
    private final SesionRepository sesionRepository;
    private final IntervencionRepository intervencionRepository;
    private final SesionIntervencionMapper mapper;

    @Override
    public SesionIntervencionResponseDTO create(
            SesionIntervencionRequestDTO request) {

        if (repository.existsBySesionIdAndIntervencionId(
                request.getSesionId(),
                request.getIntervencionId())) {

            throw new DuplicateResourceException(
                    "La intervención ya fue asignada a la sesión.");
        }

        Sesion sesion = sesionRepository.findById(request.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sesión no encontrada."));

        Intervencion intervencion = intervencionRepository
                .findById(request.getIntervencionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Intervención no encontrada."));

        SesionIntervencion entity = new SesionIntervencion();

        entity.setSesion(sesion);
        entity.setIntervencion(intervencion);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<SesionIntervencionResponseDTO> findAll() {

        return mapper.toResponseDTOList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<SesionIntervencionResponseDTO> getBySesion(
            Integer sesionId) {

        sesionRepository.findById(sesionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sesión no encontrada."));

        return mapper.toResponseDTOList(
                repository.findBySesionIdOrderByIntervencionNombreAsc(sesionId));
    }

    @Override
    public void delete(Integer id) {

        SesionIntervencion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación de intervención no encontrada."));

        repository.delete(entity);
    }
}
