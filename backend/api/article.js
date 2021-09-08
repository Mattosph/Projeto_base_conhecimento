const queries = require('./queries')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const article = { ...req.body }
        if(req.params.id) article.id = req.params.id

        try { // Makes a batch of validation within the response to verify the data integrity and availability 
            existsOrError(article.name, 'Nome não informado')
            existsOrError(article.description, 'Descrição não informada')
            existsOrError(article.categoryId, 'Categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Conteúdo não informado')
        } catch(msg) {//returns an error message in case of any of the above consditions do not matches
            res.status(400).send(msg)
        }

        if(article.id) {  // in case of the article pre existance
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .then(_ => res.status(204).send()) // in case of success
                .catch(err => res.status(500).send(err)) // in case of failure
        } else { // in case of a new article inclusion
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('articles')
                .where({ id: req.params.id }).del()
            
            try {
                existsOrError(rowsDeleted, 'Artigo não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)    
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const limit = 10 // number max of results per page
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('articles').count('id').first()// defines the number of groups of pages that will be shown
        const count = parseInt(result.count)

        app.db('articles')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)// calculate the max number of pages of results
            .then(articles => res.json({ data: articles, count, limit }))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            .first()
            .then(article => {
                article.content = article.content.toString()// the article returns as a binary , so its necessary to transform in String
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async (req, res) => {
        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'articles', u: 'users'}) // a and u are alias used to manipulate the data from the tables articles and users to return a merging card in frontend
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId'])//where Raw compares the ids to find the real autor of the article
            .whereIn('categoryId', ids)// makes a query where in with the category ids
            .orderBy('a.id', 'desc')// organizes in descrescent order
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}