/*
 * @Descripttion:
 * @Author: JTune
 * @Date: 2020-10-29 09:03:50
 */
import axios from 'axios';
import store from '@/store';
import router from '@/router';
import { Message } from 'element-ui';
import {
  localstorageGet
} from '@/utils/utils';
import { baseUrl } from '@/config/env.js';
const getHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded'
};
const postHeaders = {
  'Content-Type': 'application/json'
};

const http = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
  headers: getHeaders
});
http.interceptors.request.use(
  config => {
    const sid = localstorageGet('sid') || '';
    if (sid) {
      config.headers['sid'] = sid;
    }
    return config;
  }
);
// response 拦截器
http.interceptors.response.use(
  res => {
    return res.data;
  },
  error => {
    console.log(error, 'errr');
    return Promise.reject(error);
  }
);

function apiAxios(method, url, params, response) {
  const sid = localstorageGet('sid') || '';
  params.sid = sid;
  http({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    headers: method === 'GET' ? getHeaders : postHeaders
  }).then(function (res) {
    if (res.code && res.code === 'AUTH_401') {
      if (store.state.login.sid) {
        Message({
          message: '登录过期，请重新登录',
          type: 'error',
          duration: 5 * 1000
        });
        store.commit('CHANGE_SID', '');
        store.commit('CHANGE_LONGIN_NAME', '');
        store.commit('CHANGE_USER_NAME', '');
        router.push({ path: '/login' });
      }
    } else {
      response(res);
    }
  }).catch(function (err) {
    response(err);
  });
}

export default {
  get: function (url, params, response) {
    return apiAxios('GET', url, params, response);
  },
  post: function (url, params, response) {
    return apiAxios('POST', url, params, response);
  },
  put: function (url, params, response) {
    return apiAxios('PUT', url, params, response);
  },
  delete: function (url, params, response) {
    return apiAxios('DELETE', url, params, response);
  }
};
