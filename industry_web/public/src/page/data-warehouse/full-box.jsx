'use strict';

import React from 'react';
import { Button, Row, Col, Table, Icon,} from 'antd';
import { ajax } from 'utils/index';
import 'utils/apimap';
import { connectAll } from 'common/redux-helpers';


class FullBox extends React.Component {
  constructor(props){
    super(props);
    this.state={
    
    };
  }
  render() {
    return (
            <div className="data-null">
              <div className="bg-img"></div>
              <p className="text1">你的数据舱暂时是空的</p>
              <p className="text2">查看<a>数据上云</a>把数据舱填满</p>
            </div>
        );
  }
}
export default connectAll(FullBox);
