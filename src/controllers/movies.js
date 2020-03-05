const axios = require('axios');
const JustWatch = require('justwatch-api');

exports.listTitles = async (req, res) => {
  const { movieTitle } = req.params;
  const { OMBD_API, OMBD_API_KEY } = process.env;
  const jw = new JustWatch({ locale: 'en_GB' });

  const imdbCall = await axios
    .get(OMBD_API, {
      params: {
        s: movieTitle,
        apikey: OMBD_API_KEY,
        plot: 'full',
        page: 1,
        type: 'movie',
      },
    })
    .then(async imdbResponse => {
      const results = await Promise.all(
        imdbResponse.data.Search.map(movie =>
          jw.search({
            query: movie.Title,
            page: 1,
            page_size: 1,
          }),
        ),
      );
      res.status(200).json({ imdb: imdbResponse.data.Search, justWatch: results });
    });
};

exports.expandMovieInfo = async (req, res) => {
  const { id } = req.params;
  const { OMBD_API, OMBD_API_KEY } = process.env;
  const jw = new JustWatch({ locale: 'en_GB' });

  const imdbInfo = await axios.get(OMBD_API, {
    params: {
      apikey: OMBD_API_KEY,
      i: id,
      plot: 'full',
    },
  });

  const justWatchInfo = await jw.search({
    query: imdbInfo.data.Title,
    page: 1,
    page_size: 1,
  });

  res.status(200).json({
    imdb: imdbInfo.data,
    justWatch: justWatchInfo.items,
  });
};
