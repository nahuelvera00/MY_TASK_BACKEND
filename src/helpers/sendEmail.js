const nodemailer = require("nodemailer");

/**
 * 
 * @param {*} data 
registered user email, user name, confirmation token
 */
export async function sendEmailRegister(data) {
  const { email, name, token } = data;

  //CONFIG GMAIL/NODEMAILER
  const config = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };
  const message = {
    from: "myTask <nahuelvera3770@gmail.com>",
    to: email,
    subject: "myTask - Confirmacion de Cuenta",
    text: "Confirma tu Cuenta de myTask",
    html: `<p>Hola: ${name}, Comprueba tu cuenta de myTask</p>
        <p>Tu cuenta ya esta casi lista, solo debemos Verificarla en el proximo Enlace:
        <a href="${process.env.FRONTEND_URL}/auth/confirmar/${token}">Verificar Aqui</a>
        `,
  };

  const transport = nodemailer.createTransport(config);

  const info = await transport.sendMail(message);
}

//----------------------------------------------------------------------------------------------------------------------------------------------

export async function sendEmailRecoverPassword(data) {
  const { email, name, token } = data;

  //CONFIG GMAIL/NODEMAILER
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };
  const message = {
    from: "myTask <nahuelvera3770@gmail.com>",
    to: email,
    subject: "myTask - Recupera tu contraseña",
    text: "Recupera tu contraseña de myTask",
    html: `<p>Hola: ${name}, recupera tu contraseña de myTask</p>
        <p>Solo debes ingresar en el proximo Enlace:
        <a href="${process.env.FRONTEND_URL}/auth/confirmar/${token}">Recuperar Aqui</a>
        `,
  };

  const transport = nodemailer.createTransport(config);

  const info = await transport.sendMail(message);
}
