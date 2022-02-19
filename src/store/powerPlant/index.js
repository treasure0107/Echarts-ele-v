/*
 * @Descripttion:
 * @Author: JTune
 * @Date: 2020-11-27 11:44:45
 */
import {
  localstorageSet,
  localstorageGet
} from '@/utils/utils';
const state = {
  powerPlantId: localstorageGet('powerPlantId') || '', // 风电场ID
  powerPlant: localstorageGet('powerPlant') || '', // 风电场名称
  windPowerPlantWs: []
};
const mutations = {
  CHANGE_POWER_PLANT_ID: (state, data) => {
    state.powerPlantId = data;
    localstorageSet('powerPlantId', data);
  },
  CHANGE_POWER_PLANT: (state, data) => {
    state.powerPlant = data;
    localstorageSet('powerPlant', data);
  },
  windPowerPlantWs: (state, data) => {
    state.windPowerPlantWs = data;
    // localstorageSet('windPowerPlantWs', data);
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
