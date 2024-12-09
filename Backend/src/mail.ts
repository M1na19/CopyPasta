import nodemailer from "nodemailer";
import dotenv from "dotenv";

const link_website = "http://localhost:5173";
const link_recovery = "http://localhost:5173/recover/";
const link_confirm = "http://localhost:8000/activate_account/";

export async function sendPasswordMail(
  transporter: nodemailer.Transporter,
  mail: string,
  token: string,
) {
  var mailOptions = {
    from: "youremail@gmail.com",
    to: mail,
    subject: "Schimbare parola copypasta",
    html: `<!DOCTYPE html>
                <html lang="ro">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Recuperare parolă - Copypasta</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f9f9f9;
                            font-family: Arial, sans-serif;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: #ffffff;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #FFA500;
                            color: #ffffff;
                            padding: 20px;
                            text-align: center;
                            font-size: 24px;
                            font-weight: bold;
                        }
                        .content {
                            padding: 20px;
                            line-height: 1.6;
                        }
                        .button {
                            display: inline-block;
                            margin: 20px auto;
                            padding: 15px 30px;
                            font-size: 16px;
                            color: #ffffff;
                            background-color: #FFA500;
                            text-decoration: none;
                            border-radius: 5px;
                            text-align: center;
                            font-weight: bold;
                        }
                        .button:hover {
                            background-color: #e59400;
                        }
                        .footer {
                            background-color: #f1f1f1;
                            text-align: center;
                            padding: 10px;
                            font-size: 12px;
                            color: #888;
                        }
                        .footer a {
                            color: #FFA500;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            Recuperare Parolă - Copypasta
                        </div>
                        <div class="content">
                            <p>Bună,</p>
                            <p>Ai solicitat resetarea parolei contului tău de pe <strong>Copypasta</strong>. Pentru a-ți reseta parola, te rugăm să folosesti linkul:</p>
                            <p>${link_recovery + token}</p>
                            <p>Dacă nu ai solicitat această resetare, poți ignora acest email.</p>
                            <p>Cu drag,<br>Echipa Copypasta</p>
                        </div>
                        <div class="footer">
                            <p>© 2024 Copypasta. Toate drepturile rezervate.</p>
                            <p><a href="{${link_website}}">Vizitează site-ul nostru</a></p>
                        </div>
                    </div>
                </body>
                </html>
                `,
  };

  return transporter.sendMail(mailOptions);
}
export async function sendSignUpMail(
  transporter: nodemailer.Transporter,
  mail: string,
  token: string,
) {
  var mailOptions = {
    from: "youremail@gmail.com",
    to: mail,
    subject: "Creare cont copypasta",
    html: `<!DOCTYPE html>
                <html lang="ro">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmare Înregistrare - Copypasta</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f9f9f9;
                            font-family: Arial, sans-serif;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: #ffffff;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #FFA500;
                            color: #ffffff;
                            padding: 20px;
                            text-align: center;
                            font-size: 24px;
                            font-weight: bold;
                        }
                        .content {
                            padding: 20px;
                            line-height: 1.6;
                        }
                        .button {
                            display: inline-block;
                            margin: 20px auto;
                            padding: 15px 30px;
                            font-size: 16px;
                            color: #ffffff;
                            background-color: #FFA500;
                            text-decoration: none;
                            border-radius: 5px;
                            text-align: center;
                            font-weight: bold;
                        }
                        .button:hover {
                            background-color: #e59400;
                        }
                        .footer {
                            background-color: #f1f1f1;
                            text-align: center;
                            padding: 10px;
                            font-size: 12px;
                            color: #888;
                        }
                        .footer a {
                            color: #FFA500;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            Bine ai venit pe Copypasta!
                        </div>
                        <div class="content">
                            <p>Bună,</p>
                            <p>Îți mulțumim că te-ai alăturat comunității <strong>Copypasta</strong>, locul perfect pentru rețete delicioase și inspirație culinară!</p>
                            <p>Ca să finalizezi înregistrarea, te rugăm să confirmi adresa de email cu linkul de mai jos:</p>
                            <p>${link_confirm + token}</p>
                            <p>Dacă nu ai făcut această înregistrare, te rugăm să ignori acest email.</p>
                            <p>Cu drag,<br>Echipa Copypasta</p>
                        </div>
                        <div class="footer">
                            <p>© 2024 Copypasta. Toate drepturile rezervate.</p>
                            <p><a href="${link_website}">Vizitează site-ul nostru</a></p>
                        </div>
                    </div>
                </body>
                </html>
                `,
  };

  return transporter.sendMail(mailOptions);
}
