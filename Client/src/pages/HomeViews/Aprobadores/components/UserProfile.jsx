
export const UserProfile = ({ usuario }) => {
    return (
        <div className="flex items-center gap-3">
            <div className="">
                <img
                src={`https://robohash.org/${usuario.nombre}`}
                alt="Avatar usuario"
                className="w-20 h-20 object-cover rounded-full shadow-[0_0_70px_35px_white]" 
                />
            </div>
            
            <div>
                <p className="text-2xl px-7">Bienvenido, <span className="font-semibold">{usuario.nombre}</span></p>
                
                <p className="text-xs text-gray-500 px-7">{usuario.cargo}</p>
                <p className="text-xs text-gray-500 px-7">{usuario.rol}</p>
            </div>
        </div>
    );
};
