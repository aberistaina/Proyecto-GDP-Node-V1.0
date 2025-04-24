export const crearTemplateHtml = (email, asunto, token, username) => {
    let template;

    if (asunto === "registro") {
        template = `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f7f7f7;
                                margin: 0;
                                padding: 0;
                            }
                            .email-container {
                                width: 100%;
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            .header h1 {
                                color: #4A90E2;
                            }
                            .content {
                                font-size: 16px;
                                color: #333333;
                                line-height: 1.5;
                                margin-bottom: 20px;
                            }
                            .boton {
                                display: flex;
                                justify-content: center;
                                align-items: center;  /* Esto asegura la alineación vertical */
                                width: 100%;  /* Asegura que el contenedor ocupe el 100% del espacio disponible */
                            }
                            .button {
                                display: inline-block;
                                background-color: #4A90E2;
                                color: #ffffff;
                                font-size: 16px;
                                font-weight: bold;
                                padding: 12px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                margin: 20px 0;
                            }
                            .footer {
                                text-align: center;
                                font-size: 12px;
                                color: #888888;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <h1>Bienvenido a Proyecto GDP</h1>
                            </div>
                            <div class="content">
                                <p>¡Hola! <strong>${username}</strong></p>
                                <p>Gracias por registrarte en <strong>Proyecto GDP</strong>.

                                <p>Si no te registraste en Proyecto GDP, por favor ignora este correo.</p>
                            </div>
                            <div class="footer">
                                <p>&copy; 2025 Proyecto GDP | Todos los derechos reservados</p>
                                <p>Si tienes alguna pregunta, puedes contactarnos a <a href="mailto:support@backspace.cl
                                ">support@backspace.cl
                                </a>.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `;
    } else{
        template = `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f7f7f7;
                                margin: 0;
                                padding: 0;
                            }
                            .email-container {
                                width: 100%;
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            .header h1 {
                                color: #4A90E2;
                            }
                            .content {
                                font-size: 16px;
                                color: #333333;
                                line-height: 1.5;
                                margin-bottom: 20px;
                            }
                            .boton {
                                display: flex;
                                justify-content: center;
                                align-items: center;  /* Esto asegura la alineación vertical */
                                width: 100%;  /* Asegura que el contenedor ocupe el 100% del espacio disponible */
                            }
                            .button {
                                display: inline-block;
                                background-color: #4A90E2;
                                color: #ffffff;
                                font-size: 16px;
                                font-weight: bold;
                                padding: 12px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                margin: 20px 0;
                            }
                            .footer {
                                text-align: center;
                                font-size: 12px;
                                color: #888888;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <h1>Recupera tu contraseña Proyecto GDP</h1>
                            </div>
                            <div class="content">
                                <p>¡Hola! <strong>${username}</strong></p>
                                <p>Para recuperar tu contraseña por favor haz clic en el siguiente botón:</p>
                                <div class="boton">
                                    <a href="http://localhost:5173/recover-password/?email=${email}&token=${token}" class="button">Recuperar Contraseña</a>
                                </div>
                                <p>Si no pediste un cambio de contraseña en Proyecto GDP, por favor ignora este correo.</p>
                            </div>
                            <div class="footer">
                                <p>&copy; 2025 Proyecto GDP | Todos los derechos reservados</p>
                                <p>Si tienes alguna pregunta, puedes contactarnos a <a href="mailto:support@backspace.cl
                                ">support@backspace.cl
                                </a>.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `;
    } 

    return template;
};
