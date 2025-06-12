export const validarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};

export const validarPassword = (password) => {
    const regex =
        /^(?=(?:.*[A-Za-z]){4})(?=(?:.*\d){4})(?=(?:.*[@#$+=&]){1})[A-Za-z\d@#$+=&]{9,}$/;
    return regex.test(password);
};

export const getFileExtension = (file) => {
    const extension = file.name.match(/\.([0-9a-z]+)$/i)?.[1] ?? "";
    return extension;
};

export const validarDatosProceso = (formProceso) => {
    if (!formProceso.nivel || formProceso.nivel.length === 0) throw new Error("El nivel es obligatorio");
    if (!formProceso.aprobadores || formProceso.aprobadores.length === 0)
        throw new Error("Debe seleccionar al menos un aprobador");
    if (!formProceso.nombre || formProceso.nombre.trim().length < 4)
        throw new Error("El nombre debe tener al menos 4 caracteres");
};
