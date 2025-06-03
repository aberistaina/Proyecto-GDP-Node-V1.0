import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";

export default function Opciones() {
    const { enqueueSnackbar } = useSnackbar()
    const [config, setConfig] = useState({
        bucket: "",
        procesos: "",
        adjuntos: "",
        imagenes: "",
        documentacion: "",
        tokenSesionValor: "",
        tokenSesionUnidad: "m",
        tokenRecuperacionValor: "",
        tokenRecuperacionUnidad: "m"
    });
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async() => {
        try {
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION
            
            const formData = new FormData();
            formData.append("tokenSesionValor", config.tokenSesionValor);
            formData.append("tokenSesionUnidad", config.tokenSesionUnidad);
            formData.append("tokenRecuperacionValor", config.tokenRecuperacionValor);
            formData.append("tokenRecuperacionUnidad", config.tokenRecuperacionUnidad);
            formData.append("bucket", config.bucket);
            formData.append("procesos", config.procesos);
            formData.append("adjuntos", config.adjuntos);
            formData.append("imagenes", config.imagenes);
            formData.append("documentacion", config.documentacion);

            const requestOptions = {
                method: "POST",
                body: formData
            }
            const response = await fetch(`${URL}/api/v1/admin/set-config`, requestOptions)
            const data = await response.json()
            if(data.code === 200){
                enqueueSnackbar("Configuración Guardada", { variant: "success" });
            }else{
                enqueueSnackbar("Hubo un error, intente nuevamente", { variant: "error" });
            }
        } catch (error) {
            console.log(error)  
        }
    };

    useEffect(() => {
         const getConfig = async() =>{
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION
            
                const response = await fetch(`${URL}/api/v1/admin/get-config`)
                const data = await response.json()
                setConfig(data.data)
            } catch (error) {
                console.log(error);
            }
        }
        getConfig()
    }, [])
    

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Configuración del Sitio
            </h2>

            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                    Directorios de S3
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Nombre Bucket
                        </label>
                        <input
                            name="bucket"
                            value={config.bucket}
                            onChange={handleChange}
                            placeholder="nombre bucket"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Procesos
                        </label>
                        <input
                            name="procesos"
                            value={config.procesos}
                            onChange={handleChange}
                            placeholder="carpeta/procesos"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Archivos Adjuntos
                        </label>
                        <input
                            name="adjuntos"
                            value={config.adjuntos}
                            onChange={handleChange}
                            placeholder="carpeta/adjuntos"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Imágenes Procesos
                        </label>
                        <input
                            name="imagenes"
                            value={config.imagenes}
                            onChange={handleChange}
                            placeholder="carpeta/imagenes"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Documentación Procesos
                        </label>
                        <input
                            name="documentacion"
                            value={config.documentacion}
                            onChange={handleChange}
                            placeholder="carpeta/docs"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                    Duración de Tokens
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Token de Sesión
                        </label>
                        <div className="flex gap-2">
                            <input
                                name="tokenSesionValor"
                                type="number"
                                max={60}
                                value={config.tokenSesionValor}
                                onChange={handleChange}
                                placeholder="Ej: 1"
                                className="w-full p-2 border rounded"
                            />
                            <select
                                name="tokenSesionUnidad"
                                value={config.tokenSesionUnidad}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            >
                                <option value="m">Minutos</option>
                                <option value="h">Horas</option>
                                <option value="d">Días</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Token Recuperación Contraseña
                        </label>
                        <div className="flex gap-2">
                            <input
                                name="tokenRecuperacionValor"
                                type="number"
                                max={60}
                                value={config.tokenRecuperacionValor}
                                onChange={handleChange}
                                placeholder="Ej: 15"
                                className="w-full p-2 border rounded"
                            />
                            <select
                                name="tokenRecuperacionUnidad"
                                value={config.tokenRecuperacionUnidad}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            >
                                <option value="m">Minutos</option>
                                <option value="h">Horas</option>
                                <option value="d">Días</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
}
