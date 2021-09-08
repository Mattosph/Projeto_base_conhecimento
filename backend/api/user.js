const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    const encryptedPassword = password => {
        const salt = bcrypt.genSaltSync(10) //generates the hash to encrypt the password using 10 steps of encryptation 
        return bcrypt.hashSync(password, salt) // generates the hash in a syncronous way
    }

    const save = async (req, res) => {

        const user= { ... req.body}
        if(req.params.id) user.id = req.params.id // if id does already exists, app still using the same


        // AN ADMIN MUST ONLY BE REGISTERED BY ANOTHER ADMIN
        if(!req.originalUrl.startsWith('/users')) user.admin = false // if the acces does not starts with the url /users than admin = false,
        // otherwise a non admin can register an admin by the put method
        if(!req.user || !req.user.admin) user.admin = false // if there is no one logged in and there is no user registered the default user profile is setted to false

        try{
            existsOrError(user.name,'Nome não informado')
            existsOrError(user.email,'E-mail não informado')
            existsOrError(user.password,'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users') //access the db via knex to verify if there is an already registered email or not
                .where({ email: user.email }).first()
                if(!user.id){
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
                }

        } catch(msg) {
            return res.status(400).send(msg) //client error , infraction of the rules above detected

        }
        
        user.password = encryptedPassword(user.password)
        delete user.confirmPassword

        if(user.id){
            app.db('users')
                .update(user)
                .where({id: user.id})
                .whereNull('deletedAt')
                .then(_=> res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_=> res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

        //res.send('user save')//send the info that the method save from user.js was used.
    }

    const get = (req, res)=> {
        app.db('users')
        .select('id', 'name', 'email', 'admin')
        .whereNull('deletedAt')//filters the users to not show the deleted ones
        .then(users => res.json(users))
        .catch(err=> res.status(500).send(err))
    }

 
    const getById = (req, res)=> {
        app.db('users')
        .select('id', 'name', 'email', 'admin')
        .where({ id: req.params.id})
        .whereNull('deletedAt')
        .first()
        .then(user=> res.json(user))
        .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res)=> {
        try {
            const articles = await app.db('articles')
            .where({ userId: req.params.id})
            notExistsOrError(articles, 'Usuário possui artigos.')

            const rowsUpdated = await app.db('users')
            .update({deleteAt: new Date()})
            .where({ id: req.params.id})
          existsOrError(rowsUpdated, 'Usuário não foi encoontrado')
          
          res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }


    return { save,get, getById,remove}

    
}

