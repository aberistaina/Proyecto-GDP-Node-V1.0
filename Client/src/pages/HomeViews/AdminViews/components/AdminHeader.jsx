export const AdminHeader = ({usuario}) => {
  return (
    <div className="flex items-center gap-3">
            
            <div>
                <p className="text-2xl px-7">Bienvenido, <span className="font-semibold">{usuario.nombre}</span></p>
                
                <p className="text-xs text-gray-500 px-7">{usuario.cargo}</p>
                <p className="text-xs text-gray-500 px-7">{usuario.rol}</p>
            </div>
        </div>
  );
};
