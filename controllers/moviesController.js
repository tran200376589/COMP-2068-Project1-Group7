const Movie = require('../models/movie');

exports.index = (req, res) => {
    req.isAuthenticated();

    Movie.find({
        author: req.session.userId
    })
        .populate('author')
        .then(movies => {
            res.render('movies/index', {
                movies: movies,
                title: 'Archive'
            });
        })
        .catch(err => {
            req.flash('error', `ERROR: ${err}`);
            res.redirect('/');
        });
};

exports.drafts = (req, res) => {
    req.isAuthenticated();

    Movie.find({
        author: req.session.userId
    }).draft()
    .populate('author')
    .then(movies => {
        res.render('movies/index', {
            movies: movies,
            title: 'Drafts'
        });
    })
        .catch(err => {
            req.flash('error', `ERROR: ${err}`);
            res.redirect('/');
        });
};

exports.published = (req, res) => {
    req.isAuthenticated();

    Movie.find({
        author: req.session.userId
    }).published()
    .populate('author')
    .then(movies => {
        res.render('movies/index', {
            movies: movies,
            title: 'Published'
        });
    })
    .catch(err => {
        req.flash('error', `ERROR: ${err}`);
        res.redirect('/');
    });
};

exports.show = (req, res) => {
    req.isAuthenticated();

    Movie.findOne({
        _id: req.params.id,
        author: req.session.userId
    })
    .then(movie => {
        res.render('movies/show', {
            movie: movie,
            title: movie.title
        })
    })
    .catch(err => {
        req.flash('error', `ERROR: ${err}`);
        res.redirect('/');
    });
};

exports.new = (req, res) => {
    req.isAuthenticated();

    res.render('movies/new', {
        title: 'My New Movie'
    });
};

exports.edit = (req, res) => {
    req.isAuthenticated();
    
    Movie.findOne({
        _id: req.params.id,
        author: req.session.userId
    })
    .then(movie => {
        res.render('movies/edit', {
            movie: movie,
            title: movie.title
        })
    })
    .catch(err => {
        req.flash('error', `ERROR: ${err}`);
        res.redirect('/');
    });
};

exports.create = (req, res) => {
    req.isAuthenticated();

    req.body.blog.author = req.session.userId;

    Movie.create(req.body.blog)
    .then(() => {
        req.flash('success', 'New Movie was created successfully.');
        res.redirect('/movies');
    })
    .catch(err => {
        req.flash('error', `ERROR: ${err}`);
        res.redirect('/blogs/new');
    });
};

exports.update = (req, res) => {
    req.isAuthenticated();

    Movie.updateOne({
        _id: req.body.id,
        author: req.session.userId
    }, req.body.movie, {
        runValidators: true
    })
    .then(() => {
        req.flash('success', 'New Movie was created successfully.');
        res.redirect(`/movies/${req.body.id}`);
    })
    .catch(err => {
        req.flash('error', `ERROR: ${err}`);
        res.redirect(`/movies/${req.body.id}/edit`);
    });
};

exports.destroy = (req, res) => {
    Movie.deleteOne({
        _id: req.body.id,
        author: req.session.userId
    })
    .then(() => {
        req.flash('success', 'New Movie was created successfully.');
        res.redirect('/movies');
    })
    .catch(err => {
        req.flash('error', `ERROR: ${err}`);
        res.redirect(`/movies`);
    });
};

// To fill in later
exports.drafts = (req, res) => {};

exports.published = (req, res) => {};