import nodemailer from "nodemailer";
import { crearTemplateHtml } from "../utils/templatesEmail.js";

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


export const sendEmail = (email, asunto, username, token=null ) =>{
    
    const mailOptions = createMailOptions(email, asunto, token, username)
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error al enviar el correo:", error);
        } else {
            console.log("Correo enviado:", info.response);
        }
});
}

