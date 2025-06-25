
export const UserProfile = ({ usuario }) => {
    return (
        <div className="flex items-center justify-between gap-3 bg-[#3F3F40] h-[140px] rounded-lg px-5">
                    <div className="flex">
                        <div className="flex justify-center items-center">
                            <img
                                src={`https://robohash.org/${usuario.nombre}`}
                                alt="Avatar usuario"
                                className="w-24 h-24 object-cover rounded-full bg-white"
                            />
                        </div>
        
                        <div className="flex flex-col justify-center ">
                            <p className="text-4xl font-bold px-7 text-white">
                                Bienvenido,{" "}
                                <span className="font-bold">{usuario.nombre}</span>
                            </p>
        
                            <p className="text-xl font-light text-white px-7">
                                {usuario.cargo} - {usuario.rol}
                            </p>
                        </div>
                    </div>
                </div>
    );
};
