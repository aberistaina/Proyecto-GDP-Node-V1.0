//Provider que modifica el PopUp del Context Pad el que tiene un ícono de 🔧, se eliminaron los items relacionados a subprocesos

export default function CustomReplaceUpdaterProvider(popupMenu) {

    popupMenu.registerProvider("bpmn-replace", {
        getPopupMenuEntries(element) {

            return (entries) => {
                const removeKeys = [
                    "replace-with-collapsed-subprocess",
                    "replace-with-expanded-subprocess",
                    "replace-with-collapsed-ad-hoc-subprocess",
                    "replace-with-ad-hoc-subprocess",
                ];

                const filtered = {};

                Object.entries(entries).forEach(([key, entry]) => {
                    if (!removeKeys.includes(key)) {
                        filtered[key] = entry;
                    } else {
                        return
                    }
                });

                return filtered;
            };
        },
    });
}

CustomReplaceUpdaterProvider.$inject = ["popupMenu", "translate"];
