export const procesosBloqueados = new Map();

export function configurarSockets(io) {
    io.on("connection", (socket) => {
        console.log("🟢 Cliente conectado:", socket.id);

        // Solicitud normal de bloqueo
        socket.on("solicitar-bloqueo", (idProceso) => {
            if (!procesosBloqueados.has(idProceso)) {
                procesosBloqueados.set(idProceso, socket.id);
                socket.emit("bloqueo-concedido", idProceso);
                socket.broadcast.emit("proceso-bloqueado", idProceso);
            } else {
                socket.emit("bloqueo-denegado", idProceso);
            }
        });

        // Solicitud de tomar el control (robo de mando)
        socket.on("solicitar-control", (idProceso) => {
            const socketIdActual = procesosBloqueados.get(idProceso);

            if (socketIdActual && socketIdActual !== socket.id) {
                // Notificar al que tenía el control que lo perdió
                io.to(socketIdActual).emit("control-revocado", idProceso);

                // Asignar el nuevo dueño del proceso
                procesosBloqueados.set(idProceso, socket.id);

                // Confirmar al nuevo usuario
                socket.emit("bloqueo-concedido", idProceso);
            } else {
                // Si no estaba bloqueado o ya era suyo
                socket.emit("bloqueo-concedido", idProceso);
            }
        });

        // Liberar bloqueo manual
        socket.on("liberar-bloqueo", (idProceso) => {
            if (procesosBloqueados.get(idProceso) === socket.id) {
                procesosBloqueados.delete(idProceso);
                socket.broadcast.emit("bloqueo-liberado", idProceso);
            }
        });

        // Liberar bloqueo al desconectarse
        socket.on("disconnect", () => {
            for (const [id, ownerSocket] of procesosBloqueados.entries()) {
                if (ownerSocket === socket.id) {
                    procesosBloqueados.delete(id);
                    socket.broadcast.emit("bloqueo-liberado", id);
                }
            }
        });
    });
}
