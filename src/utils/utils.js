/*
 * @Descripttion:缓存
 * @Author: JTune
 * @Date: 2020-10-29 09:03:50
 */
export const localstorageSet = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};
export const localstorageGet = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
};

export const localstorageRemove = name => {
  if (!name) return;
  return window.localStorage.removeItem(name);
};
/**
 * 日期转换
 * @param times {Number, String} 转换的日期
 * @param type {Number, String} 转换的日期格式
 * @return {String}
 */
export const timeWeekFormat = (times, type) => {
  // 定义一个日期对象;
  const dateTime = new Date(times);
  // 获得系统年份;
  const year = dateTime.getFullYear();
  // 获得系统月份;
  let month = dateTime.getMonth() + 1;
  // 获得系统当月分天数;
  let day = dateTime.getDate();
  // 获得系统小时;
  let hours = dateTime.getHours();
  // 获得系统分钟;
  let minutes = dateTime.getMinutes();
  // 获得系统秒数;
  let second = dateTime.getSeconds();
  // 获得系统星期几;
  let dayCycle = dateTime.getDay();
  // 使用数组更改日期样式;
  const dayCycleArray = ['日', '一', '二', '三', '四', '五', '六'];
  for (let i = 0; i < 7; i++) {
    if (dayCycle == i) {
      // 将dayCycleArray的数赋值到系统星期几里面中去;
      dayCycle = dayCycleArray[i];
    }
  }
  month < 10 ? month = '0' + month : month;
  day < 10 ? day = '0' + day : day;
  hours < 10 ? hours = '0' + hours : hours;
  minutes < 10 ? minutes = '0' + minutes : minutes;
  second < 10 ? second = '0' + second : second;
  let dateStr = null;
  switch (type) {
    case 'yyyy-MM-dd':
      dateStr = `${year}-${month}-${day}`;
      break;
    case 'yyyy-MM-dd HH:mm:ss':
      dateStr = `${year}-${month}-${day}\xa0${hours}:${minutes}:${second}`;
      break;
    case 'yyyy/MM/dd':
      dateStr = `${year}/${month}/${day}`;
      break;
    default:
      dateStr = `${year}/${month}/${day}\xa0\xa0星期${dayCycle}\xa0\xa0${hours}:${minutes}`;
  }
  return dateStr;
};

/**
 * 字符串截取
 * @param param { String} "2021-01-04 00:00"
 * @return {String}
 */
export const splitStr = (param) => {
  const str = param;
  let data = null;
  if (str) {
    const arr = str.split(' ');
    data = arr[1];
  }
  return data;
};
