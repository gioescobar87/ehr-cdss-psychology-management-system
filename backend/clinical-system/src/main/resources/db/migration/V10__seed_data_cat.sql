-- =========================================
-- 1. Estado
-- =========================================

INSERT INTO estado (nombre_estado, descripcion) VALUES
('ACTIVO', 'Registro disponible para uso en el sistema'),
('INACTIVO', 'Registro deshabilitado o archivado'),
('ELIMINADO', 'Registro marcado como eliminado lógicamente');


-- =========================================
-- 2. Rol
-- =========================================

INSERT INTO rol (nombre_rol, descripcion, id_estado)
VALUES
('ADMINISTRADOR', 'Administrador del sistema con control total',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('PSICOLOGO', 'Profesional que gestiona pacientes y sesiones',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('COORDINADOR', 'Supervisor de la unidad psicológica',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 3. Permiso
-- =========================================

INSERT INTO permiso (nombre_permiso, descripcion, id_estado)
VALUES
('GESTION_USUARIOS', 'Crear y modificar usuarios del sistema',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('GESTION_PACIENTES', 'Registrar y actualizar pacientes',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('REGISTRO_SESIONES', 'Registrar sesiones clínicas',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('GESTION_CITAS', 'Programar y modificar citas',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('VER_REPORTES', 'Acceso a reportes del sistema',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 4. Categoria_Diagnostica
-- =========================================

INSERT INTO categoria_diagnostica (nombre_categoria, descripcion, id_estado)
VALUES
('TRASTORNOS_DEPRESIVOS', 'Trastornos relacionados con depresión clínica',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('TRASTORNOS_ANSIEDAD', 'Trastornos relacionados con ansiedad',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('TRASTORNOS_CONDUCTA_INFANTO_JUVENIL',
 'Trastornos conductuales en población infantil y adolescente',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 5. Nivel_Consistencia
-- =========================================

INSERT INTO nivel_consistencia (nombre_nivel, descripcion, id_estado)
VALUES
('ALTO', 'Alta coincidencia entre diagnóstico del sistema y del profesional',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('MEDIO', 'Coincidencia parcial entre diagnóstico del sistema y del profesional',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('BAJO', 'Coincidencia baja entre diagnóstico del sistema y del profesional',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('INCOMPATIBLE', 'Diagnóstico del sistema incompatible con el seleccionado',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 6. Tipo_Prueba
-- =========================================

INSERT INTO tipo_prueba (nombre_tipo, descripcion, id_estado)
VALUES
('PARAMETRIZABLE', 'Prueba psicológica con parámetros cuantificables',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('EXTERNA', 'Prueba aplicada externamente y registrada en el sistema',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('PROYECTIVA', 'Prueba interpretativa basada en análisis cualitativo',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 7. Tipo_Riesgo
-- =========================================

INSERT INTO tipo_riesgo (nombre_tipo, descripcion, id_estado)
VALUES
('RIESGO_SUICIDA', 'Evaluación de riesgo de suicidio',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('RIESGO_VIOLENCIA', 'Evaluación de riesgo de violencia hacia otros',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('RIESGO_AUTOLESION', 'Evaluación de conductas de autolesión',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 8. Nivel_Riesgo
-- =========================================

INSERT INTO nivel_riesgo (nombre_nivel, descripcion, id_estado)
VALUES
('BAJO', 'Riesgo bajo identificado',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('MODERADO', 'Riesgo moderado identificado',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('ALTO', 'Riesgo alto identificado',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('CRITICO', 'Riesgo crítico que requiere intervención inmediata',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 9. Estado_Cita
-- =========================================

INSERT INTO estado_cita (nombre_estado, descripcion, id_estado)
VALUES
('PROGRAMADA', 'Cita programada pendiente de realizarse',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('CONFIRMADA', 'Cita confirmada por el paciente',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('CANCELADA', 'Cita cancelada',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('COMPLETADA', 'Cita realizada exitosamente',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('NO_ASISTIO', 'Paciente no asistió a la cita',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 10. Condicion_Medica
-- =========================================

INSERT INTO condicion_medica (nombre_condicion, codigo_referencia, descripcion, id_estado)
VALUES
('DEPRESION MAYOR', 'DSM-5 F32', 'Trastorno depresivo mayor',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('TRASTORNO DE ANSIEDAD GENERALIZADA', 'DSM-5 F41.1',
 'Ansiedad persistente y excesiva',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('TRASTORNO DE PANICO', 'DSM-5 F41.0',
 'Episodios recurrentes de pánico',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('TRASTORNO DE CONDUCTA', 'DSM-5 F91',
 'Patrones persistentes de comportamiento antisocial',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));

 -- =========================================
-- 11. Parentesco
-- =========================================

INSERT INTO parentesco (nombre_parentesco, id_estado)
VALUES
('PADRE', (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('MADRE', (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('HERMANO', (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('HERMANA', (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('ABUELO', (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('ABUELA', (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('TUTOR LEGAL', (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('OTRO', (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 12. Medicamento
-- =========================================

INSERT INTO medicamento (nombre_generico, nombre_comercial, descripcion, id_estado)
VALUES
('Fluoxetina', 'Prozac', 'Antidepresivo ISRS utilizado en depresión y ansiedad',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('Sertralina', 'Zoloft', 'Antidepresivo ISRS utilizado en trastornos de ansiedad',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('Escitalopram', 'Lexapro', 'Antidepresivo ISRS para depresión y ansiedad',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('Alprazolam', 'Xanax', 'Ansiolítico utilizado en crisis de ansiedad',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 13. Tipo_Sustancia_Alergena
-- =========================================

INSERT INTO tipo_sustancia_alergena (nombre_tipo, descripcion, id_estado)
VALUES
('MEDICAMENTO', 'Sustancias farmacológicas que generan alergia',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('ALIMENTO', 'Productos alimenticios que generan reacción alérgica',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('AMBIENTAL', 'Sustancias presentes en el ambiente como polvo o polen',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('QUIMICA', 'Sustancias químicas de uso doméstico o industrial',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 14. Sustancia_Alergena
-- =========================================

INSERT INTO sustancia_alergena (nombre_sustancia, id_tipo_sustancia, descripcion, id_estado)
VALUES
('Penicilina',
 (SELECT id_tipo_sustancia FROM tipo_sustancia_alergena WHERE nombre_tipo='MEDICAMENTO'),
 'Alergia común a antibióticos tipo penicilina',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('Maní',
 (SELECT id_tipo_sustancia FROM tipo_sustancia_alergena WHERE nombre_tipo='ALIMENTO'),
 'Alergia severa al maní',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('Polen',
 (SELECT id_tipo_sustancia FROM tipo_sustancia_alergena WHERE nombre_tipo='AMBIENTAL'),
 'Alergia estacional al polen',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('Latex',
 (SELECT id_tipo_sustancia FROM tipo_sustancia_alergena WHERE nombre_tipo='QUIMICA'),
 'Reacción alérgica al látex',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 15. Tipo_Intervencion
-- =========================================

INSERT INTO tipo_intervencion (nombre_tipo, descripcion, id_estado)
VALUES
('TERAPIA_COGNITIVO_CONDUCTUAL',
 'Intervención basada en terapia cognitivo conductual',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('TERAPIA_FAMILIAR',
 'Intervención terapéutica con miembros de la familia',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('PSICOEDUCACION',
 'Intervención enfocada en educación psicológica del paciente',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('INTERVENCION_EN_CRISIS',
 'Intervención inmediata ante situaciones críticas',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 16. Tipo_Sesion
-- =========================================

INSERT INTO tipo_sesion (nombre_tipo, descripcion, id_estado)
VALUES
('EVALUACION_INICIAL',
 'Primera sesión para evaluar al paciente',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('SEGUIMIENTO',
 'Sesión de seguimiento terapéutico',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('SESION_TERAPEUTICA',
 'Sesión terapéutica regular',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('SESION_DE_CRISIS',
 'Sesión destinada a manejar crisis psicológicas',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 17. Estado_Civil
-- =========================================

INSERT INTO estado_civil (nombre_estado_civil, descripcion, id_estado)
VALUES
('SOLTERO', 'Persona que no ha contraído matrimonio',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('CASADO', 'Persona casada legalmente',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('DIVORCIADO', 'Persona divorciada legalmente',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('VIUDO', 'Persona cuyo cónyuge ha fallecido',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 18. Nivel_Escolaridad
-- =========================================

INSERT INTO nivel_escolaridad (nombre_nivel, descripcion, id_estado)
VALUES
('PRIMARIA',
 'Educación primaria completa o incompleta',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('SECUNDARIA',
 'Educación secundaria completa o incompleta',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('BACHILLERATO',
 'Nivel medio completo',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('UNIVERSITARIO',
 'Educación universitaria en curso o finalizada',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('POSGRADO',
 'Estudios de maestría o doctorado',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));