// utils/BpmnProviders/observer.js

export const startObserver = () => {
    const observer = new MutationObserver(() => {
        const header = document.querySelector(".bio-properties-panel-header");
        if (!header) return;

        const typeText = header.querySelector(
            ".bio-properties-panel-header-type"
        )?.textContent;

        const icon = header.querySelector(
            ".bio-properties-panel-header-icon svg path"
        );

        if (icon) {
            // Limpia clases anteriores
            icon.removeAttribute("class");

            // Aplica clase según tipo
            switch (typeText) {
                case "Task":
                    icon.classList.add("icon-task");
                    break;
                case "Service Task":
                    icon.classList.add("icon-service-task");
                    break;
                case "Evento de inicio":
                    icon.classList.add("icon-start-event");
                    break;
                case "End Event":
                    icon.classList.add("icon-end-event");
                    break;
                // agrega más casos según sea necesario
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return observer; // por si luego quieres `disconnect()`
};
