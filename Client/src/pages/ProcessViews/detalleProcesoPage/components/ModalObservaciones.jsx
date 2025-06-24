import PulseLoader from "react-spinners/PulseLoader";
import { useState } from "react";
import { useSnackbar } from "notistack";

export const ModalObservaciones = ({observacion, setObservacion, setOpenModalObservaciones, getData, idProceso, version}) => {
    const [ loading, setLoading ] = useState(false)
    const { enqueueSnackbar } = useSnackbar();

    const solicitarAprobacion = async() =>{
        try {
            setLoading(true)
            const formData = new FormData()

            formData.append("idProceso", idProceso)
            formData.append("version", version)
            formData.append("observacion", observacion)

            const requestOptions = {
                method: "POST",
                body: formData ,
                credentials: "include"
            }

            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                ? import.meta.env.VITE_URL_DESARROLLO
                : import.meta.env.VITE_URL_PRODUCCION;

            const response = await fetch(`${URL}/api/v1/aprobadores/solicitar-aprobacion`, requestOptions)
            const data = await response.json()

            if (data.code === 201) {
                enqueueSnackbar(data.message, { variant: "success" })
                setLoading(false)
                setOpenModalObservaciones(false)
                getData()
                

            } else {
                enqueueSnackbar(data.message, { variant: "error" });
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6">
                <h2 className="text-2xl font-semibold mb-4">Observaciones</h2>
                <div className="border border-lime-400 rounded p-2 mb-4">
                    <textarea
                        className="w-full h-40 resize-y outline-none"
                        placeholder= "Escriba la Observación aquí"
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setOpenModalObservaciones(false)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
                        onClick={solicitarAprobacion}
                        disabled={loading}
                    >
                        {loading ? (
                        <PulseLoader color="#ffffff" size={10} />
                    ) : (
                        "Enviar A Aprobación"
                    )}
                    </button>
                </div>
            </div>
        </div>
    )
}
