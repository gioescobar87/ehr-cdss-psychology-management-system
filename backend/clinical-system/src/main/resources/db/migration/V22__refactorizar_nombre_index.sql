DO $$
DECLARE
    r RECORD;
    new_name TEXT;
BEGIN
FOR r IN
    SELECT
        idx.relname AS index_name,
        tbl.relname AS table_name,
        array_to_string(
            ARRAY(
                SELECT att.attname
                FROM unnest(i.indkey) k
                JOIN pg_attribute att
                  ON att.attrelid=tbl.oid
                 AND att.attnum=k
                WHERE k > 0
            ),
            '_'
        ) AS columns
    FROM pg_index i
    JOIN pg_class idx ON idx.oid = i.indexrelid
    JOIN pg_class tbl ON tbl.oid = i.indrelid
    JOIN pg_namespace nsp ON nsp.oid = tbl.relnamespace
    WHERE nsp.nspname='public'
      AND NOT i.indisprimary
      AND tbl.relname <> 'flyway_schema_history'
    ORDER BY tbl.relname
LOOP
    new_name := 'idx_' || r.table_name || '_' || r.columns;

    IF r.index_name <> new_name THEN
        EXECUTE format(
            'ALTER INDEX %I RENAME TO %I',
            r.index_name,
            new_name
        );
    END IF;
END LOOP;

END $$;