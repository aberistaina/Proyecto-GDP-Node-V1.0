//Provider que le crea clases a todos los elementos para poder usar CSS en ellos

export default function CustomMarkerProvider(eventBus, canvas) {

    const markerMap = {
      "bpmn:StartEvent": "marker-start-event",
      "bpmn:EndEvent": "marker-end-event",
      "bpmn:IntermediateCatchEvent": "marker-intermediate-event",
      "bpmn:IntermediateThrowEvent": "marker-intermediate-event",
      "bpmn:BoundaryEvent": "marker-intermediate-event",
  
      "bpmn:ExclusiveGateway": "marker-exclusive-gateway",
      "bpmn:ParallelGateway": "marker-parallel-gateway",
      "bpmn:InclusiveGateway": "marker-inclusive-gateway",
      "bpmn:ComplexGateway": "marker-complex-gateway",
      "bpmn:EventBasedGateway": "marker-event-gateway",
  
      "bpmn:Task": "marker-task",
      "bpmn:UserTask": "marker-task",
      "bpmn:ManualTask": "marker-task",
      "bpmn:ServiceTask": "marker-service-task",
      "bpmn:ScriptTask": "marker-task",
      "bpmn:BusinessRuleTask": "marker-task",
      "bpmn:SendTask": "marker-task",
      "bpmn:ReceiveTask": "marker-task",
  
      "bpmn:CallActivity": "marker-call-activity",
      "bpmn:SubProcess": "marker-call-activity",
      "bpmn:AdHocSubProcess": "marker-call-activity",
      "bpmn:Transaction": "marker-call-activity",
    };
  
    eventBus.on("shape.added", function ({ element }) {
      const type = element.type;
      const marker = markerMap[type];
  
      if (marker) {
        canvas.addMarker(element.id, marker);
      }
    });
  }
  
  CustomMarkerProvider.$inject = ["eventBus", "canvas"];
  