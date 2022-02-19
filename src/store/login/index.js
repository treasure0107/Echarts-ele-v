/*
 * @Descripttion:
 * @Author: JTune
 * @Date: 2020-11-17 10:09:38
 */
import {
  localstorageSet,
  localstorageGet
} from '@/utils/utils';
const state = {
  loginName: localstorageGet('loginName') || '',
  sid: localstorageGet('sid') || '',
  userName: localstorageGet('userName') || ''
};
const mutations = {
  CHANGE_LONGIN_NAME: (state, data) => {
    state.loginName = data;
    localstorageSet('loginName', data);
  },
  CHANGE_SID: (state, data) => {
    state.sid = data;
    localstorageSet('sid', data);
  },
  CHANGE_USER_NAME: (state, data) => {
    state.userName = data;
    localstorageSet('userName', data);
  }
};
const actions = {

};
const getters = {

};

// 不要忘记把state, mutations等暴露出去。
export default {
  state,
  mutations,
  actions,
  getters
};
