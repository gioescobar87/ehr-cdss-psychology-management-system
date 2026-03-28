-- ---------------------------
-- FAST-FAIL LOCK PROTECTION
-- ---------------------------

---SET lock_timeout = '10s';
---SET statement_timeout = '0';

-- ---------------------------
-- RENAME PKS
-- ---------------------------
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT
            tc.table_schema,
            tc.table_name,
            kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name <> 'flyway_schema_history'
          AND kcu.column_name <> 'id'
    LOOP

        -- skip if "id" already exists
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = r.table_schema
              AND table_name = r.table_name
              AND column_name = 'id'
        ) THEN
            RAISE NOTICE
                'Skipped %.% (% → id) because id already exists',
                r.table_schema,
                r.table_name,
                r.column_name;
            CONTINUE;
        END IF;

        EXECUTE format(
            'ALTER TABLE %I.%I RENAME COLUMN %I TO id;',
            r.table_schema,
            r.table_name,
            r.column_name
        );

        RAISE NOTICE
            'PK renamed: %.% (% → id)',
            r.table_schema,
            r.table_name,
            r.column_name;
    END LOOP;
END $$;