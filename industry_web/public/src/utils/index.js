'use strict';

import api from './apimap';
import axios from "axios";
import { message } from 'antd';

const Tools = {
  ajax(param, suc, err) {
    let json = JSON.parse(JSON.stringify(param).replace(/api/g,"url"));
    json.url = api.local[param.api];
    return axios(json).then((res)=>{
      if(!res.data.data&&res.data.message != "success"){
      // message.destroy();
      message.warning(res.data.message);
      }
      suc(res)
    }).catch((err)=>{
      message.destroy();
      message.warning(err);
    });
  },
  isLocal() {
    const host = window.location.host;
    return host.indexOf('127.0.0.1') > -1 || host.indexOf('localhost') > -1;
  }
};
export const ajax = Tools.ajax.bind(Tools);
export default Tools;