-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.7.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para gdp_bd
CREATE DATABASE IF NOT EXISTS `gdp_bd` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `gdp_bd`;

-- Volcando estructura para tabla gdp_bd.aprobadores
CREATE TABLE IF NOT EXISTS `aprobadores` (
  `id_aprobador` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_aprobador`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `aprobadores_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.aprobadores: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gdp_bd.archivos_comentarios_version_proceso
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.archivos_comentarios_version_proceso: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gdp_bd.archivos_oportunidades_mejora
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.archivos_oportunidades_mejora: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gdp_bd.archivos_version_proceso
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.archivos_version_proceso: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gdp_bd.bitacora_aprobaciones
CREATE TABLE IF NOT EXISTS `bitacora_aprobaciones` (
  `id_version_proceso` int(11) NOT NULL,
  `id_aprobador` int(11) NOT NULL,
  `comentario` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_version_proceso`,`id_aprobador`),
  KEY `id_aprobador` (`id_aprobador`),
  CONSTRAINT `bitacora_aprobaciones_ibfk_1` FOREIGN KEY (`id_version_proceso`) REFERENCES `version_proceso` (`id_version_proceso`),
  CONSTRAINT `bitacora_aprobaciones_ibfk_2` FOREIGN KEY (`id_aprobador`) REFERENCES `aprobadores` (`id_aprobador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.bitacora_aprobaciones: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gdp_bd.cargo
CREATE TABLE IF NOT EXISTS `cargo` (
  `id_cargo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  PRIMARY KEY (`id_cargo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.cargo: ~4 rows (aproximadamente)
INSERT INTO `cargo` (`id_cargo`, `nombre`, `descripcion`) VALUES
	(1, 'CEO', 'Chief Executive Officer'),
	(2, 'Jefe de Área', 'Encargado del área correspondiente'),
	(3, 'Analista de Procesos', 'Responsable de crear procesos'),
	(4, 'Encargado de Soporte', 'Manejo de procesos de soporte');

-- Volcando estructura para tabla gdp_bd.comentarios_version_proceso
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.comentarios_version_proceso: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gdp_bd.intermedia_procesos
CREATE TABLE IF NOT EXISTS `intermedia_procesos` (
  `id_intermedia_procesos` int(11) NOT NULL AUTO_INCREMENT,
  `id_bpmn_padre` varchar(255) DEFAULT NULL,
  `id_bpmn` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `call_activity` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_intermedia_procesos`),
  KEY `fk_bpmn` (`id_bpmn`),
  KEY `fk_bpmn_padre` (`id_bpmn_padre`),
  CONSTRAINT `fk_bpmn` FOREIGN KEY (`id_bpmn`) REFERENCES `procesos` (`id_bpmn`),
  CONSTRAINT `fk_bpmn_padre` FOREIGN KEY (`id_bpmn_padre`) REFERENCES `procesos` (`id_bpmn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.intermedia_procesos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gdp_bd.niveles
CREATE TABLE IF NOT EXISTS `niveles` (
  `id_nivel` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_nivel`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.niveles: ~3 rows (aproximadamente)
INSERT INTO `niveles` (`id_nivel`, `nombre`, `created_at`) VALUES
	(1, 'Procesos Estratégicos', '2025-04-24 16:09:47'),
	(2, 'Procesos Operativos', '2025-04-24 16:09:47'),
	(3, 'Procesos de Soporte', '2025-04-24 16:09:47');

-- Volcando estructura para tabla gdp_bd.oportunidades_mejora
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.oportunidades_mejora: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gdp_bd.procesos
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
  `id_bpmn` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_proceso`),
  UNIQUE KEY `id_bpmn` (`id_bpmn`),
  KEY `id_creador` (`id_creador`),
  KEY `id_aprobadores_cargo` (`id_aprobadores_cargo`),
  KEY `id_nivel` (`id_nivel`),
  CONSTRAINT `procesos_ibfk_1` FOREIGN KEY (`id_creador`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `procesos_ibfk_2` FOREIGN KEY (`id_aprobadores_cargo`) REFERENCES `cargo` (`id_cargo`),
  CONSTRAINT `procesos_ibfk_3` FOREIGN KEY (`id_nivel`) REFERENCES `niveles` (`id_nivel`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.procesos: ~2 rows (aproximadamente)
INSERT INTO `procesos` (`id_proceso`, `id_creador`, `id_aprobadores_cargo`, `id_nivel`, `nombre`, `descripcion`, `estado`, `created_at`, `macroproceso`, `id_bpmn`) VALUES
	(1, 3, 2, 1, 'Planificación Estratégica Anual', 'Proceso macro de planificación', 'activo', '2025-04-24 16:09:47', 1, NULL),
	(2, 3, 3, 2, 'Gestión de Proveedores', 'Proceso de relación con proveedores', 'activo', '2025-04-24 16:09:47', 1, NULL);

-- Volcando estructura para tabla gdp_bd.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.roles: ~5 rows (aproximadamente)
INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
	(1, 'Administrador del sistema'),
	(2, 'Gerente General'),
	(3, 'Analista'),
	(4, 'Autorizador'),
	(5, 'Visualizador');

-- Volcando estructura para tabla gdp_bd.token
CREATE TABLE IF NOT EXISTS `token` (
  `id_token` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `token` varchar(512) NOT NULL,
  `activo` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_token`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `token_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.token: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gdp_bd.usuarios
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.usuarios: ~5 rows (aproximadamente)
INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `id_cargo`, `id_jefe_directo`, `nombre`, `email`, `password_hash`, `created_at`, `updated_at`, `reset_token`, `reset_token_expiration`) VALUES
	(1, 1, 1, NULL, 'Isaac Aburto', 'isaac.aburto@backspace.cl', 'hash1', '2025-04-24 16:09:47', '2025-04-24 16:09:47', NULL, NULL),
	(2, 2, 2, 1, 'Pablo Castro', 'pablo.castro@backspace.cl', 'hash2', '2025-04-24 16:09:47', '2025-04-24 16:09:47', NULL, NULL),
	(3, 3, 3, 2, 'Alejandro Beristain', 'alejandro.beristain@backspace.cl', 'hash3', '2025-04-24 16:09:47', '2025-04-24 16:09:47', NULL, NULL),
	(4, 4, 2, 2, 'Jorge Cortez', 'jorge.cortez@backsapce.cl', 'hash4', '2025-04-24 16:09:47', '2025-04-24 16:09:47', NULL, NULL),
	(5, 5, 4, 2, 'Maximiliano Campos', 'maximiliano.campos@backspace.cl', 'hash5', '2025-04-24 16:09:47', '2025-04-24 16:09:47', NULL, NULL);

-- Volcando estructura para tabla gdp_bd.version_proceso
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla gdp_bd.version_proceso: ~0 rows (aproximadamente)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
