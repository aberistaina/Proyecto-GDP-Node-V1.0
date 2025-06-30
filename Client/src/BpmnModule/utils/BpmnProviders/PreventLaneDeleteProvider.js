export default class PreventLaneDeleteProvider {
  constructor(eventBus) {
    // Prevenir visualmente (disable botón)
    eventBus.on("commandStack.shape.delete.canExecute", (event) => {
      const { shape } = event.context;
      if (shape.type === "bpmn:Lane" && shape.id.startsWith("Lane_")) {
        console.warn("No se puede eliminar el Lane Principal");
        return false;
      }
    });

    // Prevenir ejecución forzada 
    eventBus.on("commandStack.shape.delete.preExecute", (event) => {
      const { context } = event;
      const element = context.shape;

      if (element.type === "bpmn:Lane" && element.id.startsWith("Lane_")) {
        console.error("No se puede eliminar el Lane Principal");
      }
    });

    // También cubrir elements.delete (cuando se seleccionan múltiples elementos)
    eventBus.on("commandStack.elements.delete.canExecute", (event) => {
      const { elements } = event.context;
      const laneProhibido = elements.find(
        (el) => el.type === "bpmn:Lane" && el.id.startsWith("Lane_")
      );
      if (laneProhibido) {
        console.warn("No se puede eliminar el Lane Principal");
        return false;
      }
    });

    eventBus.on("commandStack.elements.delete.preExecute", (event) => {
      const { elements } = event.context;
      const laneProhibido = elements.find(
        (el) => el.type === "bpmn:Lane" && el.id.startsWith("Lane_")
      );
      if (laneProhibido) {
        console.error("No se puede eliminar el Lane Principal");
      }
    });
  }
}

PreventLaneDeleteProvider.$inject = ["eventBus"];
