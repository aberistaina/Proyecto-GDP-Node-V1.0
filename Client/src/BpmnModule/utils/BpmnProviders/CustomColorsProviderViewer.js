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
    applyColors();
});

eventBus.on("element.changed", ({ element }) => {
    applyColorsToElement(element);
});

function applyColors() {
    const allElements = elementRegistry.getAll();
    allElements.forEach((el) => applyColorsToElement(el));
}

function applyColorsToElement(el) {
    const type = el.type;
    const color = colorMap[type];
    if (!color) return;

    const gfx = canvas.getGraphics(el);
    if (!gfx) return;

    const visualGroup = gfx.querySelector(".djs-visual");
    if (!visualGroup) return;

    let shapeNode = null;

    if (type === "bpmn:StartEvent" || type === "bpmn:EndEvent") {
        shapeNode =
            visualGroup.querySelector("circle") ||
            visualGroup.querySelector("ellipse");
    } else if (type.includes("Gateway")) {
        shapeNode = visualGroup.querySelector("polygon") ||
                    visualGroup.querySelector(":scope > path");
    } else {
        shapeNode = visualGroup.querySelector("rect");
        if (!shapeNode) {
            const allPaths = Array.from(visualGroup.querySelectorAll("path"));
            for (let p of allPaths) {
                if (!p.classList.contains("djs-icon")) {
                    shapeNode = p;
                    break;
                }
            }
        }
    }

    if (shapeNode) {
        shapeNode.style.removeProperty("fill");
        shapeNode.style.removeProperty("stroke");

        svgAttr(shapeNode, {
            fill: color.fill,
            stroke: color.stroke,
        });
    }
}

}

CustomColorsProviderViewer.$inject = ["eventBus", "canvas", "elementRegistry"];
