const express = require('express')
const router = express.Router()
const axios = require('axios');
const fetch = require('node-fetch')

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
                console.log("Resultado -->> ", result.data[0].email)
                result.data.find(element => {
                    console.log("Element -->>", element.email)
                    console.log("req.body.email-->> ", req.body.email)
                    if (element.email === req.body.email) {
                        console.log("Encontrado")
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
                fetch("https://json.extendsclass.com/bin/5bbeeaecdc32", {
                    // mode:'no-cors',
                    method: 'PUT',
                    headers: { "Content-Type": "Application/json", "Security-key": "usuariosRegistrados" },
                    body: JSON.stringify(result.data),
                })
                    .then(response => console.log("response-->>", response))                    
                    .catch(error => {
                        console.log("Hubo un error borrando el curso deseado -->> ", error)
                    })
            })
    })
module.exports = router