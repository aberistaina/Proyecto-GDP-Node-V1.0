import { BpmnViewerModule } from "../../../../../BpmnModule/BpmnViewer/BpmnViewerModule";

export const ViewerProcessPage = () => {
    
    return (
        <div className="flex justify-center ">
            <div className="w-full flex">
                <BpmnViewerModule border = {true} />
            </div>
        </div>
    );
};
