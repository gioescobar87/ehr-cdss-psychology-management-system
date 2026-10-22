-- UPDATE MISSING RULES REFERENCE
UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'A'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno depresivo persistente (distimia)'
);


------------------------------------------------------
-- SEED DIAGNOSTIC INFERENCE RULES
------------------------------------------------------

-- TRASTORNO DEPRESIVO PERSISTENTE (DISTIMIA)
INSERT INTO diagnostico_regla
    (diagnostico_id, tipo_regla_id, valor_regla, operador_id, parametro)
VALUES
    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno depresivo persistente (distimia)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 1,
     (SELECT id FROM operador WHERE nombre = '>'), 'A'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno depresivo persistente (distimia)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿El comportamiento o malestar observado puede justificarse por el consumo de sustancias, medicamentos u otra condición médica?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno depresivo persistente (distimia)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿Se ha observado la ausencia de los síntomas depresivos durante un período mayor a dos meses?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno depresivo persistente (distimia)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿El estado deprimido persiste durante la mayor parte del día, la mayoría de los días, durante por lo menos 2 años en adultos o 1 año en niños?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno depresivo persistente (distimia)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿Tiene antecedentes de manía/hipomanía o trastornos psicóticos?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno depresivo persistente (distimia)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Los síntomas causan malestar significativo o dificultan actividades importantes de la vida diaria?');
