var express = require("express");
var router = express.Router();
const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");

router.get("/all-movies", function (req, res, next) {
  Movie.find()
    .then((movies) => {
      res.render("movies/movies.hbs", { movies });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/add-movie", function (req, res, next) {
  Celebrity.find()
    .then((celebrities) => {
      res.render("movies/new-movie.hbs", { celebrities });
    })
    .catch((err) => console.log(err));
});

router.post("/add-movie", (req, res, next) => {
  let { title, genre, plot, cast } = req.body;

  Movie.create({ title, genre, plot, cast })
    .then((movie) => {
      res.redirect("/movies/all-movies");
      console.log("New movie: ", movie);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/movie-details/:movieId", (req, res, next) => {
  const movieId = req.params.movieId;
  Movie.findById(movieId)
    .populate("cast")
    .then((movie) => {
      console.log("Movie id details: ", movie);
      res.render("movies/movie-details.hbs", movie);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/delete/:movieId", (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .then(() => {
      res.redirect("/movies/all-movies");
      console.log("Movie delete request: ", req.params.movieId);
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.get("/edit/:id", (req, res, next) => {
//   console.log("Movie to edit: ", req.params.id);
//   Movie.findById(req.params.id)
//     .populate("cast")
//     .then((movie) => {
//       Celebrity.find()
//         .then((celebs) => {
//           res.render("movies/edit-movie.hbs", { movie, celebs });
//         })
//         .catch((err) => console.log(err));
//     });
// });

router.get("/edit/:id", (req, res) => {
    const { id } = req.params;

    Movie.findById(id).then((movie) => {
      Celebrity.find().then((celebs) => {
        let remainingCelebs = celebs.filter(
          (cur) => !movie.cast.includes(cur._id)
        );
        let starringCelebs = celebs.filter((cur) => movie.cast.includes(cur._id));

        res.render("movies/edit-movie.hbs", {
          movie,
          remainingCelebs,
          starringCelebs,
        });
      });
    });
  });

router.post("/edit/:id", (req, res, next) => {
  const { title, genre, plot, cast } = req.body;
  Movie.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
    (movie) => {
      console.log("Redirected movie: ", movie);
      res.redirect(`/movies/movie-details/${req.params.id}`);
    }
  );
});

module.exports = router;
