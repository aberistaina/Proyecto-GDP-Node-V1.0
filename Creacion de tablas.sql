CREATE TABLE IF NOT EXISTS `cargo` (
  `id_cargo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  PRIMARY KEY (`id_cargo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `niveles` (
  `id_nivel` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_nivel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla usuarios que depende de roles y cargo
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `id_rol` int(11) NOT NULL,
  `id_cargo` int(11) NOT NULL,
  `id_jefe_directo` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiration` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `id_rol` (`id_rol`),
  KEY `id_cargo` (`id_cargo`),
  KEY `id_jefe_directo` (`id_jefe_directo`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_cargo`) REFERENCES `cargo` (`id_cargo`),
  CONSTRAINT `usuarios_ibfk_3` FOREIGN KEY (`id_jefe_directo`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla procesos que depende de usuarios, cargo y niveles
CREATE TABLE IF NOT EXISTS `procesos` (
  `id_proceso` int(11) NOT NULL AUTO_INCREMENT,
  `id_creador` int(11) NOT NULL,
  `id_aprobadores_cargo` int(11) DEFAULT NULL,
  `id_nivel` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` enum('borrador','activo','archivado') DEFAULT 'borrador',
  `created_at` timestamp NULL DEFAULT NULL,
  `macroproceso` tinyint(1) DEFAULT NULL,
  `id_bpmn` varchar(255) NOT NULL,
  PRIMARY KEY (`id_proceso`),
  UNIQUE KEY `id_bpmn` (`id_bpmn`),
  KEY `id_creador` (`id_creador`),
  KEY `id_aprobadores_cargo` (`id_aprobadores_cargo`),
  KEY `id_nivel` (`id_nivel`),
  CONSTRAINT `procesos_ibfk_1` FOREIGN KEY (`id_creador`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `procesos_ibfk_2` FOREIGN KEY (`id_aprobadores_cargo`) REFERENCES `cargo` (`id_cargo`),
  CONSTRAINT `procesos_ibfk_3` FOREIGN KEY (`id_nivel`) REFERENCES `niveles` (`id_nivel`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Crear tabla aprobadores que depende de usuarios
CREATE TABLE IF NOT EXISTS `aprobadores` (
  `id_aprobador` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_aprobador`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `aprobadores_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla version_proceso que depende de procesos, usuarios, aprobadores
CREATE TABLE IF NOT EXISTS `version_proceso` (
  `id_version_proceso` int(11) NOT NULL AUTO_INCREMENT,
  `id_proceso` int(11) NOT NULL,
  `id_creador` int(11) NOT NULL,
  `id_aprobador` int(11) DEFAULT NULL,
  `nombre_version` varchar(50) NOT NULL,
  `observacion_version` varchar(255) DEFAULT NULL,
  `estado` enum('borrador','enviado','aprobado','eliminado') DEFAULT 'borrador',
  `created_at` timestamp NULL DEFAULT NULL,
  `s3_key` varchar(512) DEFAULT NULL,
  `s3_bucket` varchar(255) DEFAULT NULL,
  `id_bpmn` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_version_proceso`),
  KEY `id_proceso` (`id_proceso`),
  KEY `id_creador` (`id_creador`),
  KEY `id_aprobador` (`id_aprobador`),
  CONSTRAINT `version_proceso_ibfk_1` FOREIGN KEY (`id_proceso`) REFERENCES `procesos` (`id_proceso`),
  CONSTRAINT `version_proceso_ibfk_2` FOREIGN KEY (`id_creador`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `version_proceso_ibfk_3` FOREIGN KEY (`id_aprobador`) REFERENCES `aprobadores` (`id_aprobador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tablas secundarias que dependen de version_proceso, comentarios, oportunidades, etc.

CREATE TABLE IF NOT EXISTS `comentarios_version_proceso` (
  `id_comentario` int(11) NOT NULL AUTO_INCREMENT,
  `id_version_proceso` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `comentario` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_comentario`),
  KEY `id_version_proceso` (`id_version_proceso`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `comentarios_version_proceso_ibfk_1` FOREIGN KEY (`id_version_proceso`) REFERENCES `version_proceso` (`id_version_proceso`),
  CONSTRAINT `comentarios_version_proceso_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `archivos_comentarios_version_proceso` (
  `id_archivo` int(11) NOT NULL AUTO_INCREMENT,
  `id_comentario` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `s3_key` varchar(512) DEFAULT NULL,
  `s3_bucket` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_archivo`),
  KEY `id_comentario` (`id_comentario`),
  CONSTRAINT `archivos_comentarios_version_proceso_ibfk_1` FOREIGN KEY (`id_comentario`) REFERENCES `comentarios_version_proceso` (`id_comentario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `oportunidades_mejora` (
  `id_oportunidad` int(11) NOT NULL AUTO_INCREMENT,
  `id_version_proceso` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_oportunidad`),
  KEY `id_version_proceso` (`id_version_proceso`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `oportunidades_mejora_ibfk_1` FOREIGN KEY (`id_version_proceso`) REFERENCES `version_proceso` (`id_version_proceso`),
  CONSTRAINT `oportunidades_mejora_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE IF NOT EXISTS `intermedia_procesos` (
  `id_intermedia_procesos` int(11) NOT NULL AUTO_INCREMENT,
  `id_bpmn_padre` varchar(255) NOT NULL,
  `id_bpmn` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `call_activity` varchar(255) NOT NULL,
  PRIMARY KEY (`id_intermedia_procesos`),
  KEY `fk_bpmn` (`id_bpmn`),
  KEY `fk_bpmn_padre` (`id_bpmn_padre`),
  CONSTRAINT `fk_bpmn` FOREIGN KEY (`id_bpmn`) REFERENCES `procesos` (`id_bpmn`),
  CONSTRAINT `fk_bpmn_padre` FOREIGN KEY (`id_bpmn_padre`) REFERENCES `procesos` (`id_bpmn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `bitacora_aprobaciones` (
  `id_version_proceso` int(11) NOT NULL,
  `id_aprobador` int(11) NOT NULL,
  `comentario` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_version_proceso`,`id_aprobador`),
  KEY `id_aprobador` (`id_aprobador`),
  CONSTRAINT `bitacora_aprobaciones_ibfk_1` FOREIGN KEY (`id_version_proceso`) REFERENCES `version_proceso` (`id_version_proceso`),
  CONSTRAINT `bitacora_aprobaciones_ibfk_2` FOREIGN KEY (`id_aprobador`) REFERENCES `aprobadores` (`id_aprobador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `archivos_version_proceso` (
  `id_archivo` int(11) NOT NULL AUTO_INCREMENT,
  `id_version_proceso` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `s3_key` varchar(512) NOT NULL,
  `s3_bucket` varchar(255) NOT NULL,
  PRIMARY KEY (`id_archivo`),
  KEY `id_version_proceso` (`id_version_proceso`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `archivos_version_proceso_ibfk_1` FOREIGN KEY (`id_version_proceso`) REFERENCES `version_proceso` (`id_version_proceso`),
  CONSTRAINT `archivos_version_proceso_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE IF NOT EXISTS `archivos_oportunidades_mejora` (
  `id_archivo` int(11) NOT NULL AUTO_INCREMENT,
  `id_oportunidad` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `s3_key` varchar(512) DEFAULT NULL,
  `s3_bucket` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_archivo`),
  KEY `id_oportunidad` (`id_oportunidad`),
  CONSTRAINT `archivos_oportunidades_mejora_ibfk_1` FOREIGN KEY (`id_oportunidad`) REFERENCES `oportunidades_mejora` (`id_oportunidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `token` (
  `id_token` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `token` varchar(512) NOT NULL,
  `activo` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_token`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `token_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
);
