const jwt = require('jsonwebtoken')
const JWT_SECRTET = "some super secret..."

const tokenVerify = {
    tokenverify: (req, res) => {

        const { id, token } = req.params
        // console.log("id-->> ", id)
        // console.log("token-->> ", token)
        // console.log("req.params -->>", req.params)
        jwt.verify(token, JWT_SECRTET, (err) => {
            if (err) {
                res.status(400).send('No OK')
                return
            }
            else {
                res.status(200).send('OK')
                return
            }
        })
    }
}

module.exports = tokenVerify




