import { app } from "./src/main.js";
import { sequelize } from "./src/database/database.js";
import { Server as SocketServer } from "socket.io";
import { configurarSockets } from "./src/sockets/socketHandlers.js";
import { initializeCognitoOIDCClient } from "./src/services/cognito.services.js";
import initModels from "./src/models/init-models.js"

import logger from "./src/utils/logger.js";


const PORT = 3000;

const main = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Conexión a la base de datos establecida correctamente.");
        console.log("Conexión a la base de datos establecida correctamente.");
        initModels(sequelize) 
        await sequelize.sync({ force: false, alter: true });
        logger.info("Modelos sincronizados correctamente.");
        await initializeCognitoOIDCClient();
        console.log("Cognito OIDC Client inicializado correctamente.");
        const server = app.listen(PORT,"0.0.0.0", () => {
            console.log(`🚀Servidor escuchando en el puerto: ${PORT}🚀`);
            logger.info(`Servidor escuchando en el puerto: ${PORT}`);
        });

        // Conexión Socket
        const io = new SocketServer(server, {
            cors: {
                origin: "*",
            },
        });

        configurarSockets(io);

    } catch (error) {
        console.log("Ha ocurrido un error", error);
        logger.error("Ha ocurrido un error", error);
    }
};

main();
