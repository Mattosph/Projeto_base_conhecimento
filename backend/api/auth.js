const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if (!user) return res.status(400).send('Usuário não encontrado!') // if user is blank ... returns an error

        const isMatch = bcrypt.compareSync(req.body.password, user.password) // the bcrypt  compares the encrypted pswd with the one coming from the req
        if (!isMatch) return res.status(401).send('Email/Senha inválidos!')

        const now = Math.floor(Date.now() / 1000) // generates the today's date in miliseconds since 1st january 1970 divided by 1000

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now, // comes from issued at ....
            exp: now + (60 * 60 * 24 * 3)//calculates the expiration date for the token , in the example endures 3 days
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret) // the server provide the token to be used for the users get access to execute the actions needed
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret) // to decodify the token its needed the auth secret from .env
                if(new Date(token.exp * 1000) > new Date()) { // verifies the token 
                    return res.send(true)
                }
            }
        } catch(e) {
            // problem with the token, token expired
        }

        res.send(false) // retorna token inválido
    }

    return { signin, validateToken }

}