import { useEffect } from "react";
import { BpmnViewer } from "../../../../BpmnModule/BpmnViewer/components/BpmnViewer";
import { FaDiagramProject } from "react-icons/fa6";
import { useBpmnContext } from "../../../../BpmnModule/context/useBpmnContext";
import { BpmnViewerModule2 } from "../../../../BpmnModule/BpmnViewer2/BpmnViewerModule2";
import { SlSizeFullscreen } from "react-icons/sl";
import { Link } from "react-router-dom";

export const VisualizadorProceso = ({ idProceso, version, height }) => {
    const { setEmptyDiagram } = useBpmnContext();
    useEffect(() => {
        const getData = async () => {
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;

                const response = await fetch(
                    `${URL}/api/v1/procesos/get-process/${idProceso}/${version}`
                );
                const data = await response.text();
                console.log(data);
                setEmptyDiagram(data);
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [idProceso]);

    return (
        <>
            <div
                className="bg-[#ececec] rounded-lg pb-8 pt-5 ps-8 pe-8 shadow-[6px_6px_4px_#c0c0c0] h-[50%]
            "
            >
                <div className=" flex justify-between ">
                    <div className="flex space-x-3 items-center mb-4">
                        <FaDiagramProject fill="#666666" className="text-xl" />
                        <h1 className="text-xl">Flujo del proceso</h1>
                    </div>
                    <div>
                        <a
                            href={`/viewer-process/${idProceso}/${version}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                        >
                            <button className="text-gray-500 hover:text-gray-700 transition duration-300">
                                <SlSizeFullscreen className="text-2xl text-blue-500 hover:text-blue-700" />
                            </button>
                        </a>
                    </div>
                </div>
                <div className="h-[85%]">
                    <BpmnViewerModule2 height={"h-full"} />
                </div>
            </div>
        </>
    );
};
