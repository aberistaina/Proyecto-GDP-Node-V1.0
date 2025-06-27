import { ArchivosVersionProceso, VersionProceso } from "../models/models.js";
import { FileError, NotFoundError } from "../errors/TypeError.js";
import { getAdminConfig } from "../services/admin.services.js";
import { uploadFileToS3 } from "../services/s3Client.services.js";
import mime from "mime-types";
import { isValidFilesExtension } from "../utils/validators.js";
import { formatShortTime } from "../utils/formatearFecha.js";
import logger from "../utils/logger.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);


export const cargarAdjuntos = async(req, res, next) =>{
    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            throw new FileError("No se adjuntaron archivos")
        }
        const { archivos } = req.files;
        const { id_usuario, version } = req.body;
        const { s3_bucket, s3_bucket_adjuntos } = await getAdminConfig();

        const archivosArray = Array.isArray(archivos) ? archivos : [archivos];

        const nombreVersion = VersionProceso.findByPk(version)

        for (const archivo of archivosArray) {
            isValidFilesExtension(archivo);
            const mimeType = mime.lookup(archivo.name) || "application/octet-stream";

            await uploadFileToS3(
                `${s3_bucket}`,
                `${s3_bucket_adjuntos}/${archivo.name}`,
                archivo.data,
                mimeType,
                `${nombreVersion.nombre_version}`,
                `${nombreVersion.estado}`
            )

            await ArchivosVersionProceso.create({
                id_version_proceso: version,
                id_usuario,
                nombre: archivo.name,
                s3_key: `${s3_bucket_adjuntos}/${archivo.name}`
            })
        }

        res.status(200).json({
            code: 200,
            message: "Archivos cargados Correctamente",
        });
    } catch (error) {
        logger.error(`[${fileName} -> cargarAdjuntos] ${error.message}`);
        console.log(error);
        next(error);
    }
}

export const obtenerAdjuntos = async(req, res, next) =>{
    try {
        const { version } = req.params;

        const versionProceso = await VersionProceso.findOne({where: {
            id_version_proceso: version
        }})

        if(!versionProceso){
            throw new NotFoundError("No existe la versión")
        }
        const adjuntos = await ArchivosVersionProceso.findAll({
            where:{
                id_version_proceso: version
            }
        })

        if(adjuntos.length === 0){
            res.status(200).json({
            code: 200,
            message: "No hay archivos adjuntos para esta versión",
            data: []
        });
        }

        res.status(200).json({
            code: 200,
            message: "Archivos obtenidos Correctamente",
            data: adjuntos
        });
    } catch (error) {
        logger.error(`[${fileName} -> obtenerAdjuntos] ${error.message}`);
        console.log(error);
        next(error);
    }
}