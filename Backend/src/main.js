import express from "express"
import cors from "cors"
import fileUpload from "express-fileupload";
import authRoutes  from "./routes/auth.routes.js"
import externalAuthRoutes  from "./routes/externalAuth.routes.js"
import processRoutes  from "./routes/procesos.routes.js"
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
  secret: "202110bf13e1a7508a30b92f08e2766f0259f4e0b2018a38af0b273151ffd8f1", 
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
app.use(cors());


//Carpeta Publica
app.use("/public", express.static(__dirname + "/public"));

//Endpoints
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/externalAuth", externalAuthRoutes)
app.use("/api/v1/procesos", processRoutes)


//Errors Handler
app.use(errorHandler)


