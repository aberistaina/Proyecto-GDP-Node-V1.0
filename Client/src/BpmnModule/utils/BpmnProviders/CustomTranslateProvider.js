//Provider que traduce todos los elementos de la librería bpmn

import translations from './bpmnTranslate';

export default function customTranslate(template, replacements) {
  replacements = replacements || {};

  // Traducción literal
  template = translations[template] || template;

  // Reemplazos tipo {foo}
  return template.replace(/{([^}]+)}/g, function(_, key) {
    return replacements[key] || '{' + key + '}';
  });
}
