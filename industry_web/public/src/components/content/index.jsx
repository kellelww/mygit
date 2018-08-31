import React, { Component } from 'react'
import "./index.scss";
import { connectAll } from 'common/redux-helpers';

class App extends Component {
  render() {
    return (
      <div className="content-component">
        <div className="content-box">
          <h2>{this.props.title}</h2>
          <div className="box">
            {
              this.props.children
            }
          </div>
        </div>
      </div>
    )
  }
}
export default App;
