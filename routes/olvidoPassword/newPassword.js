const axios = require('axios');
const fetch = require('node-fetch')

const newPassword = {
    newPassword: (req, res) => {
        const { id, token } = req.params       
        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: 'https://json.extendsclass.com/bin/5bbeeaecdc32',
            headers: { 'Content-Type': 'application/json' }
        };
        axios(config)
            .then(result => {               
                result.data.find(element => {                   
                    if (element.id === parseInt(id)) { //como id viene tipo string entonces hay que convertirlo a entero.
                        element.password = ""
                        element.password = req.body.password                       
                    }                    
                })                 
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
    }
}

module.exports = newPassword


