import { useState, useEffect, useRef } from "react";
import { CustomMenuContextual } from "../components/CustomMenuContextual";
import { BpmnProvider } from "../context/BpmnProvider";
import { MenuContextListener } from "../context/MenuContextListener";
import { BpmnModeler } from "./components/BpmnModeler";
import { ModelerButtons } from "../components/ModelerButtons";
import { ProcessSelector } from "../components/ProcessSelector";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { UploadProcessPage } from "../components/UploadProcess/UploadProcessPage";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useConfirmAlert } from "../../context/ConfirmAlertProvider";
import { ModalSaveChanges } from "./components/ModalSaveChanges";
import { BpmnDesignerButtons } from "./components/BpmnDesignerButtons";

export const BpmnDesignerModule = () => {
    const [showModal, setShowModal] = useState(false);
    const [showModalSaveChanges, setShowModalSaveChanges] = useState(false);
    const [idProcessSocket, setIdProcessSocket] = useState("");


    
    const navigate = useNavigate();
    const { confirm, alert } = useConfirmAlert();

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:3000");

        socketRef.current.on("connect", () => {
            console.log("Conectado al socket con ID:", socketRef.current.id);
        });

        //Asignar proceso a un socket id y bloquearlo
        socketRef.current.on("bloqueo-concedido", (idProceso) => {});

        //Denegar acceso si el proceso ya está asignado a otro socket id
        socketRef.current.on("bloqueo-denegado", (idProceso) => {
            const handleConfirm = async () => {
                const confirmacion = await confirm(
                    "Hay otro usuario modificando el diagrama, ¿desea tomar el control o entrar en modo visualizador?",
                    {
                        title: "Alerta",
                        confirmText: "Tomar El control",
                        cancelText: "Solo Visualizar",
                    }
                );
                if (confirmacion) {
                    //Quitar control sobre el proceso
                    socketRef.current.emit("solicitar-control", idProceso);
                } else {
                    navigate(`/subproceso/${idProceso}`);
                }
            };
            handleConfirm();
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        socketRef.current.on("control-revocado", (idProceso) => {
            alert(
                "Otro usuario ha tomado el control de este proceso. Serás redirigido al visor en modo solo lectura."
            );
            navigate(`/subproceso/${idProceso}`);
        });

        return () => {
            socketRef.current.off("control-revocado");
        };
    }, []);

    useEffect(() => {
        if (socketRef.current && idProcessSocket) {
            socketRef.current.emit("solicitar-bloqueo", idProcessSocket);
        }
    }, [idProcessSocket]);

    return (
        <>
            <BpmnProvider>
                <div className="h-full w-full flex flex-col items-center justify-start ">
                    <div className="w-[80%] space-y-8 mt-10 mb-10">
                        {/* <ProcessSelector
                            setIdProcessSocket={setIdProcessSocket}
                            setShowModal={setShowModal}
                        /> */}
                        <BpmnDesignerButtons setShowModalSaveChanges={setShowModalSaveChanges} />
                        <CustomMenuContextual modo="designer" />
                        <div className="flex space-x-3">
                            <BpmnModeler />
                            <PropertiesPanel />
                        </div>
                        {/* <ModelerButtons modo="designer" setShowModalSaveChanges={setShowModalSaveChanges} /> */}
                        <MenuContextListener />

                        {/* Modal para Guardar cambios proceso */}
                        {showModalSaveChanges && (
                            <ModalSaveChanges
                            setShowModalSaveChanges={setShowModalSaveChanges}
                            />
                        )}
                        
                        {/* <ProcessSelector setShowModal={setShowModal} setIdProcessSocket={setShowModal} modo="designer" /> */}

                        {/* Modal para subir un proceso */}
                        {showModal && (
                            <UploadProcessPage setShowModal={setShowModal} />
                        )}
                    </div>
                </div>
            </BpmnProvider>
        </>
    );
};
