import React, {PropTypes} from 'react';

export default class App extends React.Component {
  render() {
    return (
      <div style={{color: this.props.color}}>
        MyComponent
      </div>);
  }
}
