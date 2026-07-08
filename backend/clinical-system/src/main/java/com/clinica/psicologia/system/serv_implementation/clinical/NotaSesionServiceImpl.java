package com.clinica.psicologia.system.serv_implementation.clinical;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.NotaSesionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.NotaSesionResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.NotaSesionMapper;
import com.clinica.psicologia.system.model.clinical.NotaSesion;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.clinical.NotaSesionRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.security.model.SecurityUser;
import com.clinica.psicologia.system.service.clinical.NotaSesionService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NotaSesionServiceImpl implements NotaSesionService {
    private final NotaSesionRepository repository;
    private final SesionRepository sesionRepository;
    private final NotaSesionMapper mapper;

    @Override
    public NotaSesionResponseDTO create(NotaSesionRequestDTO request) {
        Sesion sesion = sesionRepository.findById(request.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada"));

        NotaSesion entity = new NotaSesion();

        entity.setSesion(sesion);
        entity.setUsuario(getAuthenticatedUser());
        entity.setFechaRegistro(LocalDateTime.now());

        mapper.updateEntity(entity, request);

        return mapper.toResponseDTO(repository.save(entity));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<NotaSesionResponseDTO> findAll() {
        return mapper.toResponseDTOList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public NotaSesionResponseDTO findById(Integer id) {
        NotaSesion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nota de sesión no encontrada."));

        return mapper.toResponseDTO(entity);
    }

    @Override
    public NotaSesionResponseDTO update(Integer id, NotaSesionRequestDTO request) {
        NotaSesion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nota de sesión no encontrada."));

        validateOwnership(entity);

        Sesion sesion = sesionRepository.findById(request.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada."));

        entity.setSesion(sesion);

        mapper.updateEntity(entity, request);

        return mapper.toResponseDTO(repository.save(entity));
    }

    @Override
    public void delete(Integer id) {
        NotaSesion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nota de sesión no encontrada."));

        validateOwnership(entity);
        repository.delete(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<NotaSesionResponseDTO> getBySesion(Integer sesionId) {
        return mapper.toResponseDTOList(repository.findBySesionIdOrderByFechaRegistroAsc(sesionId));
    }

    private Usuario getAuthenticatedUser() {
        SecurityUser securityUser = (SecurityUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return securityUser.getUsuario();
    }

    private void validateOwnership(NotaSesion nota) {

        Usuario usuario = getAuthenticatedUser();

        if (!nota.getUsuario().getId().equals(usuario.getId())) {
            throw new BusinessRuleException("Solo el autor puede modificar la nota.");
        }
    }
}
