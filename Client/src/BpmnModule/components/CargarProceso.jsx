import { BiRefresh } from "react-icons/bi";

//ACTUALMENTE SIN USO
//Componente que sirve para cargar procesos
export const CargarProceso = ({selectedProcess, setSelectedProcess, process, handleSubmit  }) => {
    
  return (

    
                        <form className="flex gap-3" onSubmit={handleSubmit}>
                            <select name="procesos" id="" className="flex w-full px-4 py-2 border border-gray-400 rounded-lg shadow-sm focus:ring-indigo-300"
                            value={selectedProcess} 
                            onChange={(e) => setSelectedProcess(e.target.value)}>
                                <option disabled value="">Selecciona un proceso</option>
                                {
                                    process && process.map((proceso) => (
                                        <option key={proceso.idProceso} value={proceso.idProceso}>{proceso.nombre}</option>
                                    ))
                                }
                            </select>
                            <div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 w-44  px-3 rounded focus:outline-none focus:shadow-outline flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                <BiRefresh className="me-2 text-2xl" /> Cargar Proceso
                                </button>
                            </div>
                        </form>
  )
}
