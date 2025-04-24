/* import passport from "passport";
import fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { Strategy as SamlStrategy } from "passport-saml";



const __dirname = path.dirname(fileURLToPath(import.meta.url));


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
    new SamlStrategy(
        {
            path: "/api/v1/externalAuth/login-saml/auth",
            entryPoint: "https://samlmock.dev/idp?aud=Proyecto%20GDP&acs_url=http://localhost:3000/api/v1/externalAuth/login-saml/auth",
            issuer: "Proyecto GDP",
            cert: fs.readFileSync(path.join(__dirname, "../services/mock-idp-cert.pem"), "utf-8")
            
        },
        function (profile, done) {
            return done(null, profile);
            
        }
    )
);

export default passport; */
