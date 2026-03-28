DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT
            table_schema,
            table_name,
            column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND column_name LIKE 'nombre\_%' ESCAPE '\'
          AND table_name <> 'medicamento'
        ORDER BY table_name
    LOOP

        -- Skip if column already named "nombre"
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = r.table_schema
              AND table_name = r.table_name
              AND column_name = 'nombre'
        ) THEN
            RAISE NOTICE
                'Skipped %.% (% → nombre) because column already exists',
                r.table_schema,
                r.table_name,
                r.column_name;
            CONTINUE;
        END IF;

        EXECUTE format(
            'ALTER TABLE %I.%I RENAME COLUMN %I TO nombre',
            r.table_schema,
            r.table_name,
            r.column_name
        );

        RAISE NOTICE
            'Renamed %.% (% → nombre)',
            r.table_schema,
            r.table_name,
            r.column_name;

    END LOOP;
END $$;