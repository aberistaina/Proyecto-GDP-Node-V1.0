import { createContext, useContext, useState } from "react";

const ConfirmAlertContext = createContext();

export const ConfirmAlertProvider = ({ children }) => {
    const [dialog, setDialog] = useState(null);

    const showDialog = (type, message, options = {}) =>
        new Promise((resolve) => {
            setDialog({
                type,
                message,
                title:
                    options.title ||
                    (type === "confirm" ? "¿Estás seguro?" : "Alerta"),
                confirmText: options.confirmText || "Confirmar",
                cancelText: options.cancelText || "Cancelar",
                okText: options.okText || "OK",
                resolve,
            });
        });

    const confirm = (message, options = {}) =>
        showDialog("confirm", message, options);
    const alert = (message, options = {}) =>
        showDialog("alert", message, options);

    const handleClose = (result) => {
        dialog?.resolve(result);
        setDialog(null);
    };

    return (
        <ConfirmAlertContext.Provider value={{ confirm, alert }}>
            {children}

            {dialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-xl">
                        <h2 className="text-xl font-semibold mb-4">
                            {dialog.title}
                        </h2>
                        <p className="mb-6 text-gray-700">{dialog.message}</p>

                        <div className="flex justify-center gap-4">
                            {dialog.type === "confirm" ? (
                                <>
                                    <button
                                        onClick={() => handleClose(false)}
                                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                                    >
                                        {dialog.cancelText}
                                    </button>
                                    <button
                                        onClick={() => handleClose(true)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                    >
                                        {dialog.confirmText}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleClose(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    {dialog.okText}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </ConfirmAlertContext.Provider>
    );
};

export const useConfirmAlert = () => useContext(ConfirmAlertContext);
