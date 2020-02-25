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
      t: title,
      apikey: OMBD_API_KEY,
      plot: 'full',
    },
  });

  const justWatchResponse = await jw.search({
    query: title,
    page: 1,
    page_size: 1,
  });

  response.status(200).json({
    imbd: imbdResponse.data,
    justWatch: justWatchResponse.items.pop(),
  });
});

module.exports = app;
