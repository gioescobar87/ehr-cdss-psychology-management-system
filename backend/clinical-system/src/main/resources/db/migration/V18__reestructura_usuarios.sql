-- =============================
-- CREACIÓN USUARIOS PRUEBA
-- =============================
INSERT INTO usuario
(username,password_hash,nombre,apellido,correo,id_estado)
VALUES

('admin1','$2a$10$WZjb4KElAnP1zn7YsRhjJ.YcJMJTUA1RaWldbnt9iRUA33IgvRG2O',
'Carlos','Admin','admin1@clinica.com',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('admin2','$2a$10$WZjb4KElAnP1zn7YsRhjJ.YcJMJTUA1RaWldbnt9iRUA33IgvRG2O',
'Ana','Admin','admin2@clinica.com',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('coord1','$2a$10$WZjb4KElAnP1zn7YsRhjJ.YcJMJTUA1RaWldbnt9iRUA33IgvRG2O',
'Luis','Coordinador','coord1@clinica.com',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('coord2','$2a$10$WZjb4KElAnP1zn7YsRhjJ.YcJMJTUA1RaWldbnt9iRUA33IgvRG2O',
'Maria','Coordinador','coord2@clinica.com',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('psico1','$2a$10$WZjb4KElAnP1zn7YsRhjJ.YcJMJTUA1RaWldbnt9iRUA33IgvRG2O',
'Jose','Psicologo','psico1@clinica.com',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('psico2','$2a$10$WZjb4KElAnP1zn7YsRhjJ.YcJMJTUA1RaWldbnt9iRUA33IgvRG2O',
'Elena','Psicologo','psico2@clinica.com',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('recep1','$2a$10$WZjb4KElAnP1zn7YsRhjJ.YcJMJTUA1RaWldbnt9iRUA33IgvRG2O',
'Laura','Recepcion','recep1@clinica.com',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

('recep2','$2a$10$WZjb4KElAnP1zn7YsRhjJ.YcJMJTUA1RaWldbnt9iRUA33IgvRG2O',
'Pedro','Recepcion','recep2@clinica.com',
(SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));


-- =============================
-- ASIGNACIÓN ROLES PRUEBA
-- =============================

INSERT INTO usuario_rol (id_usuario,id_rol)
SELECT u.id_usuario, r.id_rol
FROM usuario u
JOIN rol r ON r.nombre_rol='ADMIN'
WHERE u.username IN ('admin1','admin2');

INSERT INTO usuario_rol (id_usuario,id_rol)
SELECT u.id_usuario, r.id_rol
FROM usuario u
JOIN rol r ON r.nombre_rol='COORDINADOR'
WHERE u.username IN ('coord1','coord2');

INSERT INTO usuario_rol (id_usuario,id_rol)
SELECT u.id_usuario, r.id_rol
FROM usuario u
JOIN rol r ON r.nombre_rol='PSICOLOGO'
WHERE u.username IN ('psico1','psico2');

INSERT INTO usuario_rol (id_usuario,id_rol)
SELECT u.id_usuario, r.id_rol
FROM usuario u
JOIN rol r ON r.nombre_rol='RECEPCION'
WHERE u.username IN ('recep1','recep2');