package com.clinica.psicologia.system.serv_implementation.clinical;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
import com.clinica.psicologia.system.support_services.storage.S3FileStorageService;
import com.clinica.psicologia.system.support_services.storage.S3ObjectKeyGenerator;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NotaSesionServiceImpl implements NotaSesionService {
    private static final String PDF_CONTENT_TYPE = "application/pdf";
    private static final long MAX_FILE_SIZE = 50L * 1024L * 1024L;

    private final NotaSesionRepository repository;
    private final SesionRepository sesionRepository;
    private final NotaSesionMapper mapper;
    private final S3FileStorageService fileStorageService;
    private final S3ObjectKeyGenerator objectKeyGenerator;

    @Override
    public NotaSesionResponseDTO create(NotaSesionRequestDTO request, MultipartFile attachment) {
        Sesion sesion = sesionRepository.findById(request.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada"));

        NotaSesion entity = new NotaSesion();

        entity.setSesion(sesion);
        entity.setUsuario(getAuthenticatedUser());
        entity.setFechaRegistro(LocalDateTime.now());

        mapper.updateEntity(entity, request);

        if (attachment != null && !attachment.isEmpty()) {
            String objectKey = uploadAttachment(
                    attachment,
                    sesion.getId());

            entity.setArchivoAdjunto(objectKey);
        }

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
    public NotaSesionResponseDTO update(Integer id, NotaSesionRequestDTO request, MultipartFile attachment) {
        NotaSesion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nota de sesión no encontrada."));

        validateOwnership(entity);

        Sesion sesion = sesionRepository.findById(request.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada."));

        entity.setSesion(sesion);

        mapper.updateEntity(entity, request);

        String previousObjectKey = entity.getArchivoAdjunto();

        if (attachment != null && !attachment.isEmpty()) {
            String newObjectKey = uploadAttachment(attachment, sesion.getId());
            entity.setArchivoAdjunto(newObjectKey);

            if (previousObjectKey != null
                    && !previousObjectKey.isBlank()
                    && !previousObjectKey.equals(newObjectKey)) {
                fileStorageService.delete(previousObjectKey);
            }
        }

        return mapper.toResponseDTO(repository.save(entity));
    }

    @Override
    public void delete(Integer id) {
        NotaSesion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nota de sesión no encontrada."));

        validateOwnership(entity);
        repository.delete(entity);

        String objectKey = entity.getArchivoAdjunto();
        if (objectKey != null && !objectKey.isBlank()) {
            fileStorageService.delete(objectKey);
        }
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<NotaSesionResponseDTO> getBySesion(Integer sesionId) {
        return mapper.toResponseDTOList(repository.findBySesionIdOrderByFechaRegistroAsc(sesionId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public InputStreamResource getAttachment(Integer id) {
        NotaSesion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nota de sesión no encontrada: " + id));

        String objectKey = entity.getArchivoAdjunto();
        if (objectKey == null || objectKey.isBlank()) {
            throw new ResourceNotFoundException("Ningún adjunto está asociado con esta nota de sesión.");
        }

        InputStream inputStream = fileStorageService.retrieve(objectKey);
        return new InputStreamResource(inputStream);
    }

    private String uploadAttachment(MultipartFile attachment, Integer sessionId) {
        validateAttachment(attachment);
        String objectKey = objectKeyGenerator.generateSessionNoteKey(sessionId);

        try {
            fileStorageService.store(
                    attachment.getInputStream(),
                    attachment.getSize(),
                    PDF_CONTENT_TYPE,
                    attachment.getOriginalFilename(),
                    objectKey);
            return objectKey;
        } catch (IOException exception) {
            throw new BusinessRuleException("No fue posible cargar el archivo adjunto de la nota de sesión.");
        }
    }

    private void validateAttachment(MultipartFile attachment) {
        if (attachment == null || attachment.isEmpty()) {
            throw new BusinessRuleException("El archivo adjunto no puede estar vacío.");
        }

        if (attachment.getSize() > MAX_FILE_SIZE) {
            throw new BusinessRuleException("El archivo adjunto no puede superar los 50 MB.");
        }

        if (!PDF_CONTENT_TYPE.equalsIgnoreCase(attachment.getContentType())) {
            throw new BusinessRuleException("Solo se permiten archivos PDF.");
        }

        String originalFileName = attachment.getOriginalFilename();
        if (originalFileName == null || !originalFileName.toLowerCase().endsWith(".pdf")) {
            throw new BusinessRuleException("El archivo adjunto debe tener extensión PDF.");
        }
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
