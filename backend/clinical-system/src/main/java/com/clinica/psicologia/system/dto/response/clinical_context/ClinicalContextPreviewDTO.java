package com.clinica.psicologia.system.dto.response.clinical_context;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ClinicalContextPreviewDTO<T> {

    private List<T> items;

    private long total;
}