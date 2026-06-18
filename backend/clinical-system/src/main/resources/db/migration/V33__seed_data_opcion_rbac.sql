INSERT INTO opcion
(modulo_id, opcion_padre_id, nombre, descripcion,
 ruta_frontend, componente, icono, orden,
 visible_menu, requiere_autenticacion,
 es_menu_principal, estado_id)
VALUES

(1,NULL,'Seguridad','Módulo de seguridad',
'/seguridad',NULL,'shield',1,true,true,true,1),

(1,1,'Usuarios','Administración de usuarios',
'/seguridad/usuarios','UsuariosComponent',
'people',1,true,true,false,1),

(1,1,'Roles','Administración de roles',
'/seguridad/roles','RolesComponent',
'admin_panel_settings',2,true,true,false,1),

(1,1,'Permisos','Administración de permisos',
'/seguridad/permisos','PermisosComponent',
'lock',3,true,true,false,1),

(1,1,'Módulos','Administración de módulos',
'/seguridad/modulos','ModulosComponent',
'view_module',4,true,true,false,1),

(1,1,'Opciones','Administración de opciones',
'/seguridad/opciones','OpcionesComponent',
'menu',5,true,true,false,1);