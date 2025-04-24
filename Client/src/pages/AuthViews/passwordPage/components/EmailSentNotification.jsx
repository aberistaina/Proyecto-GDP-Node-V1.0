import { useState, useEffect } from "react";

export const EmailSentNotification = ({ handleReEmailSent }) => {
    const [email, setEmail] = useState("")

    useEffect(() => {
        setEmail(localStorage.getItem("email"))
    }, [])
    
    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
            <h2 className="text-2xl font-bold text-center mb-6">
                Restablecer contraseña
            </h2>
            <h4 className=" mb-4 text-center">
                Hemos enviado un correo electrónico al correo <span className="font-bold">{email}</span> con un un enlace para reestablecer tu contraseña
            </h4>
            <div className="text-sm text-gray-500 text-center mb-4">
                    <span className="text-red-500">¿No has recibido ningún correo electrónico?</span> 
                    <span onClick={() => handleReEmailSent(1)} className="text-teal-500 hover:text-[#10644C] ms-1 cursor-pointer">Reenviar correo electrónico</span>
                </div>
        </div>
    );
};
