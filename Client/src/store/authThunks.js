import { loginSuccess, logout, setLoading } from "./authSlice";

export const fetchUsuario = () => async (dispatch) => {
    dispatch(setLoading(true));


    try {
        const response = await fetch("http://localhost:3000/api/v1/auth/me", {
            credentials: "include",
        });

        if (!response.ok) throw new Error("No autenticado");

        const data = await response.json();
        dispatch(loginSuccess(data));
    } catch (error) {
        dispatch(logout());
    }
};

export const logoutUsuario = () => async (dispatch) => {
    try {
        await fetch("http://localhost:3000/api/v1/auth/logout",{
            method: "POST",
            credentials: "include",
        });

        dispatch(logout());
    } catch (error) {
        console.error("Error al hacer logout:", error);
    }
};
