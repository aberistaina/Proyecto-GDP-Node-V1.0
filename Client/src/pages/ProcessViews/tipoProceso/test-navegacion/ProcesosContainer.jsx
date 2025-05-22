import { useState, useEffect } from "react";
import { ProcesoNavegacion } from "./ProcesoNavegacion";
import { ProcesoTabla } from "./ProcesoTabla";
import { useParams } from "react-router-dom";

export const ProcesosContainer = () => {
  const [stack, setStack] = useState([]); // historial de navegación: nivel → proceso → subproceso → etc.
  const [procesos, setProcesos] = useState([]); // procesos visibles
  const [nivelActual, setNivelActual] = useState(null); // root nivel
  const { idNivel } = useParams()

  const procesoActual = stack[stack.length - 1] || null;


  const URL =
    import.meta.env.VITE_APP_MODE === "desarrollo"
      ? import.meta.env.VITE_URL_DESARROLLO
      : import.meta.env.VITE_URL_PRODUCCION;

  useEffect(() => {
    const fetchProcesos = async () => {
      try {
        if (!procesoActual) {
          // En nivel raíz: cargar macroprocesos
          const resNivel = await fetch(`${URL}/api/v1/procesos/get-nivel/${idNivel}`);
          const dataNivel = await resNivel.json();
          setNivelActual(dataNivel.data);

          const resProcesos = await fetch(`${URL}/api/v1/procesos/get-process-nivel/${idNivel}`);
          const dataProcesos = await resProcesos.json();
          const macroprocesos = dataProcesos.data.filter(p => p.macroproceso);
          setProcesos(macroprocesos);
        } else {
          // Cargar subprocesos del proceso actual
          const res = await fetch(`${URL}/api/v1/procesos/get-subprocess-process/${procesoActual.id_bpmn}`);
          const data = await res.json();
          setProcesos(data.data);
        }
      } catch (error) {
        console.error("Error cargando procesos:", error);
      }
    };

    fetchProcesos();
  }, [procesoActual, idNivel]);

  useEffect(() => {
  setStack([]);
}, [idNivel]);


  const entrarAProceso = (proceso) => {
    setStack(prev => [...prev, proceso]);
    console.log(procesoActual);
  };

  const volverA = (index) => {
    setStack(prev => prev.slice(0, index + 1));
  };

  const volverAlInicio = () => {
    setStack([]);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <ProcesoNavegacion
        nivel={nivelActual?.nombre}
        stack={stack}
        volverA={volverA}
        volverAlInicio={volverAlInicio}
      />
      <ProcesoTabla
        procesoActual={procesoActual}
        procesos={procesos}
        entrarAProceso={entrarAProceso}
      />
    </div>
  );
};
