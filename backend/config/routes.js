const admin = require('./admin')

module.exports = app => {


    ///////////---------the are the unique public URls that are directly public and dis not require the token verification------/////////////////
   app.post('/signup', app.api.user.save)
   app.post('/signin',app.api.auth.signin)
  app.post('/validateToken',app.api.auth.validateToken)
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    app.route('/users')
    .all(app.config.passport.authenticate())
    .post((app.api.user.save))// this is the path of the Expressfunction.folder.file. db function
    .get((app.api.user.get))
    
    app.route('/users/:id')
    .all(app.config.passport.authenticate())
    .put((app.api.user.save))
    .get((app.api.user.getById))// the method to filter to catch users by Id from the db

   app.route('/categories')
    .all(app.config.passport.authenticate())
    .get((app.api.category.get))
    .post((app.api.category.save))
    
// Cuidado com a ordem! tem que vir antes de categories/:id
    
    
    app.route('/categories/tree')
    .all(app.config.passport.authenticate())
    .get(app.api.category.getTree)

    app.route('/categories/:id')
       .all(app.config.passport.authenticate())
        .get(app.api.category.getById)
        .put((app.api.category.save))
        .delete((app.api.category.remove))
    
    app.route('/articles')
       .all(app.config.passport.authenticate())
        .get((app.api.article.get))
        .post((app.api.article.save))

    app.route('/articles/:id')
       .all(app.config.passport.authenticate())
        .get(app.api.article.getById)
        .put((app.api.article.save))
        .delete((app.api.article.remove))

    app.route('/categories/:id/articles')
       .all(app.config.passport.authenticate())
        .get(app.api.article.getByCategory)

    app.route('/stats')
    .all(app.config.passport.authenticate())
    .get(app.api.stat.get)

    
}