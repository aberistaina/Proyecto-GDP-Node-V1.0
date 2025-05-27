import { BpmnViewerModule2 } from "../../../../../BpmnModule/BpmnViewer2/BpmnViewerModule2";

export const ViewerProcessPage = () => {
    
    return (
        <div className="flex justify-center h-[80vh] ">
            <div className="w-[80%] flex h-full ">
                <BpmnViewerModule2 height={"h-full"} border = {true} />
            </div>
        </div>
    );
};
