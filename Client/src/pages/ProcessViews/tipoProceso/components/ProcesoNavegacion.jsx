export const ProcesoNavegacion = ({ nivel, stack, volverA, volverAlInicio }) => {
  return (
    <div className="text-sm mb-4 text-gray-700 flex gap-2 items-center">
      <span className="cursor-pointer text-emerald-600 font-medium" onClick={volverAlInicio}>
        {nivel || "Procesos Operativos"}
      </span>
      {stack.map((p, idx) => (
        <span key={p.id_bpmn} className="flex items-center gap-2">
          <span className="text-gray-400">›</span>
          <span
            className="cursor-pointer text-emerald-600"
            onClick={() => volverA(idx)}
          >
            {p.nombre}
          </span>
        </span>
      ))}
    </div>
  );
};
