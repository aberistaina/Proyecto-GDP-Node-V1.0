import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import authRoutes  from "./routes/auth.routes.js"
import externalAuthRoutes  from "./routes/externalAuth.routes.js"
import processRoutes  from "./routes/procesos.routes.js"
import aprobadoresRoutes  from "./routes/aprobadores.routes.js"
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


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));


//Carpeta Publica
app.use("/public", express.static(__dirname + "/public"));

//Endpoints
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/externalAuth", externalAuthRoutes)
app.use("/api/v1/procesos", processRoutes)
app.use("/api/v1/aprobadores", aprobadoresRoutes)


//Errors Handler
app.use(errorHandler)


