-- -- porcentaje_coincidencia -> coincide_diagnostico
-- ALTER TABLE evaluacion_diagnostica
-- RENAME COLUMN porcentaje_coincidencia TO coincide_diagnostico;

-- ALTER TABLE evaluacion_diagnostica
-- DROP CONSTRAINT chk_porcentaje;

-- ALTER TABLE evaluacion_diagnostica
-- ALTER COLUMN coincide_diagnostico TYPE BOOLEAN
-- USING FALSE;

-- ALTER TABLE evaluacion_diagnostica
-- ALTER COLUMN coincide_diagnostico SET DEFAULT FALSE;

-- ALTER TABLE evaluacion_diagnostica
-- ALTER COLUMN coincide_diagnostico SET NOT NULL;


-- -- nivel_consistencia_id -> version_arbol
-- ALTER TABLE evaluacion_diagnostica
-- DROP CONSTRAINT fk_evaluacion_diagnostica_nivel_consistencia_id;

-- ALTER TABLE evaluacion_diagnostica
-- RENAME COLUMN nivel_consistencia_id TO version_arbol;

-- ALTER TABLE evaluacion_diagnostica
-- ALTER COLUMN version_arbol TYPE INTEGER
-- USING 1;

-- ALTER TABLE evaluacion_diagnostica
-- ALTER COLUMN version_arbol SET DEFAULT 1;

-- ALTER TABLE evaluacion_diagnostica
-- ALTER COLUMN version_arbol SET NOT NULL;

-- ALTER TABLE evaluacion_diagnostica
-- RENAME CONSTRAINT evaluacion_diagnostica_id_nivel_consistencia_not_null
-- TO evaluacion_diagnostica_version_arbol_not_null;


-- ============================================================
-- porcentaje_coincidencia -> coincide_diagnostico
-- ============================================================

DO $$
BEGIN
    -- Rename column only if the old column exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'evaluacion_diagnostica'
          AND column_name = 'porcentaje_coincidencia'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'evaluacion_diagnostica'
          AND column_name = 'coincide_diagnostico'
    ) THEN

        ALTER TABLE evaluacion_diagnostica
        RENAME COLUMN porcentaje_coincidencia TO coincide_diagnostico;

    END IF;


    -- Drop constraint only if it exists
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.evaluacion_diagnostica'::regclass
          AND conname = 'chk_porcentaje'
    ) THEN

        ALTER TABLE evaluacion_diagnostica
        DROP CONSTRAINT chk_porcentaje;

    END IF;


    -- Change type only if the column exists and isn't already boolean
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'evaluacion_diagnostica'
          AND column_name = 'coincide_diagnostico'
          AND data_type <> 'boolean'
    ) THEN

        ALTER TABLE evaluacion_diagnostica
        ALTER COLUMN coincide_diagnostico TYPE BOOLEAN
        USING FALSE;

    END IF;


    -- Set default
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'evaluacion_diagnostica'
          AND column_name = 'coincide_diagnostico'
    ) THEN

        ALTER TABLE evaluacion_diagnostica
        ALTER COLUMN coincide_diagnostico SET DEFAULT FALSE;

        ALTER TABLE evaluacion_diagnostica
        ALTER COLUMN coincide_diagnostico SET NOT NULL;

    END IF;

END $$;


-- ============================================================
-- nivel_consistencia_id -> version_arbol
-- ============================================================

DO $$
BEGIN
    -- Drop FK only if it exists
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.evaluacion_diagnostica'::regclass
          AND conname = 'fk_evaluacion_diagnostica_nivel_consistencia_id'
    ) THEN

        ALTER TABLE evaluacion_diagnostica
        DROP CONSTRAINT fk_evaluacion_diagnostica_nivel_consistencia_id;

    END IF;


    -- Rename column only if old exists and new doesn't
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'evaluacion_diagnostica'
          AND column_name = 'nivel_consistencia_id'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'evaluacion_diagnostica'
          AND column_name = 'version_arbol'
    ) THEN

        ALTER TABLE evaluacion_diagnostica
        RENAME COLUMN nivel_consistencia_id TO version_arbol;

    END IF;


    -- Change type if necessary
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'evaluacion_diagnostica'
          AND column_name = 'version_arbol'
          AND data_type <> 'integer'
    ) THEN

        ALTER TABLE evaluacion_diagnostica
        ALTER COLUMN version_arbol TYPE INTEGER
        USING 1;

    END IF;


    -- Default + NOT NULL
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'evaluacion_diagnostica'
          AND column_name = 'version_arbol'
    ) THEN

        ALTER TABLE evaluacion_diagnostica
        ALTER COLUMN version_arbol SET DEFAULT 1;

        ALTER TABLE evaluacion_diagnostica
        ALTER COLUMN version_arbol SET NOT NULL;

    END IF;


    -- Rename NOT NULL constraint only if the old constraint exists
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.evaluacion_diagnostica'::regclass
          AND conname = 'evaluacion_diagnostica_id_nivel_consistencia_not_null'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.evaluacion_diagnostica'::regclass
          AND conname = 'evaluacion_diagnostica_version_arbol_not_null'
    ) THEN

        ALTER TABLE evaluacion_diagnostica
        RENAME CONSTRAINT
            evaluacion_diagnostica_id_nivel_consistencia_not_null
        TO
            evaluacion_diagnostica_version_arbol_not_null;

    END IF;

END $$;