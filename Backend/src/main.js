import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import authRoutes  from "./routes/auth.routes.js"
import externalAuthRoutes  from "./routes/externalAuth.routes.js"
import processRoutes  from "./routes/procesos.routes.js"
import aprobadoresRoutes  from "./routes/aprobadores.routes.js"
import adminRoutes  from "./routes/admin.routes.js"
import comentariosRoutes  from "./routes/comentarios.routes.js"
import bitacoraRoutes  from "./routes/bitacora.routes.js"
import oportunidadesRoutes  from "./routes/oportunidades.routes.js"
import cargosRoutes  from "./routes/cargos.routes.js"
import nivelesRoutes  from "./routes/niveles.routes.js"
import cargosAdjuntos  from "./routes/adjuntos.routes.js"

import {errorHandler} from "./middlewares/errors.middlewares.js"

//Importaciones Para autenticación con SAML
import session from "express-session";
/* import passport from "./services/SAMLConfiguration.js"; */



import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const app = express()



//Middlewares SAML
app.use(session({
    secret: process.env.SECRET_MIDDLEWARE_SAML, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

/* app.use(passport.initialize());
app.use(passport.session()); */


//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
app.use(cookieParser());


const origins = [
  "http://localhost:5173",
  "http://192.168.50.66:5173",
  "https://test.backspace.cl/",
];
app.use(cors({
    origin: origins,
    credentials: true
}));


//Carpeta Publica
app.use("/public", express.static(__dirname + "/public"));

//Endpoints
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/externalAuth", externalAuthRoutes)
app.use("/api/v1/procesos", processRoutes)
app.use("/api/v1/aprobadores", aprobadoresRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/comentarios", comentariosRoutes)
app.use("/api/v1/oportunidades", oportunidadesRoutes)
app.use("/api/v1/bitacora", bitacoraRoutes)
app.use("/api/v1/niveles", nivelesRoutes)
app.use("/api/v1/cargos", cargosRoutes)
app.use("/api/v1/adjuntos", cargosAdjuntos)


//Errors Handler
app.use(errorHandler)


