-- ============================================================
-- RENAME '/gestion-clinica' PREFIX
-- ============================================================

UPDATE opcion
SET ruta_frontend = REPLACE(ruta_frontend, '/gestion-clinica', '')
WHERE ruta_frontend like '/gestion-clinica%';