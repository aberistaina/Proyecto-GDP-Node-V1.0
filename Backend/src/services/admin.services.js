import { Administracion } from "../models/models.js"


export const getAdminConfig = async (req, res, next) =>{
    try {
        const adminConfig = await Administracion.findByPk(1)

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
        console.log(error);
        next(error);
    }
}