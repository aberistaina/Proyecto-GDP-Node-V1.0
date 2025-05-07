import { useState, useEffect } from "react";


export default function Comentarios({idProceso}) {
    const [comentarios, setComentarios ] = useState([])

    useEffect(() => {
        const getAllComentaries = async() =>{
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/procesos/comentarios/getAll/${idProceso}`)
                const data = await response.json()
                setComentarios(data.data)
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        getAllComentaries()
    }, [comentarios])
    

    return (
      <div>
        {comentarios && comentarios.map((comentario) => (
            <div className="border-l-4 border-green-500 pl-3 mb-4" key={comentario.id}>
                <div className="text-sm font-semibold text-green-700">{comentario.nombre}</div>
                <div className="text-xs text-gray-500 mb-1">{comentario.created_at}</div>
                <p className="text-sm text-gray-800">{comentario.comentario}</p>
            </div>
        ))}
      </div>
    );
  }
  