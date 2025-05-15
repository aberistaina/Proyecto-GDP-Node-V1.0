import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomeViews/HomePage";
import { LoginPage } from "./pages/AuthViews/loginPage/LoginPage";
import { RegisterPage } from "./pages/AuthViews/registerPage/RegisterPage";
import { PasswordPage } from "./pages/AuthViews/passwordPage/PasswordPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TipoProcesoPage } from "./pages/ProcessViews/tipoProceso/TipoProcesoPage";

import { UpdatePasswordPage } from "./pages/AuthViews/updatePasswordPage/UpdatePasswordPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUsuario } from "./store/authThunks";
import { Layout } from "./components/Layout";
import { BpmnViewerModule } from "./BpmnModule/BpmnViewer/BpmnViewerModule";
import { ConfirmAlertProvider } from "./context/ConfirmAlertProvider";
import { UploadProcessPage } from "./BpmnModule/components/UploadProcess/UploadProcessPage";
import { BpmnDesignerModule } from "./BpmnModule/BpmnDesigner/BpmnDesignerModule";
import { DetalleProcesoPage } from "./pages/ProcessViews/detalleProcesoPage/DetalleProcesoPage";
import { AprobadoresHome } from "./pages/HomeViews/Aprobadores/AprobadoresHome";
import { AdminDashboard } from "./pages/AdminViews/AdminDashboard";

function App() {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchUsuario())
    }, [])

    return (
        <BrowserRouter>
            <ConfirmAlertProvider> 
                <Routes>
                    {/* Rutas públicas sin Layout */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/recover-password" element={<PasswordPage />} />
                    <Route path="/update-password" element={<UpdatePasswordPage />} />

                    {/* RUTA TEST BPMN */}
                    <Route element={<Layout />}>
                        <Route path="/bpmn" element={<BpmnViewerModule />} />
                        <Route path="/bpmnModeler" element={<BpmnDesignerModule />} />
                        <Route path="/subproceso/:idSubproceso" element={<BpmnViewerModule />} />
                        <Route path="/subproceso/:callActivity/:idProcesoPadre" element={<BpmnDesignerModule />} />
                        <Route path="/upload-process" element={<UploadProcessPage />} />
                        <Route path="/process-details/:idProceso" element={<DetalleProcesoPage />} />
                        <Route path="/process-details/:idProceso/:version" element={<DetalleProcesoPage />} />
                        <Route path="/new-version/:idProceso/:version" element={<BpmnDesignerModule />} />

                        <Route path="/aprobador" element={<AprobadoresHome />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                    {/* RUTA TEST BPMN */}

                    {/* Rutas protegidas con Layout */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/tipo-proceso/:idNivel" element={<TipoProcesoPage />}/>
                        </Route>
                    </Route>
                </Routes>
            </ConfirmAlertProvider>
        </BrowserRouter>
    );
}

export default App;
