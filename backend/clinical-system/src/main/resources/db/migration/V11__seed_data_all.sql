-- =========================================
-- 19. Usuario
-- =========================================

INSERT INTO usuario (username, password_hash, nombre, apellido, correo, id_estado)
VALUES
('admin',
 '$2a$10$examplehashadmin',
 'Administrador',
 'Sistema',
 'admin@sistema.local',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('psicologo1',
 '$2a$10$examplehashpsicologo',
 'Ana',
 'Martinez',
 'ana.martinez@sistema.local',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('psicologo2',
 '$2a$10$examplehashpsicologo2',
 'Carlos',
 'Ramirez',
 'carlos.ramirez@sistema.local',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 20. Usuario_Rol
-- =========================================

INSERT INTO usuario_rol (id_usuario, id_rol)
VALUES
(
 (SELECT id_usuario FROM usuario WHERE username='admin'),
 (SELECT id_rol FROM rol WHERE nombre_rol='ADMINISTRADOR')
),

(
 (SELECT id_usuario FROM usuario WHERE username='psicologo1'),
 (SELECT id_rol FROM rol WHERE nombre_rol='PSICOLOGO')
),

(
 (SELECT id_usuario FROM usuario WHERE username='psicologo2'),
 (SELECT id_rol FROM rol WHERE nombre_rol='PSICOLOGO')
);

-- =========================================
-- 21. Rol_Permiso
-- =========================================

INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r
JOIN permiso p ON r.nombre_rol = 'ADMINISTRADOR';

INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r
JOIN permiso p 
ON p.nombre_permiso IN ('GESTION_PACIENTES','REGISTRO_SESIONES','GESTION_CITAS','VER_REPORTES')
WHERE r.nombre_rol = 'PSICOLOGO';


-- =========================================
-- 22. Paciente
-- =========================================

INSERT INTO paciente (
nombre, apellido, dpi, fecha_nacimiento, sexo,
direccion, telefono, id_estado_civil, id_nivel_escolaridad,
ocupacion, id_estado
)
VALUES
(
'Luis','Gomez','1234567890101','2005-04-12','M',
'Zona 4, Ciudad de Guatemala','5551-2233',
(SELECT id_estado_civil FROM estado_civil WHERE nombre_estado_civil='SOLTERO'),
(SELECT id_nivel_escolaridad FROM nivel_escolaridad WHERE nombre_nivel='SECUNDARIA'),
'Estudiante',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')
),

(
'Maria','Lopez','2234567890101','1998-09-03','F',
'San Jose Pinula','5554-9988',
(SELECT id_estado_civil FROM estado_civil WHERE nombre_estado_civil='SOLTERO'),
(SELECT id_nivel_escolaridad FROM nivel_escolaridad WHERE nombre_nivel='UNIVERSITARIO'),
'Estudiante universitaria',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')
),

(
'Jose','Ramirez','3234567890101','1985-01-20','M',
'Villa Nueva','5553-1212',
(SELECT id_estado_civil FROM estado_civil WHERE nombre_estado_civil='CASADO'),
(SELECT id_nivel_escolaridad FROM nivel_escolaridad WHERE nombre_nivel='BACHILLERATO'),
'Comerciante',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')
);


-- =========================================
-- 23. Paciente_Asignacion
-- =========================================

INSERT INTO paciente_asignacion (
id_paciente,
id_psicologo,
id_usuario_cambio,
motivo_asignacion
)
VALUES
(
(SELECT id_paciente FROM paciente WHERE dpi='1234567890101'),
(SELECT id_usuario FROM usuario WHERE username='psicologo1'),
(SELECT id_usuario FROM usuario WHERE username='admin'),
'Asignación inicial de paciente'
),

(
(SELECT id_paciente FROM paciente WHERE dpi='2234567890101'),
(SELECT id_usuario FROM usuario WHERE username='psicologo1'),
(SELECT id_usuario FROM usuario WHERE username='admin'),
'Asignación inicial'
),

(
(SELECT id_paciente FROM paciente WHERE dpi='3234567890101'),
(SELECT id_usuario FROM usuario WHERE username='psicologo2'),
(SELECT id_usuario FROM usuario WHERE username='admin'),
'Asignación inicial'
);


-- =========================================
-- Historial_Medico
-- =========================================

INSERT INTO historial_medico (
id_paciente,
id_condicion,
fecha_diagnostico,
tratamiento_actual,
observaciones,
id_estado
)
VALUES
(
(SELECT id_paciente FROM paciente WHERE dpi='2234567890101'),
(SELECT id_condicion FROM condicion_medica WHERE nombre_condicion='DEPRESION MAYOR'),
'2023-03-10',
'Terapia psicológica semanal',
'Paciente con episodios recurrentes',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')
),

(
(SELECT id_paciente FROM paciente WHERE dpi='3234567890101'),
(SELECT id_condicion FROM condicion_medica WHERE nombre_condicion='TRASTORNO DE ANSIEDAD GENERALIZADA'),
'2022-11-02',
'Tratamiento combinado psicoterapia + medicación',
NULL,
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')
);


-- =========================================
-- 24. Historial_Familiar
-- =========================================

INSERT INTO historial_familiar (
id_paciente,
id_condicion,
id_parentesco,
observaciones,
id_estado
)
VALUES
(
(SELECT id_paciente FROM paciente WHERE dpi='2234567890101'),
(SELECT id_condicion FROM condicion_medica WHERE nombre_condicion='DEPRESION MAYOR'),
(SELECT id_parentesco FROM parentesco WHERE nombre_parentesco='MADRE'),
'Antecedentes depresivos maternos',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')
);


-- =========================================
-- 25. Paciente_Medicamento
-- =========================================

INSERT INTO paciente_medicamento (
id_paciente,
id_medicamento,
dosis,
frecuencia,
via_administracion,
fecha_inicio,
prescrito_por,
id_estado
)
VALUES
(
(SELECT id_paciente FROM paciente WHERE dpi='3234567890101'),
(SELECT id_medicamento FROM medicamento WHERE LOWER(nombre_generico)='sertralina'),
'50mg',
'1 vez al día',
'Oral',
'2024-01-10',
'Psiquiatra externo',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')
);


-- =========================================
-- 26. Nivel_Severidad_Alergias
-- =========================================

INSERT INTO nivel_severidad_alergias (nombre, descripcion, id_estado)
VALUES
('LEVE','Reacción leve sin riesgo sistémico',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('MODERADA','Reacción que requiere medicación',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('SEVERA','Reacción potencialmente peligrosa',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('ANAFILACTICA','Reacción grave que requiere atención inmediata',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =========================================
-- 27. Paciente_Alergia
-- =========================================

INSERT INTO paciente_alergia (
id_paciente,
id_sustancia,
id_nivel_severidad_alergias,
tipo_reaccion,
observaciones,
id_estado
)
VALUES
(
(SELECT id_paciente FROM paciente WHERE dpi='1234567890101'),
(SELECT id_sustancia FROM sustancia_alergena WHERE LOWER(nombre_sustancia)='penicilina'),
(SELECT id_nivel_severidad_alergias FROM nivel_severidad_alergias WHERE nombre='MODERADA'),
'Erupción cutánea',
'Paciente reporta alergia desde la infancia',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')
);


-- =========================================
-- 28. Contacto_Emergencia
-- =========================================

INSERT INTO contacto_emergencia (
id_paciente,
nombre,
id_parentesco,
telefono,
direccion,
id_estado
)
VALUES
(
(SELECT id_paciente FROM paciente WHERE dpi='1234567890101'),
'Ana Gomez',
(SELECT id_parentesco FROM parentesco WHERE nombre_parentesco='MADRE'),
'5558-2222',
'Zona 4, Ciudad de Guatemala',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')
);


-- =========================================
-- 29. Sesion
-- =========================================

INSERT INTO sesion (
id_paciente,
id_psicologo,
id_tipo_sesion,
fecha_sesion,
observaciones_generales,
id_estado
)
VALUES
(
(SELECT id_paciente FROM paciente WHERE dpi='2234567890101'),
(SELECT id_usuario FROM usuario WHERE username='psicologo1'),
(SELECT id_tipo_sesion FROM tipo_sesion WHERE nombre_tipo='EVALUACION_INICIAL'),
NOW() - INTERVAL '10 days',
'Evaluación inicial por síntomas depresivos',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')
),

(
(SELECT id_paciente FROM paciente WHERE dpi='2234567890101'),
(SELECT id_usuario FROM usuario WHERE username='psicologo1'),
(SELECT id_tipo_sesion FROM tipo_sesion WHERE nombre_tipo='SEGUIMIENTO'),
NOW() - INTERVAL '3 days',
'Seguimiento terapéutico',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')
);


-- =========================================
-- 30. Nota_Sesion
-- =========================================

INSERT INTO nota_sesion (
id_sesion,
id_usuario,
contenido,
tipo_nota
)
VALUES
(
(SELECT id_sesion FROM sesion ORDER BY id_sesion LIMIT 1),
(SELECT id_usuario FROM usuario WHERE username='psicologo1'),
'Paciente reporta mejoría moderada en estado de ánimo.',
'NOTA_CLINICA'
);

-- =========================================
-- 31. Diagnostico
-- =========================================

INSERT INTO diagnostico (id_categoria, codigo_dsm, nombre, descripcion, id_estado) VALUES
(1, 'F32.0', 'Episodio Depresivo Leve', 'Estado depresivo leve según DSM-5-TR', 1),
(1, 'F32.1', 'Episodio Depresivo Moderado', 'Estado depresivo moderado', 1),
(2, 'F41.1', 'Trastorno de Ansiedad Generalizada', 'Ansiedad persistente y excesiva', 1),
(3, 'F91.3', 'Trastorno Negativista Desafiante', 'Patrón persistente de comportamiento desafiante', 1);


-- =========================================
-- 32. Paciente_Diagnostico
-- =========================================

INSERT INTO paciente_diagnostico
(id_paciente, id_diagnostico, id_sesion, fecha_diagnostico, id_estado)
VALUES
(1, 1, 1, CURRENT_DATE, 1),
(2, 3, 2, CURRENT_DATE, 1);


-- =========================================
-- 33. Plan_Tratamiento
-- =========================================

INSERT INTO plan_tratamiento
(id_paciente_diagnostico, descripcion_general, fecha_inicio, fecha_fin, id_estado)
VALUES
(1, 'Plan terapéutico basado en terapia cognitivo conductual', CURRENT_DATE, NULL, 1),
(2, 'Intervención psicoterapéutica enfocada en regulación emocional', CURRENT_DATE, NULL, 1);


-- =========================================
-- 34. Objetivo_Terapia
-- =========================================

INSERT INTO objetivo_terapia
(id_plan, descripcion, fecha_inicio, fecha_meta, id_estado)
VALUES
(1, 'Reducir síntomas depresivos y mejorar funcionamiento diario', CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 1),
(1, 'Incrementar actividades reforzantes', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 1),
(2, 'Disminuir niveles de ansiedad', CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 1);


-- =========================================
-- 35. Seguimiento_Objetivo
-- =========================================

INSERT INTO seguimiento_objetivo
(id_objetivo, id_sesion, descripcion_avance)
VALUES
(1, 1, 'Paciente reporta ligera mejoría en estado de ánimo'),
(2, 1, 'Se inicia registro de actividades agradables'),
(3, 2, 'Se trabajan técnicas de respiración');


-- =========================================
-- 36. Intervencion
-- =========================================

INSERT INTO intervencion
(id_tipo_intervencion, nombre_intervencion, descripcion, id_estado)
VALUES
(1, 'Reestructuración Cognitiva', 'Identificación y modificación de pensamientos disfuncionales', 1),
(1, 'Activación Conductual', 'Incremento de actividades reforzantes', 1),
(2, 'Entrenamiento en Respiración', 'Técnicas de respiración para manejo de ansiedad', 1);


-- =========================================
-- 37. Sesion_Intervencion
-- =========================================

INSERT INTO sesion_intervencion
(id_sesion, id_intervencion)
VALUES
(1, 1),
(1, 2),
(2, 3);


-- =========================================
-- 38. Evaluacion_Riesgo
-- =========================================

INSERT INTO evaluacion_riesgo
(id_paciente, id_sesion, id_tipo_riesgo, id_nivel_riesgo, observaciones)
VALUES
(1, 1, 1, 2, 'Paciente con ideación pasiva ocasional'),
(2, 2, 2, 1, 'Sin indicadores de riesgo actuales');


-- =========================================
-- 39. Arbol_Diagnostico
-- =========================================

INSERT INTO arbol_diagnostico
(codigo_arbol, version, nombre, id_categoria_diagnostica, id_estado)
VALUES
('DEPRESION_ADULTO', 1, 'Árbol diagnóstico depresión adulto', 1, 1),
('ANSIEDAD_GENERAL', 1, 'Árbol diagnóstico ansiedad', 2, 1);


-- =========================================
-- 40. Nodo_Arbol
-- =========================================

INSERT INTO nodo_arbol
(id_arbol, id_nodo_padre, tipo_nodo, descripcion, es_terminal, orden, id_estado)
VALUES
(1, NULL, 'PREGUNTA', '¿Estado de ánimo deprimido la mayor parte del día?', FALSE, 1, 1),
(1, 1, 'PREGUNTA', '¿Pérdida de interés o placer?', FALSE, 2, 1),
(1, 2, 'DIAGNOSTICO', 'Posible episodio depresivo', TRUE, 3, 1),

(2, NULL, 'PREGUNTA', '¿Preocupación excesiva durante más de 6 meses?', FALSE, 1, 1),
(2, 4, 'DIAGNOSTICO', 'Posible ansiedad generalizada', TRUE, 2, 1);


-- =========================================
-- 41. Regla_Nodo
-- =========================================

INSERT INTO regla_nodo
(id_nodo_origen, id_nodo_destino, campo_evaluado, operador, valor_comparacion, ponderacion, id_estado)
VALUES
(1, 2, 'estado_animo_deprimido', '=', 'true', 0.8, 1),
(2, 3, 'anhedonia', '=', 'true', 0.9, 1),
(4, 5, 'preocupacion_excesiva', '=', 'true', 0.85, 1);


-- =========================================
-- 42. Evaluacion_Diagnostica
-- =========================================

INSERT INTO evaluacion_diagnostica
(id_sesion, id_arbol, id_diagnostico_seleccionado, id_diagnostico_sugerido, id_usuario,
 id_nivel_consistencia, porcentaje_coincidencia, observaciones_sistema, id_estado)
VALUES
(1, 1, 1, 1, 1, 2, 92.50, 'Alta coincidencia entre síntomas registrados y árbol diagnóstico', 1),

(2, 2, 3, 3, 1, 2, 88.00, 'Sistema sugiere ansiedad generalizada con alta consistencia', 1);

-- =========================================
-- 43. Prueba_Psicologica
-- =========================================

INSERT INTO prueba_psicologica
(id_paciente, id_sesion, id_tipo_prueba, nombre_prueba, fecha_aplicacion, archivo_adjunto, id_estado)
VALUES
(1, 1, 1, 'Inventario de Depresión de Beck (BDI-II)', CURRENT_DATE, NULL, 1),
(2, 2, 1, 'Inventario de Ansiedad de Beck (BAI)', CURRENT_DATE, NULL, 1),
(1, NULL, 2, 'Test de la Figura Humana', CURRENT_DATE, NULL, 1);



-- =========================================
-- 44. Resultado_Prueba
-- =========================================

INSERT INTO resultado_prueba
(id_prueba, parametro, valor, unidad_medida, observaciones, id_estado)
VALUES
(1, 'Puntaje Total', '21', 'puntos', 'Indica depresión moderada', 1),
(1, 'Nivel Clínico', 'Moderado', NULL, NULL, 1),

(2, 'Puntaje Total', '17', 'puntos', 'Ansiedad leve a moderada', 1),

(3, 'Indicadores emocionales', 'Presencia moderada', NULL, 'Rasgos de inseguridad observados', 1);



-- =========================================
-- 45. Interpretacion_Prueba
-- =========================================

INSERT INTO interpretacion_prueba
(id_prueba, id_usuario, descripcion_interpretacion, id_estado)
VALUES
(1, 1, 'Los resultados sugieren presencia de síntomas depresivos moderados que requieren intervención psicoterapéutica.', 1),

(2, 1, 'La puntuación indica ansiedad leve a moderada; se recomienda intervención cognitivo conductual.', 1),

(3, 1, 'El dibujo sugiere indicadores emocionales compatibles con inseguridad y ansiedad.', 1);



-- =========================================
-- 46. Cita
-- =========================================

INSERT INTO cita
(id_paciente, id_usuario, fecha_hora_inicio, fecha_hora_fin, motivo, observaciones, id_estado)
VALUES
(1, 1, CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '2 days 1 hour',
 'Seguimiento terapéutico', 'Evaluar evolución del estado de ánimo', 1),

(2, 1, CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '3 days 1 hour',
 'Evaluación clínica inicial', 'Primera sesión diagnóstica', 1),

(1, 1, CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '7 days 1 hour',
 'Aplicación de prueba psicológica', 'Aplicación de pruebas complementarias', 1);



-- =========================================
-- 47. Cancelacion
-- =========================================

INSERT INTO cancelacion
(id_cita, id_usuario, motivo_cancelacion, id_estado)
VALUES
(3, 1, 'Paciente solicitó reprogramación por motivos personales', 1);



-- =========================================
-- 48. Bitacora_Auditoria
-- =========================================

INSERT INTO bitacora_auditoria
(id_usuario, entidad_afectada, id_registro_afectado, tipo_operacion, detalle_cambios, id_estado)
VALUES
(1, 'paciente', 1, 'INSERT',
 '{"accion":"Creación de expediente clínico"}', 1),

(1, 'diagnostico', 1, 'INSERT',
 '{"diagnostico":"Episodio Depresivo Moderado"}', 1),

(1, 'plan_tratamiento', 1, 'INSERT',
 '{"plan":"Inicio de tratamiento cognitivo conductual"}', 1),

(1, 'cita', 1, 'INSERT',
 '{"accion":"Programación de cita"}', 1);



-- =========================================
-- 49. Bitacora_Acceso
-- =========================================

INSERT INTO bitacora_acceso
(id_usuario, id_paciente, tipo_acceso, id_estado)
VALUES
(1, 1, 'LECTURA_EXPEDIENTE', 1),
(1, 1, 'ACTUALIZACION_EXPEDIENTE', 1),
(1, 2, 'LECTURA_EXPEDIENTE', 1),
(1, NULL, 'LOGIN_SISTEMA', 1);