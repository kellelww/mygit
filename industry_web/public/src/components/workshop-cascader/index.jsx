'use strict';

import React from 'react';
import classnames from 'classnames';
import { connectAll } from 'common/redux-helpers';
import { ajax } from 'utils/index';
import { Checkbox } from 'antd';
import 'utils/apimap';
import './index.scss';
class Cascaser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleClick(id) {
    this.props.handleClick(id)
  }
  handleCheck(value) {
    this.props.handleCheck(value);
  }
  render() {
    const { workshopData, workshop, defaultChecked, isShowWorkShop, active } = this.props;
    return (
      <div className="cascader-wrapper">
        <div className='workshop-list'>
          {
            workshopData && workshopData.map((item, index) => {
              return (
                <li className={active == item.id ? 'active' : 'list'} onClick={this.handleClick.bind(this, item.id)} key={index}>{item.label} ></li>
              )
            })
          }
        </div>
        {
          isShowWorkShop ? <div className='workshop-list'>
            <Checkbox.Group value={defaultChecked}  onChange={this.handleCheck.bind(this)}>
              {
                workshop.map((item, index) => {
                  return (
                    <Checkbox value={item.value} className='list' key={index}>{item.label}</Checkbox>
                  )
                })
              }
            </Checkbox.Group>
          </div> : null
        }

      </div>
    );
  }
}

export default connectAll(Cascaser);
