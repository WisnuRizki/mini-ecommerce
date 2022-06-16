
const jwt = require('jsonwebtoken');
const privateKey = 'my-secret'

const verify = (req, res, next) => {
    const token = req.headers["authentication"];
    jwt.verify(token, privateKey, (err, decoded) => {
        if(err) {
            return res.status(403).send({
                message: 'User is not Authorize'
            })
        }

        req.id = decoded.id
        req.role = decoded.role
        next()
    })
}

const generateToken = (payload) => {
    const token = jwt.sign(payload, privateKey, { 
        algorithm: 'HS256',
        expiresIn: "6H"
     });
     return token
}

module.exports = {
    verify,
    generateToken
}