const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/knowledge_stats', { useNewUrlParser: true }) // useNewUrlParser is a lib to make moongoose manage URLs easily.
    .catch(e => {
        const msg = 'ERRO! Não foi possível conectar com o MongoDB!'
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m') // formats the collor of the message to red
    })