-- ============================================================
-- 0. LIMPIEZA DE TABLAS
-- ============================================================

DELETE FROM paciente_diagnostico WHERE id > 0;
DELETE FROM nodo_arbol WHERE id > 0;
DELETE FROM evaluacion_diagnostica WHERE id > 0;
DELETE FROM sesion_criterio_clinico WHERE id > 0;
DELETE FROM criterio_clinico WHERE id > 0;
DELETE FROM diagnostico WHERE id > 0;
DELETE FROM arbol_diagnostico WHERE id > 0;
DELETE FROM categoria_diagnostica WHERE id > 0;
DELETE FROM categoria_criterio_clinico WHERE id > 0;


/* ============================================================
   1. CATEGORÍA DIAGNÓSTICA
   ============================================================ */

INSERT INTO categoria_diagnostica (
    nombre,
    descripcion,
    estado_id
)
VALUES (
    'Trastornos depresivos',
    'Categoría diagnóstica correspondiente a los trastornos depresivos contemplados por el sistema de apoyo diagnóstico.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ============================================================
   2. ÁRBOL DIAGNÓSTICO
   ============================================================ */

INSERT INTO arbol_diagnostico (
    codigo_arbol,
    version,
    nombre,
    categoria_diagnostica_id,
    estado_id,
    fecha_creacion
)
VALUES (
    'ARB-DEP-001',
    1,
    'Árbol diagnóstico para trastorno depresivo mayor',
    (
        SELECT id
        FROM categoria_diagnostica
        WHERE nombre = 'Trastornos depresivos'
    ),
    (SELECT id FROM estado WHERE nombre = 'ACTIVO'),
    CURRENT_TIMESTAMP
);


/* ============================================================
   3. DIAGNÓSTICOS TERMINALES
   ============================================================ */

INSERT INTO diagnostico (
    categoria_diagnostica_id,
    codigo_dsm,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (
        SELECT id
        FROM categoria_diagnostica
        WHERE nombre = 'Trastornos depresivos'
    ),
    'F32.0',
    'Trastorno depresivo mayor, episodio único, leve',
    'Episodio depresivo mayor de presentación leve, determinado mediante la evaluación clínica de los síntomas, su intensidad y el grado de deterioro funcional.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (
        SELECT id
        FROM categoria_diagnostica
        WHERE nombre = 'Trastornos depresivos'
    ),
    'F32.1',
    'Trastorno depresivo mayor, episodio único, moderado',
    'Episodio depresivo mayor de presentación moderada, determinado mediante la evaluación clínica de los síntomas, su intensidad y el grado de deterioro funcional.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (
        SELECT id
        FROM categoria_diagnostica
        WHERE nombre = 'Trastornos depresivos'
    ),
    'F32.2',
    'Trastorno depresivo mayor, episodio único, grave sin características psicóticas',
    'Episodio depresivo mayor de presentación grave sin características psicóticas, determinado mediante la evaluación clínica de los síntomas, su intensidad y el grado de deterioro funcional.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ============================================================
   4. CATEGORÍAS DE CRITERIOS CLÍNICOS
   Estas categorías describen la experiencia o manifestación
   clínica que el usuario puede observar/registrar.
   ============================================================ */

INSERT INTO categoria_criterio_clinico (
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    'Estado de ánimo',
    'Manifestaciones relacionadas con el estado emocional y afectivo del paciente.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    'Interés y placer',
    'Manifestaciones relacionadas con el interés, motivación y capacidad para experimentar placer.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    'Sueño',
    'Manifestaciones relacionadas con el sueño, incluyendo dificultad para dormir o necesidad excesiva de sueño.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    'Apetito y peso',
    'Manifestaciones relacionadas con cambios en el apetito, alimentación o peso corporal.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    'Actividad psicomotora',
    'Manifestaciones relacionadas con cambios observables en la actividad motora.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    'Energía y fatiga',
    'Manifestaciones relacionadas con disminución de energía, cansancio o fatiga.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    'Cognición y concentración',
    'Manifestaciones relacionadas con concentración, pensamiento, atención y toma de decisiones.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    'Autovaloración y culpa',
    'Manifestaciones relacionadas con sentimientos de inutilidad, culpa o autovaloración negativa.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    'Muerte y suicidio',
    'Manifestaciones relacionadas con pensamientos de muerte, ideación suicida y conductas suicidas.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    'Funcionamiento',
    'Manifestaciones relacionadas con el impacto clínicamente significativo de los síntomas en la vida del paciente.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ============================================================
   5. CRITERIOS CLÍNICOS
   ============================================================ */


/* ------------------------------------------------------------
   5.1 ESTADO DE ÁNIMO
   ------------------------------------------------------------ */

INSERT INTO criterio_clinico (
    categoria_criterio_clinico_id,
    codigo,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Estado de ánimo'),
    'DEP-EST-001-I',
    'Estado de ánimo deprimido sin relación aparente con una condición médica, sustancias o medicamentos',
    'Estado de ánimo deprimido presente durante la mayor parte del día, casi todos los días, durante al menos 2 semanas, sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Estado de ánimo'),
    'DEP-EST-001-E',
    'Estado de ánimo deprimido posiblemente relacionado con una condición médica, sustancias o medicamentos',
    'Estado de ánimo deprimido presente durante la mayor parte del día, casi todos los días, durante al menos 2 semanas, posiblemente relacionado con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ------------------------------------------------------------
   5.2 INTERÉS Y PLACER
   ------------------------------------------------------------ */

INSERT INTO criterio_clinico (
    categoria_criterio_clinico_id,
    codigo,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Interés y placer'),
    'DEP-INT-001-I',
    'Disminución marcada del interés o placer sin relación aparente con una condición médica, sustancias o medicamentos',
    'Disminución marcada del interés o placer en casi todas o prácticamente todas las actividades durante la mayor parte del día, casi todos los días, durante al menos 2 semanas, sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Interés y placer'),
    'DEP-INT-001-E',
    'Disminución marcada del interés o placer posiblemente relacionada con una condición médica, sustancias o medicamentos',
    'Disminución marcada del interés o placer en casi todas o prácticamente todas las actividades durante la mayor parte del día, casi todos los días, durante al menos 2 semanas, posiblemente relacionada con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ------------------------------------------------------------
   5.3 SUEÑO
   ------------------------------------------------------------ */

INSERT INTO criterio_clinico (
    categoria_criterio_clinico_id,
    codigo,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Sueño'),
    'DEP-SUE-001-I',
    'Insomnio sin relación aparente con una condición médica, sustancias o medicamentos',
    'Insomnio caracterizado por dificultad para iniciar o mantener el sueño, o sueño no reparador, presente casi todos los días durante al menos 2 semanas, sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Sueño'),
    'DEP-SUE-001-E',
    'Insomnio posiblemente relacionado con una condición médica, sustancias o medicamentos',
    'Insomnio caracterizado por dificultad para iniciar o mantener el sueño, o sueño no reparador, presente casi todos los días durante al menos 2 semanas, posiblemente relacionado con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Sueño'),
    'DEP-SUE-002-I',
    'Hipersomnia sin relación aparente con una condición médica, sustancias o medicamentos',
    'Hipersomnia o necesidad excesiva de sueño presente casi todos los días durante al menos 2 semanas, sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Sueño'),
    'DEP-SUE-002-E',
    'Hipersomnia posiblemente relacionada con una condición médica, sustancias o medicamentos',
    'Hipersomnia o necesidad excesiva de sueño presente casi todos los días durante al menos 2 semanas, posiblemente relacionada con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ------------------------------------------------------------
   5.4 APETITO Y PESO
   ------------------------------------------------------------ */

INSERT INTO criterio_clinico (
    categoria_criterio_clinico_id,
    codigo,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Apetito y peso'),
    'DEP-APE-001-I',
    'Disminución significativa del apetito sin relación aparente con una condición médica, sustancias o medicamentos',
    'Disminución significativa del apetito presente casi todos los días durante al menos 2 semanas, sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Apetito y peso'),
    'DEP-APE-001-E',
    'Disminución significativa del apetito posiblemente relacionada con una condición médica, sustancias o medicamentos',
    'Disminución significativa del apetito presente casi todos los días durante al menos 2 semanas, posiblemente relacionada con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Apetito y peso'),
    'DEP-APE-002-I',
    'Aumento significativo del apetito sin relación aparente con una condición médica, sustancias o medicamentos',
    'Aumento significativo del apetito presente casi todos los días durante al menos 2 semanas, sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Apetito y peso'),
    'DEP-APE-002-E',
    'Aumento significativo del apetito posiblemente relacionado con una condición médica, sustancias o medicamentos',
    'Aumento significativo del apetito presente casi todos los días durante al menos 2 semanas, posiblemente relacionado con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Apetito y peso'),
    'DEP-APE-003-I',
    'Pérdida significativa de peso sin relación aparente con una condición médica, sustancias o medicamentos',
    'Pérdida significativa de peso no atribuida deliberadamente a una dieta o intervención, asociada al episodio depresivo y sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Apetito y peso'),
    'DEP-APE-003-E',
    'Pérdida significativa de peso posiblemente relacionada con una condición médica, sustancias o medicamentos',
    'Pérdida significativa de peso no atribuida deliberadamente a una dieta o intervención, posiblemente relacionada con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Apetito y peso'),
    'DEP-APE-004-I',
    'Aumento significativo de peso sin relación aparente con una condición médica, sustancias o medicamentos',
    'Aumento significativo de peso no intencional asociado al episodio depresivo y sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Apetito y peso'),
    'DEP-APE-004-E',
    'Aumento significativo de peso posiblemente relacionado con una condición médica, sustancias o medicamentos',
    'Aumento significativo de peso no intencional posiblemente relacionado con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ------------------------------------------------------------
   5.5 ACTIVIDAD PSICOMOTORA
   ------------------------------------------------------------ */

INSERT INTO criterio_clinico (
    categoria_criterio_clinico_id,
    codigo,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Actividad psicomotora'),
    'DEP-PSI-001-I',
    'Agitación psicomotora sin relación aparente con una condición médica, sustancias o medicamentos',
    'Agitación psicomotora observable por otras personas, presente casi todos los días durante al menos 2 semanas, sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Actividad psicomotora'),
    'DEP-PSI-001-E',
    'Agitación psicomotora posiblemente relacionada con una condición médica, sustancias o medicamentos',
    'Agitación psicomotora observable por otras personas, presente casi todos los días durante al menos 2 semanas, posiblemente relacionada con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Actividad psicomotora'),
    'DEP-PSI-002-I',
    'Enlentecimiento psicomotor sin relación aparente con una condición médica, sustancias o medicamentos',
    'Enlentecimiento psicomotor observable por otras personas, presente casi todos los días durante al menos 2 semanas, sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Actividad psicomotora'),
    'DEP-PSI-002-E',
    'Enlentecimiento psicomotor posiblemente relacionado con una condición médica, sustancias o medicamentos',
    'Enlentecimiento psicomotor observable por otras personas, presente casi todos los días durante al menos 2 semanas, posiblemente relacionado con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ------------------------------------------------------------
   5.6 ENERGÍA Y FATIGA
   ------------------------------------------------------------ */

INSERT INTO criterio_clinico (
    categoria_criterio_clinico_id,
    codigo,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Energía y fatiga'),
    'DEP-ENE-001-I',
    'Fatiga o pérdida de energía sin relación aparente con una condición médica, sustancias o medicamentos',
    'Fatiga o pérdida significativa de energía presente casi todos los días durante al menos 2 semanas, sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Energía y fatiga'),
    'DEP-ENE-001-E',
    'Fatiga o pérdida de energía posiblemente relacionada con una condición médica, sustancias o medicamentos',
    'Fatiga o pérdida significativa de energía presente casi todos los días durante al menos 2 semanas, posiblemente relacionada con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ------------------------------------------------------------
   5.7 COGNICIÓN Y CONCENTRACIÓN
   ------------------------------------------------------------ */

INSERT INTO criterio_clinico (
    categoria_criterio_clinico_id,
    codigo,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Cognición y concentración'),
    'DEP-COG-001-I',
    'Disminución de la capacidad para concentrarse sin relación aparente con una condición médica, sustancias o medicamentos',
    'Disminución de la capacidad para pensar o concentrarse, o dificultad significativa para tomar decisiones, presente casi todos los días durante al menos 2 semanas, sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Cognición y concentración'),
    'DEP-COG-001-E',
    'Disminución de la capacidad para concentrarse posiblemente relacionada con una condición médica, sustancias o medicamentos',
    'Disminución de la capacidad para pensar o concentrarse, o dificultad significativa para tomar decisiones, presente casi todos los días durante al menos 2 semanas, posiblemente relacionada con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ------------------------------------------------------------
   5.8 AUTOVALORACIÓN Y CULPA
   ------------------------------------------------------------ */

INSERT INTO criterio_clinico (
    categoria_criterio_clinico_id,
    codigo,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Autovaloración y culpa'),
    'DEP-CUL-001-I',
    'Sentimientos de inutilidad o culpa excesiva sin relación aparente con una condición médica, sustancias o medicamentos',
    'Sentimientos de inutilidad o culpa excesiva o inapropiada, presentes casi todos los días durante al menos 2 semanas, sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Autovaloración y culpa'),
    'DEP-CUL-001-E',
    'Sentimientos de inutilidad o culpa excesiva posiblemente relacionados con una condición médica, sustancias o medicamentos',
    'Sentimientos de inutilidad o culpa excesiva o inapropiada, presentes casi todos los días durante al menos 2 semanas, posiblemente relacionados con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ------------------------------------------------------------
   5.9 MUERTE Y SUICIDIO
   ------------------------------------------------------------ */

INSERT INTO criterio_clinico (
    categoria_criterio_clinico_id,
    codigo,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Muerte y suicidio'),
    'DEP-SUI-001-I',
    'Pensamientos recurrentes de muerte sin relación aparente con una condición médica, sustancias o medicamentos',
    'Pensamientos recurrentes relacionados con la muerte, más allá de un temor a morir, presentes durante el episodio depresivo y sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Muerte y suicidio'),
    'DEP-SUI-001-E',
    'Pensamientos recurrentes de muerte posiblemente relacionados con una condición médica, sustancias o medicamentos',
    'Pensamientos recurrentes relacionados con la muerte, más allá de un temor a morir, presentes durante el episodio depresivo y posiblemente relacionados con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Muerte y suicidio'),
    'DEP-SUI-002-I',
    'Ideación suicida recurrente sin relación aparente con una condición médica, sustancias o medicamentos',
    'Ideación suicida recurrente, con o sin un plan específico, presente durante el episodio depresivo y sin relación aparente con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Muerte y suicidio'),
    'DEP-SUI-002-E',
    'Ideación suicida recurrente posiblemente relacionada con una condición médica, sustancias o medicamentos',
    'Ideación suicida recurrente, con o sin un plan específico, presente durante el episodio depresivo y posiblemente relacionada con los efectos fisiológicos de una condición médica, sustancia o medicamento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ============================================================
   5.10 FUNCIONAMIENTO
   ============================================================ */

INSERT INTO criterio_clinico (
    categoria_criterio_clinico_id,
    codigo,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Funcionamiento'),
    'DEP-FUN-001',
    'Malestar o deterioro clínicamente significativo',
    'Los síntomas producen malestar clínicamente significativo o deterioro en áreas sociales, laborales, académicas u otras áreas importantes del funcionamiento.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);


/* ============================================================
   5.11 CRITERIOS RELACIONADOS CON EPISODIOS MANÍACOS
   Estos criterios no se presentan como síntomas independientes
   de la depresión. Representan la información clínica que
   posteriormente podrá utilizar el árbol para excluir una
   explicación bipolar.
   ============================================================ */

INSERT INTO criterio_clinico (
    categoria_criterio_clinico_id,
    codigo,
    nombre,
    descripcion,
    estado_id
)
VALUES
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Estado de ánimo'),
    'DEP-BIP-001-I',
    'Síntomas depresivos sin antecedente conocido de episodio maníaco o hipomaníaco',
    'Presentación de síntomas depresivos sin antecedente conocido de un episodio maníaco o hipomaníaco.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
),
(
    (SELECT id FROM categoria_criterio_clinico WHERE nombre = 'Estado de ánimo'),
    'DEP-BIP-001-E',
    'Síntomas depresivos con antecedente de episodio maníaco o hipomaníaco',
    'Presentación de síntomas depresivos con antecedente conocido de un episodio maníaco o hipomaníaco.',
    (SELECT id FROM estado WHERE nombre = 'ACTIVO')
);