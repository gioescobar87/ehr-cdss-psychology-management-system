-- UPDATE MISSING RULES REFERENCE
UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'C'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Sentimientos de desapego o distanciamiento de los demás'
    )
);


UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'A'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de adaptación con ansiedad y estado de ánimo deprimido'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Preocupación excesiva sobre múltiples acontencimientos o actividades'
    )
);

UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'B'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de adaptación con ansiedad y estado de ánimo deprimido'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Desesperanza',
        'Tristeza',
        'Llanto'
    )
);


UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'A'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'TDAH, presentación predominantemente hiperactiva/impulsiva'
);


------------------------------------------------------
-- SEED DIAGNOSTIC INFERENCE RULES
------------------------------------------------------

-- TRASTORNO DE ANSIEDAD GENERALIZADA
INSERT INTO diagnostico_regla
    (diagnostico_id, tipo_regla_id, valor_regla, operador_id, parametro)
VALUES
    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente hiperactiva/impulsiva'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 5,
     (SELECT id FROM operador WHERE nombre = '>'), 'A'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente hiperactiva/impulsiva'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Los síntomas causan malestar significativo o dificultan actividades importantes de la vida diaria?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente hiperactiva/impulsiva'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Los síntomas de hiperactividad han persistido durante por lo menos 6 meses?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente hiperactiva/impulsiva'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Presenta los síntomas de hiperactivdad por lo menos en 2 contextos?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente hiperactiva/impulsiva'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Varios de los síntomas de hiperactividad surgieron antes de los 12 años?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente hiperactiva/impulsiva'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿El comportamiento o malestar observado puede justificarse por el consumo de sustancias, medicamentos u otra condición médica?');


INSERT INTO diagnostico_regla
    (diagnostico_id, tipo_regla_id, valor_regla, operador_id, parametro)
VALUES
    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de adaptación con ansiedad y estado de ánimo deprimido'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 0,
     (SELECT id FROM operador WHERE nombre = '>'), 'A'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de adaptación con ansiedad y estado de ánimo deprimido'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 0,
     (SELECT id FROM operador WHERE nombre = '>'), 'B'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de adaptación con ansiedad y estado de ánimo deprimido'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿El comportamiento o malestar observado puede justificarse por el consumo de sustancias, medicamentos u otra condición médica?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente hiperactiva/impulsiva'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Los síntomas de ansiedad, desesperanza o depresión surgen como resultado de un estresor?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente hiperactiva/impulsiva'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Los síntomas de ansiedad, desesperanza o depresión ocasionan interferencia funcional?');
