import { FileError } from "../errors/TypeError.js";

export const moveFile = async (archivo, rutaAbsoluta) => {
    return new Promise((resolve, reject) => {
        archivo.mv(rutaAbsoluta, (err) => {
            if (err) {
                console.error("[moveFile Error]:", err);
                return reject(
                    new FileError("Error al guardar el archivo en el servidor")
                );
            }
            resolve();
        });
    });
};
