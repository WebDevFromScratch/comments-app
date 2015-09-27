// This initter is shared between all bundles
import React          from 'react';
import Router         from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';

export default (params) => {
  const { routes } = params;

  // Creating history object for the client router
  const history = new BrowserHistory();

  // Creating app container
  const AppContainer = (
    <Router history={history} children={routes} />
  );

  // Selecting DOM container for app
  const appDOMNode = document.getElementById('app');

  // Flushing application to DOM
  React.render(AppContainer, appDOMNode);
}
