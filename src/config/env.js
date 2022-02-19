/*
 * @Descripttion:添加测试环境
 * @Author: JTune
 * @Date: 2020-10-29 09:03:50
 */
let baseUrl = '';
let wsUrl = '';
const env = process.env.NODE_ENV;
const flag = process.env.VUE_APP_FLAG;
if (env == 'production') {
  if (flag == 'dev') { // 线上开发环境
    // baseUrl = 'http://192.168.1.109:8081/center/';
    // wsUrl = 'ws://192.168.1.109:8081/center/';
    baseUrl = 'http://119.136.17.18:8081/center/';
    wsUrl = 'ws://119.136.17.18:8081/center/';
  } else if (flag == 'test') { // 测试环境
    baseUrl = 'http://192.168.1.129:8081/center/';
    wsUrl = 'ws://192.168.1.129:8081/center/';
    // baseUrl = 'http://119.136.17.18:8081/center/';
    // wsUrl = 'ws://119.136.17.18:8081/center/';
  } else { // 生产环境
    // baseUrl = 'http://192.168.1.109:8081/center/';
    // wsUrl = 'ws://192.168.1.109:8081/center/';
    baseUrl = 'http://119.136.17.18:8081/center/';
    wsUrl = 'ws://119.136.17.18:8081/center/';
  }
} else { // 开发环境
  baseUrl = 'http://119.136.17.18:8081/center/';
  wsUrl = 'ws://119.136.17.18:8081/center/';
  // 泰源地址
  // baseUrl = 'http://192.168.1.112:8081/center/';
  // wsUrl = 'ws://192.168.1.112:8081/center/';
  // 詹建行地址;
  // baseUrl = 'http://192.168.1.241:8081/center/';
  // wsUrl = 'ws://119.136.17.18:8081/center/';
  // // 林思亮地址
  // baseUrl = 'http://192.168.1.209:8081/center/';
  // wsUrl = 'ws://119.136.17.18:8081/center/';
  // 开发
  // baseUrl = 'http://192.168.1.129:8081/center/';
  // wsUrl = 'ws://192.168.1.129:8081/center/';
}
export {
  baseUrl,
  wsUrl
};
