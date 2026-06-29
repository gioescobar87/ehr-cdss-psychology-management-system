package com.clinica.psicologia.system.service.clinical;

import com.clinica.psicologia.system.dto.request.clinical.IntervencionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.IntervencionResponseDTO;
import com.clinica.psicologia.system.service.catalog.CatalogService;

public interface IntervencionService extends CatalogService<IntervencionRequestDTO, IntervencionResponseDTO> {

}