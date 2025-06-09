// Función para Exportar el diagrama como XML (se muestra solo en consola de momento)
export const exportDiagramXml = async (bpmnModelerRef) => {
    try {
        if (bpmnModelerRef.current) {
            const { xml } = await bpmnModelerRef.current.saveXML({
                format: true,
            });
            return xml;
        }
    } catch (err) {
        console.error("Error al exportar el diagrama:", err);
        return null;
    }
};
export const cleanXml = (xmlString) => {
    return xmlString.replace(
        /<documentation>([\s\S]*?)<\/documentation>/gi,
        (_, contenido) => {
            const decoded = new DOMParser().parseFromString(
                contenido,
                "text/html"
            ).body.textContent;
            const textoPlano = decoded.replace(/<[^>]*>/g, "").trim();
            return `<documentation>${textoPlano}</documentation>`;
        }
    );
};

// Función para Importar un diagrama en Bpmn
export const importDiagram = (event, bpmnModelerRef) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const xml = e.target.result;
        const cleanedXml = cleanXml(xml);
        try {
            await bpmnModelerRef.current.importXML(cleanedXml);
        } catch (err) {
            console.error("Error al importar el diagrama:", err);
        }
    };
    reader.readAsText(file);
};

// Generar archivo BPMN a partir del contenido XML
export const generateBpmnFile = (xmlContent, nombre = "diagrama.bpmn") => {
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${nombre}.bpmn`;
    link.click();
};

// Crear un diagrama vacío
export const createDiagram = async (bpmnModelerRef, diagrama) => {
    try {
        const { current: modeler } = bpmnModelerRef;
        if (!modeler) {
            console.error("Modeler no está inicializado.");
            return;
        }
        const { warnings } = await modeler.importXML(diagrama);

        const canvas = modeler.get("canvas");

        const viewbox = canvas.viewbox();

        canvas.zoom();
        canvas.scroll({ dx: viewbox.width / 10, dy: 0 });
    } catch (err) {
        console.error("Error al crear el diagrama:", err);
    }
};

// Función para extraer el ID del proceso actual
export const getCurrentProcessId = async (xmlString) => {
    if (xmlString.includes("bizagi")) {
        const regex = /<process id="([^"]+)" name="([^"]+)">/g;
        let match;
        let counter = 0;

        while ((match = regex.exec(xmlString)) !== null) {
            counter++;
            if (counter === 2) {
                return { id: match[1], name: match[2] };
            }
        }
    } else {
        const regex =
            /<bpmn:process id="([^"]+)" name="([^"]+)" isExecutable="false">/g;
        let match = regex.exec(xmlString);

        if (match) {
            return { id: match[1], name: match[2] };
        }
    }

    return null;
};

export const extraerIdSubproceso = async (xmlString) => {
    const regex =
        /<(?:bpmn:)?callActivity\b[^>]*\bid="([^"]*)"[^>]*\bname="([^"]*)"[^>]*\bcalledElement="([^"]*)"[^>]*>(?:<\/\w+:callActivity>)?/g;
    let match;

    while ((match = regex.exec(xmlString)) !== null) {
        return {
            calledActivity: match[1],
            name: match[2],
            calledElement: match[3],
        };
    }

    return null;
};

export const guardarImagenFlujo = async (
  bpmnModeler,
  idProceso = "imagen-flujo"
) => {
  if (!bpmnModeler) {
    console.error(
      "No se pudo generar la imágen, intente nuevamente más tarde"
    );
    return;
  }

  try {
    // 1) Obtenemos el SVG (string) de bpmn-js
    let { svg } = await bpmnModeler.saveSVG();

    // ——— DEBUG: Mostrar los primeros 500 caracteres del SVG original ———
    console.group("▶▶ SVG original (primeros 500 caracteres) ◀◀");
    console.log(svg.slice(0, 500));
    console.groupEnd();

    // 2) Buscamos viewBox="minX minY vbWidth vbHeight"
    const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);

    if (viewBoxMatch) {
      // 3) Dividimos la cadena interna de viewBox en cuatro valores
      const parts = viewBoxMatch[1].trim().split(/\s+/);
      const minX = parts[0];
      const minY = parts[1];
      const vbWidth = parts[2];
      const vbHeight = parts[3];

      console.log(
        `→ viewBox detectado: minX=${minX}, minY=${minY}, width=${vbWidth}, height=${vbHeight}`
      );

      // 4) Inyectamos el <rect> de fondo en coordenadas del viewBox
      svg = svg.replace(
        /<svg([^>]*)>/,
        `<svg$1><rect x="${minX}" y="${minY}" width="${vbWidth}" height="${vbHeight}" fill="white" />`
      );

      console.info("✅ Se inyectó el <rect> de fondo según el viewBox.");
    } else {
      // 5) Si no encontramos viewBox, usamos fallback 100% x 100%
      console.warn(
        "⚠️ No se detectó viewBox. Se inyectará <rect width='100%' height='100%'> (puede quedar fuera)."
      );
      svg = svg.replace(
        /<svg([^>]*)>/,
        '<svg$1><rect x="0" y="0" width="100%" height="100%" fill="white" />'
      );
    }

    // ——— DEBUG: Mostrar los primeros 500 caracteres del SVG modificado ———
    console.group("▶▶ SVG modificado (primeros 500 caracteres) ◀◀");
    console.log(svg.slice(0, 500));
    console.groupEnd();

    // 6) Convertimos el SVG en una imagen y la descargamos
    const image = new Image();
    const svgBlob = new Blob([svg], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");

      // 7) Pintamos primero el fondo completo de blanco (por si algo falla)
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // 8) Luego dibujamos el SVG sobre ese fondo blanco
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `${idProceso}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
      });
    };

    image.onerror = (e) => {
      console.error("Error cargando imagen del SVG", e);
    };

    image.src = url;
  } catch (error) {
    console.error("Error inesperado o al guardar SVG:", error);
  }
};

export const crearImagenFlujo = async (
  bpmnModeler,
  idProceso = "imagen-flujo"
) => {
  if (!bpmnModeler) {
    console.error("No se pudo generar la imagen, el modelador no está disponible.");
    return null;
  }

  try {
    const { svg } = await bpmnModeler.saveSVG();

    const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
    let svgMod = svg;

    if (viewBoxMatch) {
      const [minX, minY, vbWidth, vbHeight] = viewBoxMatch[1].trim().split(/\s+/);
      svgMod = svg.replace(
        /<svg([^>]*)>/,
        `<svg$1><rect x="${minX}" y="${minY}" width="${vbWidth}" height="${vbHeight}" fill="white" />`
      );
    } else {
      svgMod = svg.replace(
        /<svg([^>]*)>/,
        '<svg$1><rect x="0" y="0" width="100%" height="100%" fill="white" />'
      );
    }

    const svgBlob = new Blob([svgMod], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();

    return await new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("No se pudo convertir a PNG"));
        }, "image/png");
      };

      image.onerror = (e) => {
        console.error("Error al cargar SVG en Image():", e);
        reject(e);
      };

      image.src = url;
    });
  } catch (error) {
    console.error("❌ Error al crear imagen PNG del flujo:", error);
    return null;
  }
};





