import { CustomError } from "./CustomError.js";

export class ValidationError extends CustomError {
    constructor(message, details) {
        super(message || "Error de Validación", 400, details);
    }
}

export class DataBaseError extends CustomError {
    constructor(message, details) {
        super(
            message || "Error en la comunicación con la Base de datos",
            500,
            details
        );
    }
}

export class NotFoundError extends CustomError {
    constructor(message, details, entity) {
        super(message || `${entity} No Encontrado`, 404, details);
    }
}

export class InvalidTokenError extends CustomError {
    constructor(message = "El token es inválido o ha caducado", details) {
        super(message, 401, details);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message = "No autorizado", details) {
        super(message, 401, details);
    }
}

export class AuthenticationError extends CustomError {
    constructor(message = "Error en el proceso de authenticación", details) {
        super(message, 401, details);
    }
}

export class MailError extends CustomError {
    constructor(message, details) {
        super(message || "Error al enviar el email", 500, details);
    }
}

export class InternalServerError extends CustomError {
    constructor(message, details) {
        super(message || "Error interno del Servidor", 500, details);
    }
}

export class ProcessError extends CustomError {
    constructor(message, details) {
        super(message || "Error Al guardar el proceso", 500, details);
    }
}

export class FileError extends CustomError {
    constructor(message, details) {
        super(message || "Error Al guardar el archivo", 500, details);
    }
}

export class BpmnError extends CustomError {
    constructor(message, details) {
        super(message || "Error al procesar el modelo", 500, details);
    }
}

export class FileS3Error extends CustomError {
    constructor(message, details) {
        super(message || "Error con S3", 500, details);
    }
}