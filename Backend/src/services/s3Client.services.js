
import {ListObjectVersionsCommand, S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand} from "@aws-sdk/client-s3";
import { FileS3Error,  } from "../errors/TypeError.js";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});

export const getDataFileBpmnFromS3 = async (bucketName, fileName) => {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileName,
        });

        const { Body } = await s3Client.send(command);

        const streamToString = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on("data", (chunk) => chunks.push(chunk));
                stream.on("error", reject);
                stream.on("end", () =>
                    resolve(Buffer.concat(chunks).toString("utf8"))
                );
            });

        const xmlContent = await streamToString(Body);
        return xmlContent;
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> getDataFileBpmnFromS3] ${error.message}`);
        throw new FileS3Error("Hubo un Error al obtener el archivo en S3", error.message);
    }
};

export const uploadFileToS3 = async (bucketName, fileName, fileContent, fileContentType, versionMetadata, estado) => {
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileContent,
            ContentType: fileContentType,
            Metadata: {
                "x-amz-meta-version": `${versionMetadata}`,
                "x-amz-meta-activo": `${estado}`,
            },
        });
        await s3Client.send(command);
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> uploadFileToS3] ${error.message}`);
        throw new FileS3Error("Hubo un Error al almacenar el archivo en S3", error.message);
    }
};

export const getFileFromS3Version = async (bucketName,fileName,versionBuscada) => {
    try {
        const { Versions } = await s3Client.send(
            new ListObjectVersionsCommand({
                Bucket: bucketName,
                Prefix: fileName,
            })
        );

        //Recorre todas las versiones y busca la que tenga la metadata "x-amz-meta-version" que necesitamos"
        for (const version of Versions) {
            const { Metadata } = await s3Client.send(
                new HeadObjectCommand({
                    Bucket: bucketName,
                    Key: `${fileName}`,
                    VersionId: version.VersionId,
                })
                
            );

            if (Metadata["x-amz-meta-version"] === versionBuscada) {
                const { Body } = await s3Client.send(
                    new GetObjectCommand({
                        Bucket: bucketName,
                        Key: `${fileName}`,
                        VersionId: version.VersionId,
                    })
                );

                const streamToString = (stream) =>
                    new Promise((resolve, reject) => {
                        const chunks = [];
                        stream.on("data", (chunk) => chunks.push(chunk));
                        stream.on("error", reject);
                        stream.on("end", () =>
                            resolve(Buffer.concat(chunks).toString("utf8"))
                        );
                    });

                const xmlContent = await streamToString(Body);
                return xmlContent;
            }
        }
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> getFileFromS3Version] ${error.message}`);
        throw new FileS3Error("Hubo un Error al obtener el archivo en S3", error.message);
    }
};

export const getImageFromS3Version = async (bucketName,fileName,versionBuscada) => {
    try {
        const { Versions } = await s3Client.send(
            new ListObjectVersionsCommand({
                Bucket: bucketName,
                Prefix: fileName,
            })
        );

        for (const version of Versions) {
            const { Metadata } = await s3Client.send(
                new HeadObjectCommand({
                    Bucket: bucketName,
                    Key: fileName,
                    VersionId: version.VersionId,
                })
            );

            if (Metadata["x-amz-meta-version"] === versionBuscada) {
                const { Body } = await s3Client.send(
                    new GetObjectCommand({
                        Bucket: bucketName,
                        Key: fileName,
                        VersionId: version.VersionId,
                    })
                );

                const streamToBuffer = (stream) =>
                    new Promise((resolve, reject) => {
                        const chunks = [];
                        stream.on("data", (chunk) => chunks.push(chunk));
                        stream.on("error", reject);
                        stream.on("end", () => resolve(Buffer.concat(chunks)));
                    });

                const buffer = await streamToBuffer(Body)
                return buffer;
            }
        }

        throw new FileS3Error("No existe una imagen con esa versión en S3");
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> getImageFromS3Version] ${error.message}`);
        throw new FileS3Error("Hubo un Error al obtener la imagen desde S3", error.message);
    }
};

export const downloadFromS3 = async (fileName, bucketName) => {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileName,
        });

        return await s3Client.send(command);
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> downloadFromS3] ${error.message}`);
        throw new FileS3Error("Hubo un Error al descargar el archivo desde S3", error.message);
    }
};
