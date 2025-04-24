import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PulseLoader from "react-spinners/PulseLoader";
import { validarPassword } from "../../../../utils/validators";
import { PasswordStrengthBar } from "./PasswordStrengthBar";
import { useSnackbar } from "notistack";
import  { fetchHook } from "../../../../hooks/fetchHook";

export const ChangePassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate(); 
    const { enqueueSnackbar } = useSnackbar();
    const email = searchParams.get("email")
    const token = searchParams.get("token")

    const [strongBar, setStrongBar] = useState(false)
    const [formPassword, setFormPasword] = useState({
        password: "",
        repeatPassword: "",
    });

    //Usestate para mostrar u ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    //Usestate para gestionar errores al ingresar datos en los inputs
    const [error, setError] = useState({
        passwordsMatch: false,
        passwordStrength: false,
    });

    //Estado de login para el boton de carga
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setError({ ...error, passwordStrength: false, passwordsMatch: false });
        setFormPasword({ ...formPassword, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        
            e.preventDefault()
            setIsLoading(true)
        try {
            if(!validarPassword(formPassword.password)){
                setError({ ...error, passwordStrength: true });
                return;
            }
            if(formPassword.password !== formPassword.repeatPassword){
                setError({ ...error, passwordsMatch: true });
                return;
            }

            const body = {
                email,
                password: formPassword.password
            }
    
            const data = await fetchHook("http://localhost:3000/api/v1/auth/change-password", "POST", body, token);
            
            if(data.code === 200){
                enqueueSnackbar("Contraseña Modificada con éxito", { variant: "success" });
                navigate("/login", { replace: true })
            }else{
                enqueueSnackbar(data.message, { variant: "error" });
                setIsLoading(false)
            }
            
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
            <h2 className="text-2xl font-bold text-center mb-6">
                Restablecer contraseña
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">
                        Contraseña Nueva
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={formPassword.password}
                            onChange={handleChange}
                            onFocus={() => setStrongBar(true)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                            required
                        />
                        {showPassword ? (
                            <FaEyeSlash
                                className="text-gray-500 text-xl cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        ) : (
                            <FaEye
                                className="text-gray-500 text-xl cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        )}
                    </div>
                    {strongBar && <PasswordStrengthBar password={formPassword.password} />}

                    <label htmlFor="repeatPassword" className="block text-gray-700">
                        Repite tu contraseña
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type={showRepeatPassword ? "text" : "password"}
                            name="repeatPassword"
                            id="repeatPassword"
                            value={formPassword.repeatPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                            required
                        />
                        {showRepeatPassword ? (
                            <FaEyeSlash
                                className="text-gray-500 text-xl cursor-pointer"
                                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                            />
                        ) : (
                            <FaEye
                                className="text-gray-500 text-xl cursor-pointer"
                                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                            />
                        )}
                    </div>
                </div>
                {error && <span className="text-red-600 font-semibold text-sm">
                    {
                        error.passwordStrength ? "La contraseña debe tener al menos 9 caracteres: 4 números, 4 letras y un carácter especial (@#$+=&)" : error.passwordsMatch ? "Las contraseñas no coinciden" : null
                    } </span>}
                <button
                    type="submit"
                    className="w-full bg-[#10644C] hover:bg-teal-600 text-white font-bold py-2 mt-6 rounded flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <PulseLoader color="#ffffff" size={10} />
                    ) : (
                        "Cambiar Contraseña"
                    )}
                </button>
            </form>
            
        </div>
    );
};
