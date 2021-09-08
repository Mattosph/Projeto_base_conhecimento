const app = require ('express')()
const consign = require('consign');
const db = require('./config/db')

const mongoose = require('mongoose')//create the environment to connect to MongoDB
require('./config/mongodb')

app.db = db; //db neste caso 'e o Knex parametrizado para fazer as operações na DB ( para fazer select, delete, add,)
app.mongoose = mongoose

consign()// Consign can pass the listed files as parameters to the app main function, that is a instance of Express, app acts centralizing all middlewares to serve it to Express

.include('./config/passport.js')
.then('./config/middlewares.js')

.then('./api/validation.js')
.then('./api')
.then('/schedule')
.then('./config/routes.js')
.into(app) 

app.listen(3000, () => {
    console.log('Backend executando...')
})