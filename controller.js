const { email } = require('./credentials')
const { password } = require('./credentials')
const fs = require('fs')
const path = require("path");
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const JWT_SECRTET = "some super secret..."
const axios = require('axios');
const { response } = require('express');
const fetch = require('node-fetch')


let idGlobal = 0 //I had to set this global variable because when I am setting "app.get('/reset-password/:id/:token', controller.resetPassword)", I can´t render the view for changing password. And I also had problems with req.params. I couldn´t get them. why? I do not know.
let token = ""

const controller = {

    createUser: (req, res) => {

        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: 'https://json.extendsclass.com/bin/5bbeeaecdc32',
            headers: {'Content-Type': 'application/json'}
        };
        axios(config)
            .then(result => {
                let id = result.data.length + 1
                let nuevoUsuario = {
                    id: id,
                    email: req.body.email,
                    password: req.body.password,
                    coordenadasCurso: [],
                    colorDeRelleno: [],
                    coordColorHoras: [],
                    totalHorasPorMes: [],
                    fechaCreacion : new Date()
                }
                if (result.data.length === 0) {
                    result.data.push(nuevoUsuario)
                }
                else {
                    let userFilter = result.data.filter(element => element.email === req.body.email)
                    if (userFilter.length !== 0) {
                        res.status(400)
                    }
                    else {
                        result.data.push(nuevoUsuario)
                        // const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                        // const request = new XMLHttpRequest();
                        // request.open("PUT", "https://json.extendsclass.com/bin/5bbeeaecdc32", true);
                        // request.setRequestHeader("Security-key", "usuariosRegistrados");
                        // request.onreadystatechange = () => { };
                        // request.send(JSON.stringify(result.data));      

                        fetch("https://json.extendsclass.com/bin/5bbeeaecdc32", {
                            // mode:'no-cors',
                            method: 'PUT',                           
                            headers: {"Content-Type": "Application/json", "Security-key": "usuariosRegistrados"},
                            body: JSON.stringify(result.data),
                        })
                            .then(response => console.log("response-->>",response))
                            .catch(error => console.log("Hubo un error crerando user -->> ", error))
                        res.status(200)
                    }
                }
            })



        //Para localhost
        // let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
        // let users = fs.readFileSync(usersFilePath, 'utf-8')
        // let NewUser = []
        // NewUser = JSON.parse(users) //JSON a JS
        // let id = NewUser.length + 1

        // let nuevoUsuario = {
        //     id: id,
        //     email: req.body.email,
        //     password: req.body.password,
        //     coordenadasCurso: [],
        //     colorDeRelleno: [],
        //     coordColorHoras: [],
        //     totalHorasPorMes: []
        // }
        // if (users.length === 0) {
        //     NewUser.push(nuevoUsuario)
        // }
        // else {
        //     let userFilter = NewUser.filter(element => element.email === req.body.email)
        //     if (userFilter.length !== 0) {
        //         res.status(400).send('No creado')
        //         // res.send("Usuario NO creado")
        //     }
        //     else {
        //         NewUser.push(nuevoUsuario)
        //         fs.writeFileSync(usersFilePath, JSON.stringify(NewUser, null, "\t")) //de JS a JSON           
        //         res.status(200).send("Usuario creado")
        //res.send("Usuario creado")

        //}
        //}
    },

    updateUser: (req, res) => {
        let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
        User = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')) //JSON a JS      
        User.find(element => {
            if (element.email === req.body.email) {
                element.coordenadasCurso.push(req.body.coordenadasCurso)
                element.colorDeRelleno.push(req.body.colorRelleno)
                element.coordColorHoras.push(req.body.coordColorHoras)
                element.totalHorasPorMes = [] //se borra el array para que no se acumulen los datos de forma innecesaria
                element.totalHorasPorMes.push(req.body.totalHorasPorMes)
            }
        });
        fs.writeFileSync(usersFilePath, JSON.stringify(User, null, "\t")) //de JS a JSON
        res.send("Usuario actualizado con éxito")
    },

    borrarTodaLaProgramacion: (req, res) => {
        let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
        User = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')) //JSON a JS      
        User.find(element => {
            if (element.email === req.body.email) {
                element.coordenadasCurso = []
                element.colorDeRelleno = []
                element.coordColorHoras = []
                element.totalHorasPorMes = []
            }
        });
        fs.writeFileSync(usersFilePath, JSON.stringify(User, null, "\t")) //de JS a JSON
        res.send("Programación borrada con éxito")
    },

    borrarUnCurso: (req, res) => {
        let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
        User = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')) //JSON a JS   
        User.find(element => {
            if (element.email === req.body.email) {
                for (let i = 0; i < element.coordColorHoras.length; i++) {
                    let resultado = false
                    resultado = element.coordColorHoras[i].includes(req.body.color.replace(/ /g, "")) //replace(/ /g, "") quita los epacios en blanco intermedios. Por ejemplo rgb(12, 56, 125) y queda rgb(12,56,125). El color llegaba desde el front con espacios en blancos intermedios y por eso no había una coincidencia en la búsquedad. https://es.stackoverflow.com/questions/165669/como-eliminar-los-espacios-en-blanco-en-un-string                
                    if (resultado) {
                        let p = 0
                        //Este ciclo actualiza el arreglo donde están las horas totales de cada mes
                        for (let j = 2; j < element.coordColorHoras[i].length; j = j + 3) {
                            element.totalHorasPorMes[0][p] = element.totalHorasPorMes[0][p] - element.coordColorHoras[i][j]
                            p++
                        }
                        element.coordColorHoras.splice(i, 1) //borra las coordenadas del curso que se quiere eliminar
                        element.colorDeRelleno.splice(i, 1) //borra el color del curso que se quiere borrar
                        element.coordenadasCurso.splice(i, 1) // borra la coordenada, el color y la hora parcial del curso que se desea borrar.
                    }
                }
            }
        })
        fs.writeFileSync(usersFilePath, JSON.stringify(User, null, "\t")) //de JS a JSON         
        res.send("El curso seleccionado se borró con éxito")
    },

    login: (req, res) => {

        // fetch("https://api.myjson.online/v1/records/8eee4469-38fd-495a-a73e-34c01fb914a8", {
        //     method: 'GET',
        //     headers: {
        //         "mode": 'no-cors',
        //         "Content-Type": "Application/json"
        //     }
        // })
        //     .then(response => response.json())
        //     .then(result => {
        //         let userFilter = result.filter(element => (element.email === req.body.email && element.password === req.body.password))
        //         if (userFilter.length !== 0) {
        //             res.status(200).send('Usuario encontrado')
        //         }
        //         else {
        //             res.status(400).send('Usuario NO encontrado')
        //         }
        //     })

        let usersFilePath = path.join(__dirname, './usuariosRegistrados.json'); //Para localhost
        let users = fs.readFileSync(usersFilePath, 'utf-8') //para localhost
        let user = []
        user = JSON.parse(users) //JSON a JS   
        let userFilter = user.filter(element => (element.email === req.body.email && element.password === req.body.password))
        if (userFilter.length !== 0) {
            res.status(200).send('Usuario encontrado')
        }
        else {
            res.status(400).send('Usuario NO encontrado')
        }


    },

    forgotPassword: (req, res) => {
        let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
        let users = fs.readFileSync(usersFilePath, 'utf-8')
        let user = []
        user = JSON.parse(users) //JSON a JS   

        //Make sure email exists in dataBase
        let userFilter = user.filter(element => element.email === req.body.email)
        if (userFilter.length !== 0) {
            idGlobal = userFilter[0].id
            const payload = {
                //email: userFilter[0].email,
                id: userFilter[0].id
            }
            token = jwt.sign(payload, JWT_SECRTET, { expiresIn: '5m' })
            //const link = `http://localhost:3000/reset-password/${userFilter[0].id}/${token}`
            const link = `https://programadorcursos.onrender.com/#/reset-password/${userFilter[0].id}/${token}`

            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                host: 'smtp.gmail.com',
                port: 2525,  //25 o 587 o 465 o 2525
                secure: true,
                auth: {
                    user: email,
                    pass: password
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

    },

    resetPassword: (req, res, next) => {
        // const { id, token } = req.params                      
        jwt.verify(token, JWT_SECRTET, (err) => {
            if (err) {
                return res.status(400).send('Enlace ya no es válido')
            }
            else {
                return res.status(200).send('Enlace aún es válido')
            }
        })
    },

    CambioPassword: (req, res) => {
        //const { id, token } = req.params //         
        let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
        User = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')) //JSON a JS                  
        User.find(element => {
            if (element.id === idGlobal) {
                element.password = ""
                element.password = req.body.password
                fs.writeFileSync(usersFilePath, JSON.stringify(User, null, "\t")) //de JS a JSON
                res.status(200).send('Password has been changed successfully')
            }
        })



    },
    usuariosRegistrados: (req, res) => {
        let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
        let users = fs.readFileSync(usersFilePath, 'utf-8')
        NewUser = JSON.parse(users) //JSON a JS
        res.json(NewUser) //formato json
    }
}
module.exports = controller
