import { useState } from "react";

export const RegisterForm = () => {
    const [formUser, setFormUser] = useState({
        email: "",
        password: "",
        repeatPassword: ""
    });

    const handleChange = (e) => {
        setFormUser({ ...formUser, [e.target.name]: e.target.value });
    };

    const loginUser = (e) => {
        e.preventDefault();
        if(formUser.password !== formUser.repeatPassword){
            alert("Las contraseñas no coinciden")
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
            <h2 className="text-2xl font-bold text-center mb-6">Registro</h2>
            <form onSubmit={loginUser}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formUser.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formUser.password}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="repeatPassword" className="block text-gray-700">
                        Repite tu Contraseña
                    </label>
                    <input
                        type="password"
                        name="repeatPassword"
                        id="repeatPassword"
                        value={formUser.repeatPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#10644C] hover:bg-teal-600 text-white font-bold py-2 rounded"
                >
                    Registrarme
                </button>
            </form>
            <div className="mt-4 text-center">
                <p className="text-gray-600">
                    <a href="/register" className="text-[#10644C] hover:text-teal-600"> ¿Ya tienes una cuenta?</a>
                </p>
            </div>
        </div>
    );
}
