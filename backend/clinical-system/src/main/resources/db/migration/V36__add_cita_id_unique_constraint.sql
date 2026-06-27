ALTER TABLE cancelacion
ADD CONSTRAINT uk_cancelacion_cita
UNIQUE (cita_id);