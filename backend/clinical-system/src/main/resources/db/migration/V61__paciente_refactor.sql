ALTER TABLE paciente 
    ALTER COLUMN dpi TYPE character varying(150);


ALTER TABLE paciente 
    ALTER COLUMN telefono TYPE character varying(150);

UPDATE opcion
SET nombre = 'Agenda'
WHERE nombre = 'Cita';

ALTER TABLE paciente
    ADD COLUMN refiere character varying(150) NULL;