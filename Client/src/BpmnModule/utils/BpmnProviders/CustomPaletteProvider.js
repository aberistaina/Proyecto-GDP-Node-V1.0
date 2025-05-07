import { v4 as uuidv4 } from "uuid";

export default function CustomIdProvider(
  palette,
  create,
  elementFactory,
  translate,
  bpmnFactory,
  canvas
) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.translate = translate;
  this.bpmnFactory = bpmnFactory;
  this.canvas = canvas;

  palette.registerProvider(this);
}

CustomIdProvider.$inject = [
  "palette",
  "create",
  "elementFactory",
  "translate",
  "bpmnFactory",
  "canvas"
];

CustomIdProvider.prototype.getPaletteEntries = function () {
    const { create, elementFactory, translate, bpmnFactory, canvas } = this;

  // Función reutilizable para crear cualquier tipo de elemento con UUID
  function createElementWithId(type, options = {}) {
    const id = `Id_${uuidv4()}`;
    const shape = elementFactory.createShape({
      type,
      ...options,
    });
    shape.id = id;
    shape.businessObject.id = id;
    return shape;
  }

  return function (entries) {
    // Eliminar herramientas no deseadas
    delete entries["create.subprocess-expanded"];
    delete entries["create.user-task"]

    // CallActivity personalizado (subproceso colapsado reutilizable)
    entries["create.subprocess-collapsed"] = {
      group: "activity",
      className: "bpmn-icon-subprocess-collapsed",
      title: translate("Create collapsed sub-process"),
      action: {
        dragstart: function (event) {
          const shape = createElementWithId("bpmn:CallActivity", {
            isExpanded: false,
          });
          shape.businessObject.calledElement = "";
          shape.businessObject.name = "";
          create.start(event, shape);
        },
        click: function (event) {
          const shape = createElementWithId("bpmn:CallActivity", {
            isExpanded: false,
          });
          shape.businessObject.calledElement = "";
          shape.businessObject.name = "";
          create.start(event, shape);
        },
      },
    };

    entries["create.laneset"] = {
        group: "structure",
        className: "bpmn-icon-lane",
        title: translate("Create Lane"),
        action: {
          dragstart: function (event) {
            const laneBusinessObject = bpmnFactory.create("bpmn:Lane", {
              id: `Id_${uuidv4()}`,
              name: "Nuevo Lane",
            });
  
            const laneShape = elementFactory.createShape({
              type: "bpmn:Lane",
              businessObject: laneBusinessObject,
              x: 100,
              y: 100,
              width: 1000,
              height: 200,
            });
  
            create.start(event, laneShape);
          },
          click: function (event) {
            const laneBusinessObject = bpmnFactory.create("bpmn:Lane", {
              id: `Id_${uuidv4()}`,
              name: "Nuevo Lane",
            });
  
            const laneShape = elementFactory.createShape({
              type: "bpmn:Lane",
              businessObject: laneBusinessObject,
              x: 100,
              y: 100,
              width: 1000,
              height: 200,
            });
  
            create.start(event, laneShape);
          },
        },
      };

    return entries;
  };
};
