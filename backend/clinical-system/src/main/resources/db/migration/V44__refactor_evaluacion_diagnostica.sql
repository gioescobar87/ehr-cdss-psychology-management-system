-------------------------------
-- REMOVE DUPLICATE COLUMN
-------------------------------

ALTER TABLE evaluacion_diagnostica
DROP COLUMN diagnostico_id;


-------------------------------
-- EVALUACIÓN DIAGNÓSTICA
-------------------------------

ALTER TABLE evaluacion_diagnostica
RENAME COLUMN id_diagnostico_sugerido
TO diagnostico_sugerido_id;

ALTER TABLE evaluacion_diagnostica
RENAME COLUMN id_diagnostico_seleccionado
TO diagnostico_final_id;

ALTER TABLE evaluacion_diagnostica
RENAME COLUMN coincide_diagnostico
TO diagnostico_confirmado;

ALTER TABLE evaluacion_diagnostica
ADD COLUMN fecha_inferencia TIMESTAMP;

ALTER TABLE evaluacion_diagnostica
ADD COLUMN tiempo_inferencia_ms INTEGER;


-------------------------------
-- DROP EVALUACIÓN DIAGNÓSTICA BITÁCORA
-------------------------------

DROP TABLE evaluacion_diagnostica_bitacora
