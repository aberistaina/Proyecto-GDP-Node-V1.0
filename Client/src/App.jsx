import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { BpmnDesignerModule } from "./BpmnModule/BpmnDesigner/BpmnDesignerModule";
import { DetalleProcesoPage } from "./pages/ProcessViews/detalleProcesoPage/DetalleProcesoPage";
import { AprobadoresHome } from "./pages/HomeViews/Aprobadores/AprobadoresHome";
import { AdminDashboard } from "./pages/HomeViews/AdminViews/AdminDashboard";
import { UnauthorizedPage } from "./pages/Unauthorized/UnauthorizedPage";
import { VisualizadorProceso } from "./pages/ProcessViews/detalleProcesoPage/components/VisualizadorProceso";
import { ViewerProcessPage } from "./pages/ProcessViews/detalleProcesoPage/components/viewer/ViewerProcessPage";
import { BpmnViewerModule2 } from "./BpmnModule/BpmnViewer2/BpmnViewerModule2";

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

                    {/* RUTAS SUPER ADMINISTRADOR */}
                    <Route element={<ProtectedRoute roles={[5]} />}>
                        <Route element={<Layout />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            
                        </Route>
                    </Route>


                    {/* RUTAS ADMINISTRADOR */}
                    <Route element={<ProtectedRoute roles={[1, 5]} />}>
                        <Route element={<Layout />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Route>
                    </Route>

                    {/* RUTAS APROBADOR */}
                    <Route element={<ProtectedRoute roles={[1, 2, 5]} />}>
                        <Route element={<Layout />}>
                            <Route path="/aprobador" element={<AprobadoresHome />} />
                        </Route>
                    </Route>

                    {/* RUTAS DISEÑADOR */}
                    <Route element={<ProtectedRoute roles={[1, 3, 5]} />}>
                        <Route element={<Layout />}>
                            <Route path="/new-version/:idProceso/:version" element={<BpmnDesignerModule />} />
                            <Route path="/bpmnModeler" element={<BpmnDesignerModule />} />
                        </Route>
                    </Route>

                    {/* RUTAS COMPARTIDAS */}

                    <Route element={<ProtectedRoute roles={[1, 2, 3, 4, 5]} />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/tipo-proceso/:idNivel" element={<TipoProcesoPage />}/>
                            <Route path="/process-details/:idProceso" element={<DetalleProcesoPage />} />
                            <Route path="/process-details/:idProceso/:version" element={<DetalleProcesoPage />} />
                            <Route path="/viewer-process/:idProceso/:version" element={<ViewerProcessPage />} />
                        </Route>
                    </Route>

                    
                    
                    {/* RUTA TEST BPMN */}
                    <Route element={<Layout />}>
                        <Route path="/bpmn" element={<BpmnViewerModule />} />
                        <Route path="/bpmnModeler" element={<BpmnDesignerModule />} />
                        
                        <Route path="/subproceso/:callActivity/:idProcesoPadre" element={<BpmnDesignerModule />} />
                        
                    </Route>
                    {/* RUTA TEST BPMN */}
                    
                    {/*TODAS LAS DEMÁS REDIRIGEN AL LOGIN*/}
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </ConfirmAlertProvider>
        </BrowserRouter>
    );
}

export default App;
