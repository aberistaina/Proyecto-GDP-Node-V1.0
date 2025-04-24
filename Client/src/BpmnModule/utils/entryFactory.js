export function textField({ id, label, modelProperty, get, set }) {
  return {
    id,
    html: `
  <div class="bpp-entry" style="margin-bottom: 1rem;">
    <label for="${id}">${label}</label>
    <input id="${id}" type="text" name="${modelProperty}" class="bpp-input"
           style="width: 100%; padding: 6px; border: 1px solid #ccc;" />
  </div>
`,
    get,
    set
  };
}
