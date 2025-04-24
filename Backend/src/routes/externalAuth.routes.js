import { Router } from "express";
import { login } from "../controllers/externalAuth.controller.js";
import passport from "../services/SAMLConfiguration.js"
import { samlAuth, loginOIDC, authorizeOIDC } from "../controllers/externalAuth.controller.js";


const router = Router()

//Autenticación Active Directory
router.post("/login", login)

//Autenticación SAML
router.get("/login-saml", passport.authenticate("saml"));
router.post("/login-saml/auth", passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }), samlAuth);

//autenticación con Cognito
router.get("/login-oidc", loginOIDC);
router.get("/authorize", authorizeOIDC); 

export default router