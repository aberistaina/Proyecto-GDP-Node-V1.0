export const documentacionTemplate = (procesos) => {
  const contenidoHTML = procesos.map(proceso => {
    const nombre = proceso.name || proceso.id;
    const elementos = (proceso.flowElements || []).filter(e => e.name);
    return `
      <section>
        <h2>📘 ${nombre}</h2>
        <ul>
          ${elementos.map(el => `
            <li>
              <strong>${el.$type.replace("bpmn:", "")}: ${el.name}</strong><br>
              ${el.documentation?.[0]?.text || "<em>Sin descripción</em>"}
            </li>
          `).join("")}
        </ul>
      </section>
    `;
  }).join("");

  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { text-align: center; }
          h2 { color: #333366; margin-top: 40px; }
          li { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>Documentación del Proceso BPMN</h1>
        ${contenidoHTML}
      </body>
    </html>
  `;
}
