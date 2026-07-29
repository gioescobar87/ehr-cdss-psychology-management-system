-- porcentaje_coincidencia -> coincide_diagnostico
ALTER TABLE evaluacion_diagnostica
RENAME COLUMN porcentaje_coincidencia TO coincide_diagnostico;

ALTER TABLE evaluacion_diagnostica
DROP CONSTRAINT chk_porcentaje;

ALTER TABLE evaluacion_diagnostica
ALTER COLUMN coincide_diagnostico TYPE BOOLEAN
USING FALSE;

ALTER TABLE evaluacion_diagnostica
ALTER COLUMN coincide_diagnostico SET DEFAULT FALSE;

ALTER TABLE evaluacion_diagnostica
ALTER COLUMN coincide_diagnostico SET NOT NULL;


-- nivel_consistencia_id -> version_arbol
ALTER TABLE evaluacion_diagnostica
DROP CONSTRAINT fk_evaluacion_diagnostica_nivel_consistencia_id;

ALTER TABLE evaluacion_diagnostica
RENAME COLUMN nivel_consistencia_id TO version_arbol;

ALTER TABLE evaluacion_diagnostica
ALTER COLUMN version_arbol TYPE INTEGER
USING 1;

ALTER TABLE evaluacion_diagnostica
ALTER COLUMN version_arbol SET DEFAULT 1;

ALTER TABLE evaluacion_diagnostica
ALTER COLUMN version_arbol SET NOT NULL;

ALTER TABLE evaluacion_diagnostica
RENAME CONSTRAINT evaluacion_diagnostica_id_nivel_consistencia_not_null
TO evaluacion_diagnostica_version_arbol_not_null;