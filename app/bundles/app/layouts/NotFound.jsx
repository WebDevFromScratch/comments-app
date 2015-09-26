import React from 'react';

export default class NotFound extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <section id='not-found'>
        Oops, nothing here!
      </section>
    );
  }
}
