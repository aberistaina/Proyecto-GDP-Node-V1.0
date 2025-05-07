export const formatearFecha = (fechaIso) => {
    const fecha = new Date(fechaIso);

    const opciones = {
    weekday: "long",   
    day: "2-digit",    
    month: "long",     
    year: "numeric"
    };

let fechaFormateada = fecha.toLocaleDateString("es-CL", opciones);

fechaFormateada  = fechaFormateada.replace(",", "")

const [diaSemana, diaNum, , mes, , año] = fechaFormateada.split(" ")

const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

return `${capitalizar(diaSemana)} ${diaNum} de ${capitalizar(mes)} del ${año}`;


};
