-- =========================================
-- USUARIO ADMINISTRADOR
-- =========================================

UPDATE usuario
SET password_hash = '$2a$10$WZjb4KElAnP1zn7YsRhjJ.YcJMJTUA1RaWldbnt9iRUA33IgvRG2O',
correo = 'test@gmail.com'
WHERE username = 'admin' AND id_estado = (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')