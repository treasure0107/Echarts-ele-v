const comUtil = {
  phoneReg: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, // 手机     /^(\d{11})$/
  hkPhoneReg: /^([2|3|4|5|6|8|7|9])\d{7}$/,
  emailReg: /^([A-Za-z0-9_\+\-\.])+\@([A-Za-z0-9_\-])+\.([A-Za-z]{2,8})$/, // 邮箱
  pwdReg: /^[^\s\u4e00-\u9fa5]{6,16}$/, // 除空格和中文外的所有字符
  onlyNumOrLetter: /^[0-9a-zA-Z]{4,16}$/, // 4-16位英文和数字
  onlyNumber: /^\d+$/,
  justNumber: /^[0-9]\d*$/, // 0开头数字
  positiveInteger: /^[1-9]\d*$/, // 正整数
  numberReg: /^[0-9]*$/,
  decimalNumber: /^\d+(\.\d{0,2})?$/, // 2位小数
  fileTypeCanPreview: /.*\.(png|jpg|jpeg|bmp)$/,
  fileTypeZIPRAR: /.*\.(zip|rar)$/,
  fileTypeMustDownload: /.*\.(png|jpg|jpeg|bmp|pdf)$/,
  identityCard: /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/ // 身份证

};
export default comUtil;
