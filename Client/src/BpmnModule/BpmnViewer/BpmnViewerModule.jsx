import { CustomMenuContextual } from "../components/CustomMenuContextual"
import { BpmnProvider } from "../context/BpmnProvider"
import { MenuContextListener } from "../context/MenuContextListener"
import { BpmnViewer } from "./components/BpmnViewer"
import { ModelerButtons } from "../components/ModelerButtons"
import { ProcessSelector } from "../components/ProcessSelector"



export const BpmnViewerModule = () => {
    
    return (
        <>
            <BpmnProvider>
            <div className="h-full w-full flex flex-col items-center justify-start ">
                <div className="w-[80%] space-y-8 mt-10">
                    <ProcessSelector modo="viewer" />
                    <CustomMenuContextual modo="viewer" />
                    <BpmnViewer />
                    <ModelerButtons modo="viewer" />
                    <MenuContextListener />
                </div>
            </div>
            </BpmnProvider>
        </>
    )
}
