// Loading express framework.
const express = require('express');

// Creating instance of express to serve endpoints.
const app = express();

// Loading the body-parser helper.
app.use(express.json());

// Loading request packages.
const axios = require('axios');
const JustWatch = require('justwatch-api');

// Routes.
app.get('/titles/:title', async (request, response) => {
  const { title } = request.params;
  const { OMBD_API, OMBD_API_KEY } = process.env;
  const jw = new JustWatch({ locale: 'en_GB' });

  const imbdResponse = await axios.get(OMBD_API, {
    params: {
      s: title,
      apikey: OMBD_API_KEY,
      plot: 'full',
      page: 1,
    },
  });

  // const justWatchResponse = await jw.search({
  //   query: title,
  //   page: 1,
  //   page_size: 5,
  // });

  response.status(200).json({
    imbd: imbdResponse.data,
    // justWatch: justWatchResponse.items,
  });
});

// Route for Movies

app.get('/movies/:movieTitle', async (request, response) => {
  const { movieTitle } = request.params;
  const { OMBD_API, OMBD_API_KEY } = process.env;
  const jw = new JustWatch({ locale: 'en_GB' });
  const titlesToQuery = [];
  const results = [];

  const justWatchResponse = await jw.search({
    query: movieTitle,
    page: 1,
    page_size: 10,
  });

  justWatchResponse.items.map(movie => titlesToQuery.push(movie.title)); // Saving an array with titles.

  const imdbResponse = titlesToQuery.map(title =>
    axios
      .get(OMBD_API, { params: { apikey: OMBD_API_KEY, plot: 'full', t: title } })
      .then(result => results.push(result)),
  );

  response.status(200).json(results);
});

// Route for Providers

app.get('/providers', async (request, response) => {
  const jw = new JustWatch({ locale: 'en_GB' });

  const providers = await jw.getProviders();

  response.status(200).json(providers);
});

module.exports = app;
