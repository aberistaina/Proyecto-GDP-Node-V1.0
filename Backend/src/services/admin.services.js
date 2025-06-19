import { Administracion } from "../models/models.js"
import { NotFoundError, ValidationError } from "../errors/TypeError.js";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);


export const getAdminConfig = async (req, res, next) =>{
    try {
        const adminConfig = await Administracion.findByPk(1)
        
        if (!adminConfig) {
            logger.error(`[${fileName} -> getAdminConfig] ${error.message}`);
            throw new NotFoundError("Configuración de administración no encontrada");
            
        }

        const config = {
            token_expiracion_login: adminConfig.token_expiracion_login,
            token_expiracion_password: adminConfig.token_expiracion_password,
            s3_bucket: adminConfig.s3_bucket,
            s3_bucket_procesos: adminConfig.s3_bucket_procesos,
            s3_bucket_imagenes: adminConfig.s3_bucket_imagenes,
            s3_bucket_adjuntos: adminConfig.s3_bucket_adjuntos,
            s3_bucket_documentacion: adminConfig.s3_bucket_documentacion
        }
        return config
        
    } catch (error) {
        logger.error(`[${fileName} -> getAdminConfig] ${error.message}`);
        console.log(error);
        next(error);
    }
}

export const adminValidation = async(bucket, procesos, adjuntos, imagenes, documentacion, tokenSesionValor, tokenSesionUnidad,tokenRecuperacionValor, tokenRecuperacionUnidad)=>{
    if(!bucket){
        throw new ValidationError("El Nombre del bucket no puede quedar vacío", {
            field: "Nombre Bucket Principal",
        });
    }

    if(!procesos){
        throw new ValidationError("El Nombre del bucket de procesos no puede quedar vacío", {
            field: "Nombre Bucket Procesos",
        });
    }

    if(!adjuntos){
        throw new ValidationError("El Nombre del bucket de archivos adjuntos no puede quedar vacío", {
            field: "Nombre Bucket Archivos Ajuntos",
        });
    }

    if(!documentacion){
        throw new ValidationError("El Nombre del bucket de documentación no puede quedar vacío", {
            field: "Nombre Bucket Documentación",
        });
    }

    if(!imagenes){
        throw new ValidationError("El Nombre del bucket de imágenes no puede quedar vacío", {
            field: "Nombre Bucket Imágenes",
        });
    }

    if(!tokenSesionValor){
        throw new ValidationError("La duración del token de sesión no puede estar vacía", {
            field: "Duración Token de Sesión",
        });
    }

    if(!tokenSesionUnidad){
        throw new ValidationError("La duración del token de sesión no puede estar vacía", {
            field: "Duración Token de Sesión",
        });
    }

    if(!tokenRecuperacionValor){
        throw new ValidationError("La duración del token de recuperación de contraseña no puede estar vacía", {
            field: "Duración Token Recuperación Contraseña",
        });
    }

    if(!tokenRecuperacionUnidad){
        throw new ValidationError("La duración del token de recuperación de contraseña no puede estar vacía", {
            field: "Duración Token Recuperación Contraseña",
        });
    }
    
}