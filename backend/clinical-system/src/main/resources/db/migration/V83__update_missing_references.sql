-- UPDATE MISSING RULES REFERENCE

-- TRASTORNO DE ADAPTACIÓN CON ANSIEDAD
UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'A'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de adaptación con ansiedad'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Ansiedad o tensión'
    )
);

UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'B'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de adaptación con ansiedad'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Nerviosismo',
        'Aprensión'
    )
);


-- TRASTORNO DEPRESIVO NO ESPECIFICADO
UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'A'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno depresivo no especificado'
);


-- AGORAFOBIA
UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'A'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Agorafobia'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Miedo a transporte público',
        'Miedo a filas o multitudes',
        'Miedo a estar fuera de casa solo',
        'Miedo a espacios abiertos',
        'Miedo a espacios cerrados'
    )
);

UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'B'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Agorafobia'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Miedo a no disponer de ayuda',
        'Ansiedad anticipatoria',
        'Miedo a no poder escapar'
    )
);

UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'C'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Agorafobia'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Necesidad de acompañante',
        'Evitación de situaciones'
    )
);


-- TRASTORNO DE ANSIEDAD NO ESPECIFICADO
UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'A'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de ansiedad no especificado'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Ansiedad o tensión',
        'Ansiedad clínicamente significativa'
    )
);

UPDATE diagnostico_criterio_clinico
SET referencia_regla = 'B'
WHERE diagnostico_id = (
    SELECT id FROM diagnostico
    WHERE nombre = 'Trastorno de ansiedad no especificado'
)
AND criterio_clinico_id IN (
    SELECT id FROM criterio_clinico
    WHERE nombre IN (
        'Dificultad para concentrarse',
        'Miedo o preocupación',
        'Evitación de situaciones',
        'Síntomas autonómicos/físicos'
    )
);