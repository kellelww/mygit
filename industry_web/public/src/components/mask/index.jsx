import React, { Component } from 'react'
import { Button } from 'antd';
import "./index.scss";
import { connectAll } from 'common/redux-helpers';

class App extends Component {
  render() {
    return (
      <div className="mask-content-component">
        <div className={this.props.isShowMask ? "mask mask-switch" : "mask"}>
          <div className="mask-show">
            <div className="title">
              <h3>{this.props.title}</h3>
              <div>
                {this.props.onClose && <Button style={{ width: 82 }} style={{ marginRight: 10, width: 82 }} onClick={this.props.onClose.bind(this)}>{this.props.close ? this.props.close : "关闭"}</Button>}
                {this.props.onSubmit && <Button disabled={this.props.disabled} style={{ width: 82 }} type="primary" onClick={this.props.onSubmit.bind(this)} >{this.props.ok ? this.props.ok : "确定"}</Button>}
              </div>
            </div>
            <div className="mask-scroll" >
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default connectAll(App);
