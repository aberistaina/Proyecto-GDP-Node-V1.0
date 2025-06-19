import { promisify } from "util";
import nodemailer from "nodemailer";
import { crearTemplateHtml } from "../utils/templatesEmail.js";
import { MailError} from "../errors/TypeError.js";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
    },
});

export const createMailOptions = (email, asunto, token, username) =>{

    let asuntoCorreo = null

    if(asunto === "registro"){
        asuntoCorreo = "Bienvenido a Proyecto GDP "
    }else{
        asuntoCorreo = "Recuperación Contraseña"
    }


    const mailOptions = {
            from: "Backspace Support",
            to: `${email}`,
            subject: asuntoCorreo,
            html: crearTemplateHtml(email, asunto, token, username )
        };

    return mailOptions
}

const sendMailPromise = promisify(transporter.sendMail).bind(transporter);

export const sendEmail = async (email, asunto, username, token = null) => {
    try {
        const mailOptions = createMailOptions(email, asunto, token, username);
        const info = await sendMailPromise(mailOptions);
        console.log("Correo enviado:", info.response);
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> sendEmail] ${error.message}`);
        throw new MailError(null, error.message);
    }
};

