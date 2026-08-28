package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AplicacionPruebaResponseDTO {

    private Integer id;

    private Integer sesionId;

    private Integer pruebaPsicologicaId;

    private LocalDate fechaAplicacion;

    private String archivoAdjunto;

    private String interpretacion;

    private Integer estadoId;

    private String estado;
}