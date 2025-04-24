// Función para Exportar el diagrama como XML (se muestra solo en consola de momento)
export const exportDiagramXml = async (bpmnModelerRef) => {
    try {
        if (bpmnModelerRef.current) {
            const { xml } = await bpmnModelerRef.current.saveXML({
                format: true,
            });
            console.log("Diagrama exportado como XML:", xml);
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
        const decoded = new DOMParser().parseFromString(contenido, "text/html").body.textContent;
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
        const cleanedXml = cleanXml(xml)
        try {
            await bpmnModelerRef.current.importXML(cleanedXml);
            console.log("Diagrama importado correctamente");
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
        canvas.zoom("fit-viewport");
        canvas.scroll({ dx: viewbox.width / 3, dy: 0 });
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
