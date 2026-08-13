INSERT INTO opcion
(modulo_id, opcion_padre_id, nombre, descripcion,
 ruta_frontend, componente, icono, orden,
 visible_menu, requiere_autenticacion,
 es_menu_principal, estado_id)
VALUES

(1,NULL,'My profile',
'My profile card',
'/profile',NULL,null,1,true,true,true,1);