export default class CustomPropertiesProvider {
    constructor(propertiesPanel) {
        propertiesPanel.registerProvider(500, this);
    }

    getGroups() {
        return (groups) => {
            
            return groups
                /* .filter((group) => group.id !== "CamundaPlatform__HistoryCleanup" && 
                group.id !== "CamundaPlatform__Form" && 
                group.id !== "CamundaPlatform__ExecutionListener" &&
                group.id !== "CamundaPlatform__AsynchronousContinuations"
                
            ) */
                .map((group) => {
                    if (group.entries) {
                        group.entries.forEach((entry) => {
                        });
                      }
                    if (group.id === "general" && Array.isArray(group.entries)) {
                        return {
                            ...group,
                            entries: group.entries.filter(
                                (entry) => entry.id !== "id" && entry.id !== "isExecutable"
                                
                            ),
                            
                        };
                    }
                    return group;
                });
        };
    }
}

CustomPropertiesProvider.$inject = ["propertiesPanel"];
