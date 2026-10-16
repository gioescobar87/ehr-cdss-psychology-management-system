------------------------------------------------------
-- REQUIRED ADJUSTMENTS
------------------------------------------------------
-- DROP UNNECESSARY TABLES
DROP TABLE evaluacion_criterio_clinico ;
DROP TABLE evaluacion_diagnostica ;
DROP TABLE nodo_arbol ;
DROP TABLE arbol_diagnostico ;

-- ADJUST CRITERIO CLINICO
UPDATE criterio_clinico
SET nombre = 'Sentimientos de desapego o distanciamiento de los demás'
WHERE nombre = 'Desapego';

-- ADD MISSING CRITERIO CLINICO
INSERT INTO public.criterio_clinico (
    categoria_criterio_clinico_id,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    v.nombre,
    v.descripcion,
    1
FROM public.categoria_criterio_clinico c
CROSS JOIN (
    VALUES
        (
            'Malestar psicológico intenso ante recordatorios del trauma',
            'Respuesta emocional intensa al exponerse a señales internas o externas que recuerdan o simbolizan un acontecimiento traumático.'
        )
) AS v(nombre, descripcion)
WHERE c.nombre = 'Trauma y disociación';

-- ADD DIAGNOSTICO CRITERIO CLINICO RELATIONSHIP
INSERT INTO diagnostico_criterio_clinico (
    diagnostico_id,
    criterio_clinico_id
)
VALUES (
    (SELECT id FROM diagnostico WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'),
    (SELECT id FROM criterio_clinico WHERE nombre = 'Malestar psicológico intenso ante recordatorios del trauma')
);

-- CATEGORIZE RELATIONSHIP BY RULE REFERENCE
ALTER TABLE diagnostico_criterio_clinico
ADD COLUMN referencia_regla VARCHAR(1);


-- FILL OUT INITIAL RULE REFERENCES

------------------------------------------------------
-- TRASTORNO DE ANSIEDAD GENERALIZADA
------------------------------------------------------
UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'B'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de ansiedad generalizada'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Fatiga o pérdida de energía',
        'Irritabilidad o ira',
        'Tensión muscular',
        'Dificultad para concentrarse',
        'Alteraciones del sueño'
        )
);

UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'A'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de ansiedad generalizada'
)
AND criterio_clinico_id = (
    SELECT id FROM criterio_clinico
    WHERE nombre = 'Preocupación excesiva sobre múltiples acontencimientos o actividades'
);


------------------------------------------------------
-- TRASTORNO NEGATIVISTA DESAFIANTE
------------------------------------------------------
UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'A'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno negativista desafiante'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Se muestra enojado o resentido. Observado durante por lo menos 6 meses',
        'Culpa a otros por sus propios errores o comportamiento. Observado durante por lo menos 6 meses',
        'Molesta deliberadamente a otras personas. Observado durante por lo menos 6 meses',
        'Discute con figuras de autoridad o adultos. Observado durante por lo menos 6 meses',
        'Se molesta o irrita fácilmente. Observado durante por lo menos 6 meses',
        'Pierde la calma frecuentemente. Observado durante por lo menos 6 meses',
        'Comportamiento vengativo. Observado durante por lo menos 6 meses',
        'Se niega a cumplir reglas o solicitudes. Observado durante por lo menos 6 meses'
    )
);


------------------------------------------------------
-- TDAH, PRESENTACIÓN PREDOMINANTEMENTE INATENTA
------------------------------------------------------
UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'A'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'TDAH, presentación predominantemente inatenta'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'No termina tareas',
        'Se distrae fácilmente',
        'Dificultad para mantener la atención',
        'Evita tareas que requieren esfuerzo mental sostenido',
        'Parece no escuchar cuando se le habla',
        'Dificultad para organizar tareas',
        'Olvida actividades cotidianas',
        'Comete errores por descuido',
        'No presta atención a detalles',
        'Pierde objetos necesarios para actividades'
    )
);


------------------------------------------------------
-- TRASTORNO DE ESTRÉS POSTRAUMÁTICO (TEPT)
------------------------------------------------------
UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'D'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Alteraciones del sueño',
        'Conducta imprudente o autodestructiva',
        'Dificultad para concentrarse',
        'Hipervigilancia',
        'Irritabilidad o ira',
        'Respuesta exagerada de sobresalto'
    )
);

UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'C'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Creencias negativas persistentes',
        'Desapego (Sentimientos de desapego o distanciamiento de los demás)',
        'Disminución del interés',
        'Estado emocional negativo persistente',
        'Incapacidad para experimentar emociones positivas',
        'Incapacidad para recordar aspectos importantes del trauma'
    )
);

UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'B'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Culpa distorsionada',
        'Evitación de pensamientos o sentimientos relacionados con trauma',
        'Evitación de recordatorios externos'
    )
);

UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'A'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Flashbacks o reacciones disociativas',
        'Malestar psicológico intenso ante recordatorios del trauma',
        'Pesadillas o sueños angustiosos',
        'Reacciones intensas ante recordatorios',
        'Recuerdos intrusivos'
    )
);

------------------------------------------------------
-- RECREATE EVALUACION_DIAGNOSTICA TABLE
------------------------------------------------------

CREATE TABLE evaluacion_diagnostica (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,

    sesion_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    diagnostico_sugerido_id INTEGER,
    diagnostico_seleccionado_id INTEGER,

    concordancia_diagnostica INTEGER NOT NULL
        CHECK (concordancia_diagnostica IN (0, 1)),

    fecha_hora_inferencia TIMESTAMP WITHOUT TIME ZONE NOT NULL,

    CONSTRAINT fk_evaluacion_diagnostica_sesion
        FOREIGN KEY (sesion_id)
        REFERENCES sesion (id),

    CONSTRAINT fk_evaluacion_diagnostica_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario (id),

    CONSTRAINT fk_evaluacion_diagnostica_sugerido
        FOREIGN KEY (diagnostico_sugerido_id)
        REFERENCES diagnostico (id),

    CONSTRAINT fk_evaluacion_diagnostica_seleccionado
        FOREIGN KEY (diagnostico_seleccionado_id)
        REFERENCES diagnostico (id)
);


------------------------------------------------------
-- CREATE INFERENCE RULES STRUCTURE
------------------------------------------------------
CREATE TABLE operador (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(2) NOT NULL, -- ÚNICAMENTE '=', '>', '<'
    descripcion VARCHAR(15) NOT NULL
);

CREATE TABLE tipo_regla (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- BASICA, EXCLUSION
    descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE diagnostico_regla (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    diagnostico_id INTEGER NOT NULL,
    tipo_regla_id INTEGER NOT NULL,
    valor_regla INTEGER NOT NULL,
    operador_id INTEGER NOT NULL,
    parametro TEXT NOT NULL,

    CONSTRAINT fk_diagnostico_regla_diagnostico
        FOREIGN KEY (diagnostico_id)
        REFERENCES diagnostico (id),

    CONSTRAINT fk_diagnostico_regla_tipo
        FOREIGN KEY (tipo_regla_id)
        REFERENCES tipo_regla (id),
        
    CONSTRAINT fk_diagnostico_operador
        FOREIGN KEY (operador_id)
        REFERENCES operador (id)
    
);


------------------------------------------------------
-- SEED CATALOGS
------------------------------------------------------
-- Operators
INSERT INTO operador (nombre, descripcion)
VALUES
    ('=', 'Igual a'),
    ('>', 'Mayor que'),
    ('<', 'Menor que');

-- Rule types
INSERT INTO tipo_regla (nombre, descripcion)
VALUES
    ('BÁSICA', 'Cantidad mínima de síntomas o criterios a observar según su categoría'),
    ('EXCLUSIÓN', 'Preguntas cerradas destinadas a descartar diagnósticos o categorizarlos');


------------------------------------------------------
-- SEED DIAGNOSTIC INFERENCE RULES
------------------------------------------------------

-- TRASTORNO DE ANSIEDAD GENERALIZADA
INSERT INTO diagnostico_regla
    (diagnostico_id, tipo_regla_id, valor_regla, operador_id, parametro)
VALUES
    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de ansiedad generalizada'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 1,
     (SELECT id FROM operador WHERE nombre = '='), 'A'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de ansiedad generalizada'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 2,
     (SELECT id FROM operador WHERE nombre = '>'), 'B'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de ansiedad generalizada'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿La preocupación identificada puede estar predominantemente limitada a otro trastorno (ataques de pánico, evaluación social, separación, obsesiones, traumas, enfermedad, imagen corporal, etc.)?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de ansiedad generalizada'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿El comportamiento o malestar observado puede justificarse por el consumo de sustancias, medicamentos u otra condición médica?');


-- TRASTORNO NEGATIVISTA DESAFIANTE
INSERT INTO diagnostico_regla
    (diagnostico_id, tipo_regla_id, valor_regla, operador_id, parametro)
VALUES
    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno negativista desafiante'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 3,
     (SELECT id FROM operador WHERE nombre = '>'), 'A'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno negativista desafiante'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿El comportamiento o malestar observado puede justificarse por el consumo de sustancias, medicamentos u otra condición médica?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno negativista desafiante'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿El comportamiento irritable o enojado se observa con personas que no son sus hermanos/as?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno negativista desafiante'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿El comportamiento desafiante o irritable se presenta con una frecuencia mínima de una vez por semana en niños de 5 años o más, o casi a diario en menores de 5 años?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno negativista desafiante'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿El estado irritable o molesto o el comportamiento desafiante o vengativo ha persistido durante al menos 6 meses?');


-- TDAH, PRESENTACIÓN PREDOMINANTEMENTE INATENTA
INSERT INTO diagnostico_regla
    (diagnostico_id, tipo_regla_id, valor_regla, operador_id, parametro)
VALUES
    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente inatenta'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 5,
     (SELECT id FROM operador WHERE nombre = '>'), 'A'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente inatenta'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Los síntomas de inatención han persistido durante por lo menos 6 meses?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente inatenta'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Múltiples síntomas de inatención se presentaron antes de los 12 años de edad?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente inatenta'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Es evidente que los síntomas de inatención ocasionan interferencia funcional?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente inatenta'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿Se observa hiperactividad o impulsividad?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente inatenta'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿Los síntomas de inatención se explican mejor por ansiedad, depresión, trastorno del sueño u otra causa específica?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'TDAH, presentación predominantemente inatenta'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Presenta los síntomas de inatención por lo menos en 2 contextos?');


-- TRASTORNO DE ESTRÉS POSTRAUMÁTICO (TEPT)
INSERT INTO diagnostico_regla
    (diagnostico_id, tipo_regla_id, valor_regla, operador_id, parametro)
VALUES
    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 0,
     (SELECT id FROM operador WHERE nombre = '>'), 'A'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 0,
     (SELECT id FROM operador WHERE nombre = '>'), 'B'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 1,
     (SELECT id FROM operador WHERE nombre = '>'), 'C'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'BÁSICA'), 1,
     (SELECT id FROM operador WHERE nombre = '>'), 'D'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Los síntomas comenzaron o empeoraron después del acontecimiento traumático y son ajenos a una pérdida?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Los síntomas relacionados con el trauma han persistido durante más de un mes?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 1,
     (SELECT id FROM operador WHERE nombre = '='), '¿Los síntomas causan malestar significativo o dificultan actividades importantes de la vida diaria?'),

    ((SELECT id FROM diagnostico WHERE nombre = 'Trastorno de estrés postraumático (TEPT)'),
     (SELECT id FROM tipo_regla WHERE nombre = 'EXCLUSIÓN'), 0,
     (SELECT id FROM operador WHERE nombre = '='), '¿El comportamiento o malestar observado puede justificarse por el consumo de sustancias, medicamentos u otra condición médica?');