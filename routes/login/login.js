const express = require('express')
const router = express.Router()
const axios = require('axios');
//const fetch = require('node-fetch')


router.post("/", (req, res) => {
    let config = {
        method: 'GET',
        maxBodyLength: Infinity,
        url: 'https://json.extendsclass.com/bin/5bbeeaecdc32',
        headers: { 'Content-Type': 'application/json' }
    };
    axios(config)
        .then(result => {
            for (x of result.data) {
                if (x.email === req.body.email && x.password === req.body.password) {
                    res.status(200).send('ok')
                    return
                }
            }
            res.status(400).send('ok')
            return
        })
})

module.exports = router