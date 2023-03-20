const express = require('express')
const router = express.Router()
const axios = require('axios');


router.route('/')
    .post((req, res) => {

        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: 'https://json.extendsclass.com/bin/5bbeeaecdc32',
            headers: { 'Content-Type': 'application/json' }
        };
        axios(config)
            .then(result => result.json())
            .then(result => {
                let userFilter = result.data.filter(element => (element.email === req.body.email && element.password === req.body.password))
                if (userFilter.length !== 0) {
                    res.status(200)
                }
                else {
                    res.status(400)
                }
            })
    })

module.exports = router