import {
    ListObjectVersionsCommand,
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    HeadObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});

export const getDataFileBpmnFromS3 = async (bucketName, fileName, version) => {
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
        console.error("Error getting file from S3:", error);
        throw error;
    }
};

export const uploadFileToS3 = async (
    bucketName,
    fileName,
    fileContent,
    fileContentType,
    versionMetadata,
    estado
) => {
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
        console.log(`File uploaded successfully to ${bucketName}/${fileName}`);
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw error;
    }
};

export const getFileFromS3Version = async (bucketName, fileName, versionBuscada) => {
    try {
        // Listar las versiones de los objetos en el bucket
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
        console.error("Error getting file from S3:", error);
        throw error;
    }
};

export const downloadFromS3 = async (fileName, bucketName) => {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName, 
            Key: fileName,
        });

        return await s3Client.send(command)

    } catch (error) {
        console.error("Error al descargar archivo desde S3:", error);
        throw error
    }
};
