------------------------------------------------------
-- SEED DIAGNOSTIC INFERENCE RULES
------------------------------------------------------

-- TRASTORNO DE ADAPTACIÓN CON ANSIEDAD
INSERT INTO diagnostico_regla
    (diagnostico_id, tipo_regla_id, valor_regla, operador_id, parametro)
VALUES
    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de adaptación con ansiedad'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 1,
     (SELECT id FROM operador WHERE nombre = '='), 'A'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de adaptación con ansiedad'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 1,
     (SELECT id FROM operador WHERE nombre = '>'), 'B'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de adaptación con ansiedad'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿El malestar clínico es significativamente desproporcionado y está predominantemente asociada a un estresor específico?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de adaptación con ansiedad'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿El malestar inició dentro de los últimos 3 meses y no ha persistido durante más de 6 meses?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de adaptación con ansiedad'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿La ansiedad aparece principalmente cuando está en situaciones sociales o cuando siente que otras personas podrían juzgarle, criticarle o evaluarle?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de adaptación con ansiedad'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿El malestar ha afectado de forma significativa sus relaciones sociales?');


-- TRASTORNO DEPRESIVO NO ESPECIFICADO
INSERT INTO diagnostico_regla
    (diagnostico_id, tipo_regla_id, valor_regla, operador_id, parametro)
VALUES
    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno depresivo no especificado'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 2,
     (SELECT id FROM operador WHERE nombre = '>'), 'A'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno depresivo no especificado'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Existe evidencia de síntomas depresivos clínicamente significativos y deterioro funcional?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno depresivo no especificado'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿Cuenta con suficiente información para deteriminar el motivo de los síntomas depresivos observados?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno depresivo no especificado'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿El comportamiento o malestar observado puede justificarse por el consumo de sustancias, medicamentos u otra condición médica?');


-- AGORAFOBIA
INSERT INTO diagnostico_regla
    (diagnostico_id, tipo_regla_id, valor_regla, operador_id, parametro)
VALUES
    ((SELECT id FROM diagnostico WHERE nombre = 'Agorafobia'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 1,
     (SELECT id FROM operador WHERE nombre = '>'), 'A'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Agorafobia'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 1,
     (SELECT id FROM operador WHERE nombre = '>'), 'B'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Agorafobia'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Evita situaciones o las enfrenta con temor intenso, de manera desproporcionada al peligro real?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Agorafobia'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Experimenta miedo o ansiedad intensa en situaciones en las que escapar podría resultar difícil o no podría recibir ayuda si presenta síntomas de ansiedad?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Agorafobia'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿El miedo, ansiedad o evitación ha persistido durante 6 meses o más y le ha generado malestar significativo o dificultades en su vida cotidiana?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Agorafobia'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿El comportamiento o malestar observado puede justificarse por el consumo de sustancias, medicamentos u otra condición médica?');


     -- TRASTORNO DE ANSIEDAD NO ESPECIFICADO
INSERT INTO diagnostico_regla
    (diagnostico_id, tipo_regla_id, valor_regla, operador_id, parametro)
VALUES
    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de ansiedad no especificado'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 0,
     (SELECT id FROM operador WHERE nombre = '>'), 'A'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de ansiedad no especificado'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 1,
     (SELECT id FROM operador WHERE nombre = '>'), 'B'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de ansiedad no especificado'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Los síntomas de ansiedad le generan malestar significativo o afectan su funcionamiento cotidiano, como sus relaciones, actividades laborales, académicas o personales?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de ansiedad no especificado'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿Cuenta con información suficiente para determinar qué trastorno específico explica los síntomas de ansiedad?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de ansiedad no especificado'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿El comportamiento o malestar observado puede justificarse por el consumo de sustancias, medicamentos u otra condición médica?');

