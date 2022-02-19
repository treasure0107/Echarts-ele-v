/*
 * @Descripttion:过滤器
 * @Author: JTune
 * @Date: 2020-12-08 10:12:38
 */

const filters = {
  /**
   * 四舍五入
   * @param val {Number, String} 转换的字符串对象
   * @param retain {Number} 保留位数
   * @return {String}
   */
  integer: function (val) {
    return Math.round(val);
  },
  /**
   * 小数点保留
   * @param val {Number, String} 转换的字符串对象
   * @param num {Number, String} 保留小数位
   * @param retain {Number} 保留位数
   * @return {String}
   */
  decimalt: function (val, num) {
    if (!num) {
      return val.toFixed(2);
    }
    return val.toFixed(num);
  }
};
export default filters;
