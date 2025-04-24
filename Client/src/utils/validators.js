export const validarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

export const validarPassword = (password) => {
    const regex = /^(?=(?:.*[A-Za-z]){4})(?=(?:.*\d){4})(?=(?:.*[@#$+=&]){1})[A-Za-z\d@#$+=&]{9,}$/;
    return regex.test(password);
}

export const getFileExtension = (file) => {

    const fileName = file.name;
    const extension = fileName.split('.').pop();
    return extension;
};