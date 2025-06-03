import { attr as svgAttr } from "tiny-svg";

export default function CustomColorsProviderViewer(
    eventBus,
    canvas,
    elementRegistry
) {
    const colorMap = {
        "bpmn:StartEvent": { fill: "#e6ff97", stroke: "#86bb49" },
        "bpmn:EndEvent": { fill: "#eeaaaa", stroke: "#a31515" },

        // TAREAS
        "bpmn:Task": { fill: "#ecefff", stroke: "#03689a" },
        "bpmn:UserTask": { fill: "#ecefff", stroke: "#03689a" },
        "bpmn:ServiceTask": { fill: "#ecefff", stroke: "#03689a" },
        "bpmn:ManualTask": { fill: "#ecefff", stroke: "#03689a" },
        "bpmn:BusinessRuleTask": { fill: "#ecefff", stroke: "#03689a" },
        "bpmn:SendTask": { fill: "#ecefff", stroke: "#03689a" },
        "bpmn:ReceiveTask": { fill: "#ecefff", stroke: "#03689a" },

        // GATEWAYS
        "bpmn:ExclusiveGateway": { fill: "#ffffcc", stroke: "#b9b94e" },
        "bpmn:ParallelGateway": { fill: "#ffffcc", stroke: "#b9b94e" },
        "bpmn:InclusiveGateway": { fill: "#ffffcc", stroke: "#b9b94e" },

        // OTROS
        "bpmn:CallActivity": { fill: "#ecefff", stroke: "#03689a" },
        "bpmn:SubProcess": { fill: "#ecefff", stroke: "#03689a" },
        "bpmn:IntermediateCatchEvent": { fill: "#fefbf6", stroke: "#aba76b" },
        "bpmn:BoundaryEvent": { fill: "#fefbf6", stroke: "#aba76b" },
    };

    eventBus.on("import.done", () => {
        const allElements = elementRegistry.getAll();

        Object.entries(colorMap).forEach(([type, color]) => {
            const elements = allElements.filter((el) => el.type === type);

            elements.forEach((el) => {
                const gfx = canvas.getGraphics(el);
                if (!gfx) {
                    return;
                }

                const visualGroup = gfx.querySelector(".djs-visual");
                if (!visualGroup) {
                    return;
                }

                let shapeNode = null;

                // 1) Eventos de inicio/fin: <circle> o <ellipse>
                if (type === "bpmn:StartEvent" || type === "bpmn:EndEvent") {
                    shapeNode =
                        visualGroup.querySelector("circle") ||
                        visualGroup.querySelector("ellipse");
                }
                // 2) Gateways: buscamos primero <polygon> (Bizagi), si no hay, tomamos <path> (bpmn-js)
                else if (type.includes("Gateway")) {
                    shapeNode = visualGroup.querySelector("polygon");
                    if (!shapeNode) {
                        shapeNode = visualGroup.querySelector(":scope > path");
                    }
                }
                // 3) Tareas / callActivity / subProcess: <rect> o, si no lo hay (Bizagi), un <path> genérico
                else {
                    shapeNode = visualGroup.querySelector("rect");
                    if (!shapeNode) {
                        // Recorremos todos los <path> y descartamos los que sean iconos internos
                        const allPaths = Array.from(
                            visualGroup.querySelectorAll("path")
                        );
                        for (let p of allPaths) {
                            if (!p.classList.contains("djs-icon")) {
                                shapeNode = p;
                                break;
                            }
                        }
                    }
                }

                // 4) Si existe shapeNode, removemos estilo inline y aplicamos el color
                if (shapeNode) {
                    shapeNode.style.removeProperty("fill");
                    shapeNode.style.removeProperty("stroke");

                    svgAttr(shapeNode, {
                        fill: color.fill,
                        stroke: color.stroke,
                    });
                }
            });
        });
    });
}

CustomColorsProviderViewer.$inject = ["eventBus", "canvas", "elementRegistry"];
