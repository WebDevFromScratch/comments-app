// This initter is shared between all bundles
import React      from 'react';
import Router     from 'react-router';
import Location   from 'react-router/lib/Location';
import serialize  from 'serialize-javascript';
import jade       from 'jade';

export default (req, res, next, params) => {
  // Storing params in variables
  const { routes, bundle, locals, Head } = params;

  // Creating location object for the server router
  const location = new Location(req.path, req.query);

  // Running the router
  Router.run(routes, location, (error, initialState, transition) => {
    // If something went wrong, respond with 500
    if (error) return res.status(500).send(error);

    try {
      // Rendering <head> tag
      // Using 'renderToStaticMarkup' here,
      // because we don't need React ids on these nodes
      locals.head = React.renderToStaticMarkup(
        <Head cssAsset={locals.cssAsset} />
      );

      // Rendering app
      locals.body = React.renderToString(
        <Router location={location} {...initialState} />
      );

      // Storing webpack chunks in variable
      // to expose it as global var in html for production bundles
      // It's related to long-term caching of assets (details below)
      const chunks = __DEV__ ? {} : require('public/assets/chunk-manifest.json');

      locals.chunks = serialize(chunks);

      // Defining path to jade layout
      // TODO: check this piece
      const layout = `${process.cwd()}/app/bundles/${bundle}/layouts/Layout.jade`;

      // Compiling initial html
      const html = jade.compileFile(layout, { pretty: false })(locals);

      // 😽💨
      res.send(html);
    } catch (err) {
      res.status(500).send(err.stack);
    }
  });
}
