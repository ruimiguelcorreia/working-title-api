const app = require('./src/app');

const APP_PORT = 3000;

app.listen(APP_PORT, () => {
  console.log('App listening on port 3000.'); // eslint-disable-line
});
