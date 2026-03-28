-- ---------------------------
-- RENAME FKS
-- ---------------------------
DO $$
DECLARE
    r RECORD;
    new_name TEXT;
BEGIN
    FOR r IN
        SELECT
            tc.table_schema,
            tc.table_name,
            kcu.column_name AS fk_column,
            ccu.table_name AS referenced_table,
            COUNT(*) OVER (
                PARTITION BY tc.table_schema,
                             tc.table_name,
                             ccu.table_name
            ) AS fk_count
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
    LOOP

        new_name := r.referenced_table || '_id';

        -- skip semantic duplicates
        IF r.fk_count > 1 THEN
            CONTINUE;
        END IF;

        -- already correct
        IF r.fk_column = new_name THEN
            CONTINUE;
        END IF;

        -- avoid collision
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = r.table_schema
              AND table_name = r.table_name
              AND column_name = new_name
        ) THEN
            CONTINUE;
        END IF;

        EXECUTE format(
            'ALTER TABLE %I.%I RENAME COLUMN %I TO %I;',
            r.table_schema,
            r.table_name,
            r.fk_column,
            new_name
        );

        RAISE NOTICE
            'FK renamed: %.% (% → %)',
            r.table_schema,
            r.table_name,
            r.fk_column,
            new_name;

    END LOOP;
END $$;