import { BpmnViewerModule } from "../../../../../BpmnModule/BpmnViewer/BpmnViewerModule";

export const ViewerProcessPage = () => {
    
    return (
        <div className="flex justify-center h-[80vh] ">
            <div className="w-[80%] flex h-full ">
                <BpmnViewerModule height={"h-full"} border = {true} />
            </div>
        </div>
    );
};
