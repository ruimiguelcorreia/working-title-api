const axios = require('axios');
const JustWatch = require('justwatch-api');

exports.listShows = async (req, res) => {
  const { showTitle } = req.params;
  const { OMBD_API, OMBD_API_KEY } = process.env;
  const jw = new JustWatch({ locale: 'en_GB' });

  const imdbCall = await axios
    .get(OMBD_API, {
      params: {
        s: showTitle,
        apikey: OMBD_API_KEY,
        plot: 'full',
        page: 1,
        type: 'series',
      },
    })
    .then(async imdbResponse => {
      const results = await Promise.all(
        imdbResponse.data.Search.map(show =>
          jw.search({
            query: show.Title,
            page: 1,
            page_size: 1,
          }),
        ),
      );
      res.status(200).json({ imdb: imdbResponse.data, justWatch: results });
    });
};

exports.expandShowInfo = async (req, res) => {
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
