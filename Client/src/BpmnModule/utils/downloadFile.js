
export const downloadFile = async(response, nombreArchivo) =>{
    try {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        
        link.download = `${nombreArchivo}`;
        document.body.appendChild(link);

        link.click();
        link.remove();
        
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.log(error);
    }
}