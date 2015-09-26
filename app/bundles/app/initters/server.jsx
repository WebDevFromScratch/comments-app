import initter    from 'app/libs/initters/server';
import getAsset   from 'app/libs/getAsset';
import config     from 'config/server.app';
import routes     from '../routes/routes';
import Head       form '../layouts/Head';

export default (req, res, next) => {
  const { bundle } = config;

  const params = {
    // Name of the bundle
    bundle,

    // Routes
    routes,

    // <head> template
    Head,

    // Variables for Jade template
    // Here we store paths to compiled assets to inject them in html
    // Explore 'getAsset' helper in 'app/libs' folder
    locals: {
      jsAsset     : getAsset(bundle, 'js'),
      cssAsset    : getAsset(bundle, 'css'),
      vendorAsset : getAsset('vendor', 'js')
    }
  };

  // Initializing app
  initter(req, res, next, params);
}
