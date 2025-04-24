import { useEffect, useState } from "react";
import { useBpmnContext } from "../context/useBpmnContext";
import { useParams } from "react-router-dom";
import { SubprocessBackButton } from "./SubprocessBackButton"
import { FaUpload } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";
import { BiRefresh } from "react-icons/bi";



export const ProcessSelector = ({setShowModal, setIdProcessSocket, modo}) => {
    const { setEmptyDiagram, template, refreshProcess, setRefreshProcess, setSelectedProcess, selectedProcess } = useBpmnContext();
    /* const [ selectedProcess, setSelectedProcess ] = useState(""); */
    const [ process, setProcess ] = useState();
    const { idSubproceso } = useParams();

    const getAllProcess = async() =>{
        try {
            const requestOptions = {
                method: "GET",
            }
            const URL = import.meta.env.VITE_APP_MODE === "desarrollo" ? import.meta.env.VITE_URL_DESARROLLO : import.meta.env.VITE_URL_PRODUCCION;
            
            const response = await fetch(`${URL}/api/v1/procesos`, requestOptions)
            const data = await response.json()
            return data.data
            
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async(e) =>{
        
        e.preventDefault()
        try {
            const requestOptions = {
                method: "GET",
            }

            const URL = import.meta.env.VITE_APP_MODE === "desarrollo" ? import.meta.env.VITE_URL_DESARROLLO : import.meta.env.VITE_URL_PRODUCCION;

            const response = await fetch(`${URL}/api/v1/procesos/get-process/${selectedProcess}`, requestOptions)   
            console.log(response);

            const data = await response.text(); 
            if(modo !== "viewer"){
                setIdProcessSocket(selectedProcess)
            }
            
            setEmptyDiagram(data)

        } catch (error) {
            console.log(error);
        }
    }

    const resetDiagram = () => {
        setEmptyDiagram(template)
        setSelectedProcess("")
    };
    

    useEffect(() => {
        const loadProcesses = async () => {
            const data = await getAllProcess();
            setProcess(data);
        };
        loadProcesses();
    }, [])

    useEffect(() => {
        if (refreshProcess) {
          getAllProcess().then(setProcess);
          setRefreshProcess(false);
        }
      }, [refreshProcess]);

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <button
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 w-42  px-3 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={(e) => setShowModal(true)}
                    >
                        <FaUpload className="me-2" /> Cargar Archivos
                    </button>
                </div>

                <div className="flex space-x-3">
                    {idSubproceso && <SubprocessBackButton />}

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
                    <button
                        className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 w-42  px-3 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                        onClick={resetDiagram}
                    ><RiResetLeftFill className="me-2 text-xl" />
                        Nuevo Diagrama
                    </button>
                </div>
            </div>
            
        </>
    )
}
