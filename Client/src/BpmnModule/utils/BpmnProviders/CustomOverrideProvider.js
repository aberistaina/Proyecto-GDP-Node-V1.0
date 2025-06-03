export default class CustomOverrideProvider {
    constructor(propertiesPanel) {
        propertiesPanel.registerProvider(500, this);
    }

    getGroups(element) {
        return (groups) => {
            const gruposPermitidos = [
                "general",
                "documentation",
                "custom-process-properties-ejecutantes",
                "custom-process-properties-responsable",
                "custom-process-properties-consultado",
                "custom-process-properties-informado",
                "CamundaPlatform__ExtensionProperties"
            ];
            const gruposFiltrados = groups.filter((group) =>
                gruposPermitidos.includes(group.id)
            );
            return gruposFiltrados.map((group) => {
                // Filtrar grupo "general"
                 if (group.id === "general" && Array.isArray(group.entries)) {
                    const filteredEntries = group.entries.filter((entry) => {
                        return entry.id !== "id" && entry.id !== "isExecutable" && entry.id !== "processId" && entry.id !== "documentation" && entry.id !== "processName";
                    });
                    return {
                        ...group,
                        entries: filteredEntries,
                    };
                }
                // Filtrar solo la propiedad "nivelDeAprobacion" del grupo "extensionElements"
                if (
                    group.id === "CamundaPlatform__ExtensionProperties" &&
                    Array.isArray(group.items)
                ) {
                    const filteredItems = group.items.filter((item) => {
                        return item.label !== "ejecutantes" && item.label !== "responsable" && item.label !== "consultado" && item.label !== "informado";
                    });
                    return {
                        ...group,
                        items: filteredItems,
                    };
                }

                return group;
            });
        };
    }
}

CustomOverrideProvider.$inject = ["propertiesPanel"];
