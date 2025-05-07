import { is } from "bpmn-js/lib/util/ModelUtil";

import CustomPropertyList from "../../components/customProperties/CustomPropertyList";

export default class CustomPropertiesProvider {
  constructor(propertiesPanel, popupData) {
    this.propertiesPanel = propertiesPanel;
    this.popupVisible = popupData.popupVisible;
    this.setPopupVisible = popupData.setPopupVisible;
    this.setElementSeleccionado = popupData.setElementSeleccionado;
    this.setPropertyName = popupData.setPropertyName;

    propertiesPanel.registerProvider(500, this);
  }

  getGroups(element) {
    return (groups) => {
      // Campos del proceso general
      if (
        is(element, "bpmn:Process") ||
        is(element, "bpmn:Task") ||
        is(element, "bpmn:CallActivity")
    ) {
        groups.push({
          id: "custom-process-properties-ejecutantes",
          label: "Ejecutantes",
          entries: [
            {
              id: "ejecutantes",
              component: (props) =>
                CustomPropertyList({
                  ...props,
                  popupVisible: this.popupVisible,
                  setPopupVisible: this.setPopupVisible,
                  setElementSeleccionado: this.setElementSeleccionado,
                  setPropertyName: this.setPropertyName,
                  label: "Ejecutantes",
                  propertyName: "ejecutantes"
                }),
            },
            
          ],
        },
        {
            id: "custom-process-properties-responsable",
            label: "Responsables",
            entries: [
                {
                    id: "responsable",
                    component: (props) =>
                      CustomPropertyList({
                        ...props,
                        popupVisible: this.popupVisible,
                        setPopupVisible: this.setPopupVisible,
                        setElementSeleccionado: this.setElementSeleccionado,
                        setPropertyName: this.setPropertyName,
                        label: "Responsable",
                        propertyName: "responsable"
                      }),
                  },
              
            ],
          },
          {
            id: "custom-process-properties-consultado",
            label: "Consultado",
            entries: [
                {
                    id: "consultado",
                    component: (props) =>
                      CustomPropertyList({
                        ...props,
                        popupVisible: this.popupVisible,
                        setPopupVisible: this.setPopupVisible,
                        setElementSeleccionado: this.setElementSeleccionado,
                        setPropertyName: this.setPropertyName,
                        label: "Consultado",
                        propertyName: "consultado"
                      }),
                  }
              
            ],
          },
          {
            id: "custom-process-properties-informado",
            label: "Informado",
            entries: [
                {
                    id: "informado",
                    component: (props) =>
                      CustomPropertyList({
                        ...props,
                        popupVisible: this.popupVisible,
                        setPopupVisible: this.setPopupVisible,
                        setElementSeleccionado: this.setElementSeleccionado,
                        setPropertyName: this.setPropertyName,
                        label: "Informado",
                        propertyName: "informado"
                      }),
                  }
              
            ],
          }
    
    );
      }

      return groups;
    };
  }
}


CustomPropertiesProvider.$inject = ["propertiesPanel", "popupData"];

