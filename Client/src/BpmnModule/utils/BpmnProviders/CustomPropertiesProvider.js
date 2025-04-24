import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

export default {
  __init__: ['customPropertiesProvider'],
  customPropertiesProvider: ['type', function(propertiesPanel, translate) {
    propertiesPanel.registerProvider(500, {
      getGroups(element) {
        const bo = getBusinessObject(element);

        if (bo.$type === 'bpmn:Process') {
          return function(groups) {
            groups.push({
              id: 'processCustomGroup',
              label: 'Configuración del Proceso',
              entries: [
                {
                  id: 'approvalLevel',
                  component: TextFieldEntry,
                  isEdited: isTextFieldEntryEdited,
                  label: 'Nivel de Aprobación',
                  getValue: () => bo.approvalLevel || '',
                  setValue: (value) => {
                    bo.approvalLevel = value;
                    return [];
                  },
                  validate: (value) => {
                    if (value && isNaN(value)) {
                      return 'Debe ser un número';
                    }
                    return undefined;
                  }
                }
              ]
            });

            return groups;
          };
        }

        return function(groups) {
          return groups;
        };
      }
    });
  }]
};
