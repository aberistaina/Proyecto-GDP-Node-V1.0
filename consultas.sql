select * from usuarios;
select * from cargo;
select * from niveles;
select * from procesos;
select * from roles;

INSERT INTO `cargo` (`id_cargo`, `nombre`, `descripcion`) VALUES
	(1, 'CEO', 'Chief Executive Officer'),
	(2, 'Jefe de Área', 'Encargado del área correspondiente'),
	(3, 'Analista de Procesos', 'Responsable de crear procesos'),
	(4, 'Encargado de Soporte', 'Manejo de procesos de soporte');
    
    -- Volcando datos para la tabla gdp_bd.niveles: ~0 rows (aproximadamente)
INSERT INTO `niveles` (`id_nivel`, `nombre`, `created_at`) VALUES
	(1, 'Procesos Estratégicos', '2025-04-24 16:09:47'),
	(2, 'Procesos Operativos', '2025-04-24 16:09:47'),
	(3, 'Procesos de Soporte', '2025-04-24 16:09:47');
    
    INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
	(1, 'Administrador del sistema'),
	(2, 'Gerente General'),
	(3, 'Analista'),
	(4, 'Autorizador'),
	(5, 'Visualizador');
    
    INSERT INTO `procesos` (`id_proceso`, `id_creador`, `id_aprobadores_cargo`, `id_nivel`, `nombre`, `descripcion`, `estado`, `created_at`, `macroproceso`) VALUES
	(1, 3, 2, 1, 'Planificación Estratégica Anual', 'Proceso macro de planificación', 'activo', '2025-04-24 16:09:47', 1),
	(2, 3, 3, 2, 'Gestión de Proveedores', 'Proceso de relación con proveedores', 'activo', '2025-04-24 16:09:47', 1);

INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `id_cargo`, `id_jefe_directo`, `nombre`, `email`, `password_hash`, `created_at`, `updated_at`, `reset_token`, `reset_token_expiration`) VALUES
	(1, 1, 1, NULL, 'Isaac Aburto', 'isaac.aburto@backspace.cl', 'hash1', '2025-04-24 16:09:47', '2025-04-24 16:09:47', NULL, NULL),
	(2, 2, 2, 1, 'Pablo Castro', 'pablo.castro@backspace.cl', 'hash2', '2025-04-24 16:09:47', '2025-04-24 16:09:47', NULL, NULL),
	(3, 3, 3, 2, 'Alejandro Beristain', 'alejandro.beristain@backspace.cl', 'hash3', '2025-04-24 16:09:47', '2025-04-24 16:09:47', NULL, NULL),
	(4, 4, 2, 2, 'Jorge Cortez', 'jorge.cortez@backsapce.cl', 'hash4', '2025-04-24 16:09:47', '2025-04-24 16:09:47', NULL, NULL),
	(5, 5, 4, 2, 'Maximiliano Campos', 'maximiliano.campos@backspace.cl', 'hash5', '2025-04-24 16:09:47', '2025-04-24 16:09:47', NULL, NULL);