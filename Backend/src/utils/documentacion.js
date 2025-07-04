import { getBpmnIcon } from "./bpmnUtils.js";

export const generarPortada = (macroNombre, dataUrl) => `
  <main class="portada">
    <div class="titulo">
      <hr />
      <h1>${macroNombre}</h1>
      <hr />
      <img src="${dataUrl}" alt="Diagrama BPMN" style="max-width: 50%; height: auto;" />
    </div>
  </main>
`;



export const generarContenidoMacroproceso = (procesos) =>
  procesos
    .filter((proceso) => proceso.name !== "Proceso principal")
    .map((proceso, index) => {
      const nombre = proceso.nombreReal || proceso.id;
      const descripcion = proceso.documentation?.[0]?.text || "Sin descripción";
      const elementos = (proceso.flowElements || []).filter((e) => e.name);

      return `
        <section>
          <h2>${index + 1}. ${nombre}</h2>
          <h3>Descripción</h3>
          <p>${descripcion}</p>
          <h3>${index + 1}.1 Elementos del proceso</h3>
          <ul>
            ${elementos
              .map((el, i) => {
                const desc = el.documentation?.[0]?.text || "Sin descripción";
                const icon = getBpmnIcon(el.$type);
                return `
                  <li>
                    <h4>${index + 1}.1.${i + 1} ${icon} <strong>${el.name}</strong></h4>
                    <p>${desc}</p>
                  </li>
                `;
              })
              .join("")}
          </ul>
        </section>
      `;
    })
    .join("");


export const generarContenidoProceso = (proceso) => {
  const nombre = proceso.nombreReal || proceso.id;

  if (nombre === "Proceso principal") return "";

  const descripcion = proceso.documentation?.[0]?.text || "Sin descripción";
  const elementos = (proceso.flowElements || []).filter(
    (e) => e.name && e.$type !== "bpmn:SequenceFlow"
  );

  return `
    <section style="page-break-before: always;">
      <h2>${nombre}</h2>
      <h3>Descripción</h3>
      <p>${descripcion}</p>

      <h3>Elementos del proceso</h3>
      <ul>
        ${elementos.map((el, i) => {
            const desc = el.documentation?.[0]?.text || "Sin descripción";
            const icon = getBpmnIcon(el.$type);
            console.log("Elemento",el);
            console.log("TIPO",el.$type);
          return `
            <li>
              <h4>${i + 1}. ${icon} <strong>${el.name}</strong></h4>
              <p>${desc}</p>
            </li>
          `;
        }).join("")}
      </ul>
    </section>
  `;
};


export const generarTemplateFinal = ({ portada, contenidoMacro, contenidoProcesos }) => `
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #1c1c1c;
        }
        h1 {
          text-align: center;
          color: #0a2f52;
        }
        h2 {
          color: #037d50;
          margin-top: 40px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
        }
        h3 {
          color: #444;
          margin-top: 20px;
        }
        h4 {
          margin-bottom: 5px;
          color: #065d85;
        }
        p {
          margin-top: 0;
          margin-bottom: 15px;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 20px;
        }
        main.portada {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .titulo {
          text-align: center;
          width: 100%;
          max-width: 600px;
        }
        .titulo h1 {
          margin: 30px 0;
          font-size: 24pt;
          font-weight: bold;
        }
        .titulo hr {
          border: none;
          border-top: 2px solid #000;
          margin: 0;
        }
        svg {
          vertical-align: middle;
          margin-left: 5px;
          height: 2em;
          stroke: #03689a;
          fill: #ecefff;
        }
      </style>
    </head>
    <body>
      ${portada}
      ${contenidoMacro}
      ${contenidoProcesos}
    </body>
  </html>
`;
