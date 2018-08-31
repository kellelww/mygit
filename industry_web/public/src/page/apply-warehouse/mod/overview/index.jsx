'use strict';

import React from 'react';
import { ajax } from 'utils/index';
import { Icon } from 'antd';
import { connectAll } from 'common/redux-helpers';
import config from "./config.js";
// import _ from "lodash";
const _ = require('lodash');
import './index.scss'


class App extends React.Component {
  constructor(props){
     super(props);
     this.state={
		config: {}
     };
   };
	componentDidMount(){
		if(this.props.menu) {
			this.setState({
				menu: this.props.menu
			},() => {
				this.filterMenu();
			})
		}
	}
	
	componentWillReceiveProps(nextProps) {
		
	if(nextProps.menu) {
		this.setState({
			menu: nextProps.menu
		},() => {
			this.filterMenu();
		})
	}
	}
	 /** 
		* 过滤menu菜单
	 */
	filterMenu() {
		let { menu } = this.state;
		let applyUrl = menu.map((item,index) => {
			return item.url;
		})
		_.forEach(config,(menuList,key) => {
			menuList.forEach((item,index) => {
				if(applyUrl.includes(item.url)) {
					config[key][index].className = "active";
					config[key][index].permissions = true;
				}else {
					config[key][index].className = "inactive";	
					config[key][index].permissions = false;
									
				}
			})
		});
		this.setState({
			config: config
		})
	}

	onClickMenu(record,e) {
		if(record.permissions) {
			location.hash = '/'+record.url;
			// console.log(record.url, 'url')
			this.props.actions.setDefaultkey(true);
		}
	}
	menuDetails(record,e){
		//阻止事件冒泡
		e.stopPropagation();
		window.event.cancelBubble = true;
		location.hash = "/" + record.IntroduceUrl;
		this.props.actions.setDefaultkey(true);
	}
  render() {
		if(!this.state.config.eqp) {
			return null;
		}
		return (
			<div className="apply-content-overview">
				<div className="overview-content">

					<div className="overview-singe" >
						<div className="title">
							设备智能
						</div>
						{
							this.state.config.eqp.map((item,index) => {
								return (
									<div onClick={this.onClickMenu.bind(this,item)} key={index} className={item.className}>
										<div className={`${item.className}-img`}>
											<img width={48} height={48} src={item.permissions ? item.activeImg : item.inactiveImg} alt=""/>
										</div>
										<div className={`${item.className}-right-content`}>
											<h3 className={`${item.className}-name`}>{item.name}</h3>
											<div className={`${item.className}-desc`}>
												{item.desc}
											</div>
										</div>
									</div>
								)
							})
						}
					</div>
					<div className="overview-singe">
						<div className="title">
							产线智能
						</div>
						{
							this.state.config.proLine.map((item,index) => {
								return (
									<div onClick={this.onClickMenu.bind(this,item)} key={index} className={item.className}>
										<div className={`${item.className}-img`}>
											<img width={48} height={48} src={item.permissions ? item.activeImg : item.inactiveImg} alt=""/>
										</div>
										<div className={`${item.className}-right-content`}>
											<h3 className={`${item.className}-name`}>{item.name}</h3>
											<div className={`${item.className}-desc`}>
												{item.desc}
											</div>
										</div>
									</div>
								)
							})
						}
					</div>
					<div className="overview-singe">
						<div className="title">
							工艺智能
						</div>
						{
							this.state.config.process.map((item,index) => {
								return (
									<div onClick={this.onClickMenu.bind(this,item)} key={index} className={item.className}>
										<div className={`${item.className}-img`}>
											<img width={48} height={48} src={item.permissions ? item.activeImg : item.inactiveImg} alt=""/>
										</div>
										<Icon type="question-circle-o" onClick={this.menuDetails.bind(this,item)} className="next-icon" style={{ fontSize: 17}}/>
										<div className={`${item.className}-right-content`}>
											<h3 className={`${item.className}-name`}>{item.name}</h3>
											<div className={`${item.className}-desc`}>
												{item.desc}
											</div>
										</div>
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		)
  }
}
export default connectAll(App);
