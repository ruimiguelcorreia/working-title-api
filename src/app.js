// Loading express framework.
const express = require('express');

// Creating instance of express to serve endpoints.
const app = express();

// Loading the body-parser helper.
app.use(express.json());

// Controllers:
const moviesControllers = require('./controllers/movies');
const providersControllers = require('./controllers/providers');
const seriesControllers = require('./controllers/series');

// MOVIES ROUTES:
app.get('/movies/:movieTitle', moviesControllers.listTitles);

app.get('/single-movie/:id', moviesControllers.expandMovieInfo);

// TV SHOWS ROUTES:

app.get('/shows/:showTitle', seriesControllers.listShows);

app.get('/single-show/:id', seriesControllers.expandShowInfo);

// PROVIDERS ROUTES:

app.get('/providers', providersControllers.listProviders);

module.exports = app;
