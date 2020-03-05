const JustWatch = require('justwatch-api');

exports.listProviders = async (req, res) => {
  const jw = new JustWatch({ locale: 'en_GB' });

  const providers = await jw.getProviders();

  res.status(200).json(providers);
};
