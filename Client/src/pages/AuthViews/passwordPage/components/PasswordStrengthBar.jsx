import { useEffect, useState } from "react";

export const PasswordStrengthBar = ({ password }) => {

    const [strength, setStrength] = useState(0);

    const calculateStrength = (password) => {
        let score = 0;
        
        // Reglas de la contraseña
        if (password.length >= 8) score += 1; 
        if (password.length >= 12) score += 1; 
        if (/[A-Z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/^(?=(?:.*[A-Za-z]){4})(?=(?:.*\d){4})(?=(?:.*[@#$+=&]){1})[A-Za-z\d@#$+=&]{9,}$/.test(password)) score += 1;  

        return score;
    };
    
    useEffect(() => {
        setStrength(calculateStrength(password));
    }, [password]);


    const getStrengthLabel = () => {
        if (strength <= 2) return "Muy débil";
        if (strength === 3) return "Débil";
        if (strength === 4) return "Fuerte";
        return "Muy fuerte";
    };

    const getStrengthColor = () => {
        if (strength <= 2) return "bg-red-500"; 
        if (strength === 3) return "bg-orange-500"; 
        if (strength === 4) return "bg-green-500"
        return "bg-blue-500"
    };

    return (
        <div className="w-11/12 py-4">
            <div className="h-2 w-full bg-gray-300 rounded">
                <div className={`h-2 ${getStrengthColor()} rounded transition-all`} style={{ width: `${(strength / 5) * 100}%` }}></div>
            </div>
            <p className="text-sm mt-2 text-gray-700">Nivel: <span className="font-bold">{getStrengthLabel()}</span></p>
        </div>
    );
};
