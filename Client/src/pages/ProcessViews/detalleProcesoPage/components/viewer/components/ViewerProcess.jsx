import { useBpmnContext } from "../../../../../../BpmnModule/context/useBpmnContext";
import { useEffect } from "react";
import { BpmnViewer2 } from "../../../../../../BpmnModule/BpmnViewer2/components/BpmnViewer2";

export const ViewerProcess = ({idProceso, version}) => {

     const { setEmptyDiagram } = useBpmnContext();
        useEffect(() => {
            const getData = async () => {
                try {
                    const URL =
                        import.meta.env.VITE_APP_MODE === "desarrollo"
                            ? import.meta.env.VITE_URL_DESARROLLO
                            : import.meta.env.VITE_URL_PRODUCCION;
                            
                    const response = await fetch(`${URL}/api/v1/procesos/get-process/${idProceso}/${version}`)
                    const data = await response.text()
                    console.log(data);
                    setEmptyDiagram(data)
                } catch (error) {
                    console.log(error);
                }
            }
            getData()
        
        }, [idProceso])
  return (
    <div className="w-full h-[55%]">
        <BpmnViewer2 height={"h-full"} />
    </div>
    
  )
}
