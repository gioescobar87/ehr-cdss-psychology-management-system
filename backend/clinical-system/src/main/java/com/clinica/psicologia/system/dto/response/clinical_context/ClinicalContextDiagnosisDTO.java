    package com.clinica.psicologia.system.dto.response.clinical_context;

    import lombok.Getter;
    import lombok.Setter;

    import java.time.LocalDate;

    @Getter
    @Setter
    public class ClinicalContextDiagnosisDTO {

        private Integer id;

        private Integer diagnosticoId;

        private String codigoDsm;

        private String nombre;

        private String categoriaDiagnostica;

        private LocalDate fechaDiagnostico;

        private Integer sesionId;
    }