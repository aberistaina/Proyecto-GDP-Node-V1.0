import ActiveDirectory from "activedirectory2";
import { createToken } from "../services/auth.services.js";



const configAD = {
    url: "ldap://ldap.forumsys.com:389",
    baseDN: "dc=example,dc=com",
    username: "uid=einstein,dc=example,dc=com",
    password: "password",
};

const ad = new ActiveDirectory(configAD);

export const login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        ad.authenticate(username, password, (err, auth) => {
            if (err) {
                console.error("Error autenticando con AD:", err);
                return res.status(401).json({
                    code: 401,
                    message: "Error de autenticación con Active Directory",
                });
            }

            if (!auth) {
                return res
                    .status(401)
                    .json({ code: 401, message: "Credenciales inválidas" });
            } else {
                ad.findUser(username, (err, user) => {
                    if (err) {
                        console.log("Error buscando el usuario:", err);
                    } else if (!user) {
                        console.log("Usuario no encontrado.");
                    } else {
                        console.log("Usuario autenticado:", user);
                    }
                });
            }

            const token = createToken(username, "30m");

            res.status(200).json({
                code: 200,
                message: "Inicio de sesión exitoso",
                token,
            });
        });
    } catch (error) {
        console.log("Error general:", error);
        next(error);
    }
};

export const samlAuth = (req, res, next) => {
    try {
        const { user } = req;
        if (!user) {
            return res
                .status(401)
                .json({ code: 401, message: "Autenticación fallida con SAML" });
        }

        const token = createToken(user, "30m");

        res.status(200).json({
            code: 200,
            message: "Inicio de sesión exitoso vía SAML",
            token,
        });
    } catch (error) {
        next(error);
    }
};

import {
    getCognitoClient,
    getGenerators,
} from "../services/cognito.services.js";
import * as client from "openid-client";

export const loginOIDC = async (req, res) => {
    try {
      const config = getCognitoClient();
      const generators = getGenerators();

      const generatedState = generators.state();
      const generatedNonce = generators.nonce();
      const codeVerifier = generators.codeVerifier();
      const codeChallenge = await generators.codeChallenge(codeVerifier);
  
      // Guardar en sesión
      req.session.state = generatedState;
      req.session.nonce = generatedNonce;
      req.session.code_verifier = codeVerifier;
  
      const authorizationUrl = client.buildAuthorizationUrl(config, {
        redirect_uri: process.env.COGNITO_REDIRECT_URI,
        response_type: "code",
        scope: "openid profile email",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state: generatedState,
        nonce: generatedNonce,
      });
      console.log(authorizationUrl);

  
      return res.redirect(authorizationUrl.href);
    } catch (error) {
      console.error("❌ Error en loginOIDC:", error);
      return res.status(500).json({ message: "Error iniciando sesión con Cognito" });
    }
  };

// Callback que recibe el code y obtiene los tokens
export const authorizeOIDC = async (req, res) => {
    try {
      const config = getCognitoClient();
      const { state: expectedState, nonce: expectedNonce, code_verifier } = req.session;
  
      const params = config.callbackParams(req);
  
      const tokens = await config.authorizationCodeGrant(params, {
        redirect_uri: process.env.COGNITO_REDIRECT_URI,
        expectedState: expectedState,
        pkceCodeVerifier: code_verifier,
      });
  
      const userInfo = await config.fetchUserInfo(tokens.access_token);
  
      req.session.userInfo = userInfo;
  
      console.log("✅ Usuario autenticado:", userInfo);
      res.redirect("/"); // Redirige donde quieras
  
    } catch (error) {
      console.error("❌ Error en autorización Cognito:", error);
      res.status(500).json({ message: "Error autenticando con Cognito" });
    }
  };
