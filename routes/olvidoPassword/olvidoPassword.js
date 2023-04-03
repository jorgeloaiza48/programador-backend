require('dotenv').config()
const express = require('express')
const router = express.Router({ mergeParams: true })
const axios = require('axios');
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const JWT_SECRTET = "some super secret..."
const path = require('path')
//const envJSON = require('../../variablesEntorno.json')
let URL = ""
//console.log(envJSON.development.SERVER_URL)

router.post("/", (req, res) => {

    const NODE_ENV = process.env.NODE_ENV || 'development' //si la variable NODE_ENV no está definida entonce la crea con valor "development"   
    if (NODE_ENV !== 'production') {  //Está línea pregunta si no se está en un entorno de producción
        require('dotenv').config()   //carga las variables del archivo .env
        URL = process.env.URL
    }
    else {
        URL = `https://programador-cursos.onrender.com`
    }


    let config = {
        method: 'GET',
        maxBodyLength: Infinity,
        url: 'https://json.extendsclass.com/bin/5bbeeaecdc32',
        headers: { 'Content-Type': 'application/json' }
    };
    axios(config)
        .then(result => {
            //Make sure email exists in dataBase
            let userFilter = result.data.filter(element => element.email === req.body.email)
            if (userFilter.length !== 0) {
                const payload = {
                    email: userFilter[0].email,
                    id: userFilter[0].id
                }
                token = jwt.sign(payload, JWT_SECRTET, { expiresIn: '5m' })
                //const link = `http://localhost:3000/#/reset-password/${userFilter[0].id}/${token}`                
                //const link = `https://programador-cursos.onrender.com/#/reset-password/${userFilter[0].id}/${token}`
                const link = `${URL}/#/reset-password/${userFilter[0].id}/${token}`

                // create reusable transporter object using the default SMTP transport               
                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    host: 'smtp.gmail.com',
                    port: 2525,  //25 o 587 o 465 o 2525
                    secure: true,
                    auth: {
                        user: "jelm48@misena.edu.co",     //variable de entorno. Ver archivo ".env"
                        pass: process.env.PASSWORD  //variable de entorno. Ver archivo ".env"
                    }
                })
                //Features of email to be sent
                const info = {
                    from: 'jelm48@misena.edu.co',
                    to: userFilter[0].email,
                    subject: "Recuperación de contraseña programador cursos",
                    text: "Correo de prueba para recuperar contraseña",
                    html: '<p>Recientemente solicitaste un reestablecimiento de contraseña para el programador de cursos.</p>' +
                        `<p>Click <a href=${link}>aquí</a> para reestablecer contraseña.</p>` +
                        '<p>Este enlace expirará en 5 minutos.</p>'
                }
                //sending email
                transporter.sendMail(info, function (error, info) {
                    if (error) {
                        return console.log(error)
                    }
                    //console.log("Message sent: " + info.response)
                    res.status(200).send('Correo enviado para reestablecer contraseña')
                })
            }
            else {
                res.status(400).send('Usuario NO encontrado')
            }
        })
})

module.exports = router