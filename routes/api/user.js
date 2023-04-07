const express = require('express')
const router = express.Router()
const axios = require('axios');
const fetch = require('node-fetch')
//const controller = require('../controller')

router.put("/", (req, res) => {
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
                for (x of result.data) {
                    if (x.email === req.body.email) {                       
                        res.status(400).send('Usuario ya existe')
                        return
                    }
                }
                result.data.push(nuevoUsuario)
            }

            fetch("https://json.extendsclass.com/bin/5bbeeaecdc32", {
                method: 'PUT',
                headers: { "Content-Type": "Application/json", "Security-key": "usuariosRegistrados" },
                body: JSON.stringify(result.data),
            })
                .then(response => {                    
                    if (response.status === 200) {
                        res.status(200).send('ok')
                        return
                    }
                    else {
                        res.status(400).send('No ok')
                        return
                    }
                })
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