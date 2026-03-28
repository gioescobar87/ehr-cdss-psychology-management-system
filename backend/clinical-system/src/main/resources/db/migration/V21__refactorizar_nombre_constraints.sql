DO $$
DECLARE
    r RECORD;
    new_name TEXT;
BEGIN

-- =====================
-- PRIMARY KEYS
-- =====================
FOR r IN
    SELECT con.conname, rel.relname AS table_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname='public'
      AND con.contype='p'
      AND rel.relname <> 'flyway_schema_history'
    ORDER BY rel.relname
LOOP
    new_name := 'pk_' || r.table_name;

    IF r.conname <> new_name THEN
        EXECUTE format(
            'ALTER TABLE %I RENAME CONSTRAINT %I TO %I',
            r.table_name,
            r.conname,
            new_name
        );
    END IF;
END LOOP;


-- =====================
-- FOREIGN KEYS
-- =====================
FOR r IN
    SELECT
        con.conname,
        rel.relname AS table_name,
        array_to_string(
            ARRAY(
                SELECT att.attname
                FROM unnest(con.conkey) k
                JOIN pg_attribute att
                  ON att.attrelid=con.conrelid
                 AND att.attnum=k
            ),
            '_'
        ) AS columns
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname='public'
      AND con.contype='f'
      AND rel.relname <> 'flyway_schema_history'
    ORDER BY rel.relname
LOOP
    new_name := 'fk_' || r.table_name || '_' || r.columns;

    IF r.conname <> new_name THEN
        EXECUTE format(
            'ALTER TABLE %I RENAME CONSTRAINT %I TO %I',
            r.table_name,
            r.conname,
            new_name
        );
    END IF;
END LOOP;

END $$;