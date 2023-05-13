const { validationResult } = require('express-validator');
const {Movie, Sequelize, Genre} = require('../database/models');
const {Op}= Sequelize

//Otra forma de llamar a los modelos


const moviesController = {
    'list': (req, res) => {
       Movie.findAll({
        include: [{association: "actors"}]
       })
            .then(movies => {
               //res.send(movies)
                 res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
       Movie.findByPk(req.params.id, {
        include: [
            {association: "actors"},
            {association: "genres"}
        ]
       })
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            })
            .catch(error=> console.log(error));
    },
    'new': (req, res) => {
       Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
       Movie.findAll({
            where: {
                rating: {[Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        Genre.findAll()
        .then(genres => {
            return res.render("moviesAdd", {genres})
        })
        .catch(error => console.log(error))
       
    },
    create: function (req, res) {
        const errors = validationResult(req);

        if(errors.isEmpty()){
            const {
                title,
                awards,
                release_date,
                lenght,
                rating,
                genre_id

                }= req.body

                Movie.create({
                    title,
                    awards,
                    release_date,
                    lenght,
                    rating,
                    genre_id
                })
                .then((movie)=>{
                   return res.redirect("/movies")
                })
                .catch((error)=>console.log(error))
        }else {
            return res.render("moviesAdd", {errors: errors.mapped()})
        }
    },
    /* 
    edit: function(req, res) {
        const MOVIE_ID = req.params.id;
        const MOVIE_PROMISE = Movie.findByPk(MOVIE_ID);
        const GENRES_PROMISE = Genre.findAll();
        
        Promise.all([MOVIE_PROMISE, GENRES_PROMISE])
        .then(([Movie, genres]) => {
            return res.render("moviesEdit", {Movie, genres})
        })
        .catch(error => console.log(error));
    },
    */
    edit: function(req, res) {
        const movieId = req.params.id
        const MOVIE_PROMISE = Movie.findByPk(movieId);
        const GENRES_PROMISE = Genre.findAll();

        Promise.all([MOVIE_PROMISE,GENRES_PROMISE])
        .then(([Movie, genres]) => {
            return res.render("moviesEdit",{Movie, genres})
        })
        .catch((error)=>console.log(error))
    },
    update: function (req,res) {
        const movieId = req.params.id
        const errors = validationResult(req);

        if(errors.isEmpty()){
            const {
                title,
                awards,
                release_date,
                length,
                rating,
                genre_id
                }= req.body
            Movie.update({
                title,
                awards,
                release_date,
                length,
                rating,
                genre_id
            },{
                where: {
                    id: movieId,
                }
            })
            .then((response) => {
                if(response){
                   return res.redirect(`/movies/detail/${movieId}`)
                }else{
                    throw new Error()
                }
            })
            .catch(error=> {
                return console.log(error)
            })

        }else{
            Movie.findByPk(movieId)
            .then(Movie => {
            return res.render("moviesEdit",{Movie, errors:errors.mapped()})
        })
        .catch((error)=>console.log(error))
        }


    },
    delete: function (req, res) {
        const movieId = req.params.id

        Movie.findByPk(movieId)
        .then(movieToDelete =>{
            res.render("moviesDelete", { 
                Movie : movieToDelete
            })
        })
        .catch(error=>{
            return console.log(error)
        })

     
    },
    destroy: function (req, res) {
        const movieId = req.params.id

        Movie.destroy({
            where: {
                id: movieId
            }
        })
        .then(() => {
            return res.redirect("/movies")
        })
        .catch(error => console.log(error))

}
}
module.exports = moviesController;