import { ValidationError } from "../errors/TypeError.js";
import logger from "./logger.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

export const formatearFecha = (fechaIso) => {
    try {
        const fecha = new Date(fechaIso);

        const opciones = {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        };

        let fechaFormateada = fecha.toLocaleDateString("es-CL", opciones);

        fechaFormateada = fechaFormateada.replace(",", "");

        const [diaSemana, diaNum, , mes, , año] = fechaFormateada.split(" ");

        const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

        return `${capitalizar(diaSemana)} ${diaNum} de ${capitalizar(
            mes
        )} del ${año}`;
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> formatearFecha] ${error.message}`);
        throw new ValidationError(
            "No se pudo formatear la fecha",
            error.message
        );
    }
};

export const formatShortTime = (fechaIso) => {
    try {
        const fecha = new Date(fechaIso);

        const day = String(fecha.getDate()).padStart(2, "0");
        const month = String(fecha.getMonth() + 1).padStart(2, "0");
        const year = fecha.getFullYear();

        const hours = String(fecha.getHours()).padStart(2, "0");
        const minutes = String(fecha.getMinutes()).padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> formatShortTime] ${error.message}`);
        throw new ValidationError(
            "No se pudo formatear la fecha",
            error.message
        );
    }
};
