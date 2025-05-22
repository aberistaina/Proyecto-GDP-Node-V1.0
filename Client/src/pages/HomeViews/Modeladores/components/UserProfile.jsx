
export const UserProfile = ({ usuario }) => {
    return (
        <div className="flex items-center gap-3">
            <img
            src={`https://robohash.org/${usuario.nombre}`}
            alt="Avatar usuario"
            className="w-28 h-28 object-cover rounded-full border border-gray-300 shadow"
            />
            <div>
                <p>👋 Bienvenido, <strong>{usuario.nombre}</strong></p>
                <p className="text-xs text-gray-500 px-7">{usuario.email}</p>
                <p className="text-xs text-gray-500 px-7">{usuario.cargo}</p>
                <p className="text-xs text-gray-500 px-7">Rol: {usuario.rol}</p>
            </div>
        </div>
    );
};
