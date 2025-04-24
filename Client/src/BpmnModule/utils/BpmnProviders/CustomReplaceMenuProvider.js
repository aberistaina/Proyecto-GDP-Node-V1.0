import {getBusinessObject, isAny} from 'bpmn-js/lib/util/ModelUtil';



export default function CustomReplaceMenuProvider(popupMenu, translate, elementTemplates) {

  this._popupMenu = popupMenu;
  this._translate = translate;
  this._elementTemplates = elementTemplates;

  this.register();
}

CustomReplaceMenuProvider.$inject = [
  'popupMenu',
  'translate',
  'elementTemplates'
];

CustomReplaceMenuProvider.prototype.register = function() {
  this._popupMenu.registerProvider('bpmn-replace', this);
};

/**
 * Adds the element templates to the replace menu.
 * @param {djs.model.Base} element
 *
 * @returns {Object}
 */
CustomReplaceMenuProvider.prototype.getPopupMenuEntries = function(element) {

  return (entries) => {

    // convert our entries into something sortable
    let entrySet = Object.entries(entries);

    // add template entries
    entrySet = [ ...entrySet, ...this.getTemplateEntries(element) ];

    // convert back to object
    return entrySet.reduce((entries, [ key, value ]) => {
      entries[key] = value;

      return entries;
    }, {});
  };
};

/**
 * Get all element templates that can be used to replace the given element.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of element templates as menu entries
 */
CustomReplaceMenuProvider.prototype.getTemplateEntries = function(element) {

  const templates = this._getMatchingTemplates(element);
  return templates.map(template => {

    const {
      icon = {},
      category,
    } = template;

    const entryId = `replace.template-${template.id}`;

    const defaultGroup = {
      id: 'templates',
      name: this._translate('Templates')
    };

    return [ entryId, {
      label: template.name,
      description: template.description,
      documentationRef: template.documentationRef,
      imageUrl: icon.contents,
      group: category || defaultGroup,
      action: () => {
        this._elementTemplates.applyTemplate(element, template);
      }
    } ];
  });
};

/**
 * Returns the templates that can the element can be replaced with.
 *
 * @param  {djs.model.Base} element
 *
 * @return {Array<ElementTemplate>}
 */
CustomReplaceMenuProvider.prototype._getMatchingTemplates = function(element) {
  return this._elementTemplates.getLatest().filter(template => {
    return isAny(element, template.appliesTo) && !isTemplateApplied(element, template);
  });
};


// helpers ////////////
export function isTemplateApplied(element, template) {
  const businessObject = getBusinessObject(element);

  if (businessObject) {
    return businessObject.get('zeebe:modelerTemplate') === template.id;
  }

  return false;
}