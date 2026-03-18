;-- =========================================
-- USUARIO COORDINACIÓN
-- =========================================

UPDATE usuario
SET username = 'coordinacion',
password_hash = '$2a$10$WZjb4KElAnP1zn7YsRhjJ.YcJMJTUA1RaWldbnt9iRUA33IgvRG2O',
correo = 'emejiag9@miumg.edu.gt',
nombre = 'Cristabel',
apellido = 'Mejía Girón'
WHERE id_usuario = 2
AND username = 'psicologo1'
AND id_estado = (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO');


-- =========================================
-- ASIGANCIÓN DE ROL DE COORDINACIÓN
-- =========================================

UPDATE usuario_rol
SET id_rol = 3
WHERE id_usuario_rol = 2;