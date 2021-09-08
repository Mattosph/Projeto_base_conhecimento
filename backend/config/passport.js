const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt //ExtracJwt filters only the JWT from the inside of the payload

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // fromAuthHeaderAsBearerToken is the function from ExtractJwt library that extracts the token and stores in jwtFromRequest
    }

    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false))// the first parameter is set as null to start the verification, if the user is ok returns the payload, if not set returns false
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false }) // there will be no session control
    }
}