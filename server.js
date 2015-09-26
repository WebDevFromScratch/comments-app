import express  from 'express';
import parser   from 'body-parser';
import cookies  from 'cookie-parser';
import path     from 'path';

export default (initter, config) => {
  // Defining some globals
  global.__CLIENT__ = false;
  global.__SERVER__ = true;
  global.__DEV__    = config.env !== 'production';

  // Initializing app
  const app = express();

  // Parsing json bodies
  app.use(parser.json());

  // Parsing url-encoded bodies
  app.use(parser.urlencoded({ extended: true }));

  // Parsing cookies
  app.use(cookies());

  // Serving static files from 'public' dir
  app.use(express.static(path.join(__dirname, 'public')));

  // Transferring incoming requests to middleware function of the bundle
  app.use('/', initter);

  // Setting up port to listen
  app.set('port', config.appPort);

  // And listening it
  app.listen(app.get('port'), function() {
    console.log('=> 🚀  Express ${config.bundle} ${config.env} server is running on port ${this.address().port}');
  });
}
