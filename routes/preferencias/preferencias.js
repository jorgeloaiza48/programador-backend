const express = require('express')
const router = express.Router()
const axios = require('axios');
const fetch = require('node-fetch')

router.put("/", (req, res) => {
    let config = {
        method: 'GET',
        maxBodyLength: Infinity,
        url: 'https://json.extendsclass.com/bin/5bbeeaecdc32',
        headers: { 'Content-Type': 'application/json' }
    };
    axios(config)
        .then(result => {           
            User = result.data
            User.find(element => {
                if (element.email === req.body.email) {
                    element.coordenadasCurso.push(req.body.coordenadasCurso)
                    element.colorDeRelleno.push(req.body.colorRelleno)
                    element.coordColorHoras.push(req.body.coordColorHoras)
                    element.totalHorasPorMes = [] //se borra el array para que no se acumulen los datos de forma innecesaria
                    element.totalHorasPorMes.push(req.body.totalHorasPorMes)
                }
            });            
            fetch("https://json.extendsclass.com/bin/5bbeeaecdc32", {
                method: 'PUT',
                headers: { "Content-Type": "Application/json", "Security-key": "usuariosRegistrados" },
                body: JSON.stringify(User),
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

module.exports = router

