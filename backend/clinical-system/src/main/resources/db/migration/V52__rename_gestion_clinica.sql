-- ============================================================
-- RENAME OPTION PADRE AND MODULO
-- ============================================================

update opcion 
set nombre = 'Gestión Clínica'
where nombre = 'GESTIÓN CLÍNICA';

update modulo m 
set nombre = 'GESTIONES'
where nombre = 'GESTIÓN CLÍNICA'