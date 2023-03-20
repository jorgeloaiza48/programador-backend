const express = require('express')
const router = express.Router()
const axios = require('axios');
const fetch = require('node-fetch')
//const controller = require('../controller')

//router.get('/api/usuarios-registrados', controller.usuariosRegistrados)
router.route('/')
    .post((req, res) => {
        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: 'https://json.extendsclass.com/bin/5bbeeaecdc32',
            headers: { 'Content-Type': 'application/json' }
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
                    fechaCreacion: new Date()
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
                        fetch("https://json.extendsclass.com/bin/5bbeeaecdc32", {
                            // mode:'no-cors',
                            method: 'PUT',
                            headers: { "Content-Type": "Application/json", "Security-key": "usuariosRegistrados" },
                            body: JSON.stringify(result.data),
                        })
                            .then(response => console.log("response-->>", response))
                            .catch(error => console.log("Hubo un error crerando user -->> ", error))
                        res.status(200)
                    }
                }
            })
    })


    // router.post('/api/update-user', controller.updateUser )
    // router.post('/api/borrar-toda-programacion', controller.borrarTodaLaProgramacion )
    // router.post('/api/borrar-curso', controller.borrarUnCurso)
    // router.post("/api/login",controller.login)
    // router.post("/api/forgot-password",controller.forgotPassword)
    // router.get('/api/reset-password/:id/:token', controller.resetPassword)
    // router.post('/api/reset-password/:id/:token', controller.CambioPassword)


module.exports = router