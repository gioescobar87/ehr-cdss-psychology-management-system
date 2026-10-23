-- CLEAN DIAGNOSIS
DELETE FROM evaluacion_diagnostica
WHERE id > 0;

DELETE FROM paciente_diagnostico
WHERE id > 0;

-- ADD INFERENCE EXPLANATION
ALTER TABLE public.evaluacion_diagnostica
ADD COLUMN IF NOT EXISTS observacion TEXT NOT NULL;

-- REMOVE UNNECESSARY OPTIONS
DELETE FROM opcion WHERE nombre = 'Tipos de prueba';
DELETE FROM opcion WHERE nombre = 'Niveles de consistencia';

-- REMOVE UNNECESSARY TABLE
DROP TABLE nivel_consistencia;