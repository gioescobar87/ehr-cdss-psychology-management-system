ALTER TABLE cancelacion
DROP CONSTRAINT IF EXISTS fk_cancelacion_estado;

ALTER TABLE cancelacion
DROP COLUMN estado_id;