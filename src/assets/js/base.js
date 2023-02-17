/*! direct by hjm */
/*
 * base.js定义常用变量、方法，适用于所有项目
 * vue项目，挂载在Vue.prototype,引用时直接用this
 */

// 常用正则表达式及验证
/*
 * vue项目使用说明
 * 1.this.check.phone  手机号码表达式
 * 2.this.check.regPhone  验证手机号码
 */
const check = {
  // 密码由6到20位数字和字符组成
  password: /^\S{6,20}$/,

  // 邮箱
  email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,

  // 手机验证码
  MobileVerificationCode: /^\d{6}$/,

  // 手机号码
  phone: /^1[3456789]\d{9}$/,

  // 电话号码
  // telphone: /^0\d{2,3}-?\d{7,8}$/,
  telphone: /^\d{3}-\d{8}|\d{4}-\d{7,8}$/,
  // 电话号码v2
  telephone: /^\d{3,4}-\d{7,8}$/,

  phoneTwo: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$|^0\d{2,3}-?\d{7,8}$/,

  // url
  url: /^http(s)?:\/\/(?!([\w-]+\.[\w-]+$))([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,

  // 金钱 xx.xx
  money: /^((0)|([1-9]\d{0,8}))(\.(\d){0,2})?$/,

  // 时间字符串  yyyy-MM-dd
  time1: /^\d{4}-((0[\d])|(1[012]))-(([012][\d])|(30)|(31))$/,

  // 时间字符串  yyyy-MM-dd hh:mm:ss
  time2: /^\d{4}-((0[\d])|(1[012]))-(([012][\d])|(30)|(31))\s(([01][\d])|(2[0123])):([012345][\d]):([012345][\d])$/,

  // 不小于0的数
  moreZero: /^((?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,})|0$/,

  // 空格
  space: /^[ ]+$/,

  // 手机验证码(默认6位)
  vailCode (num) {
    const c = type.num(num) ? num : 6
    const reg = new RegExp('^\\d{' + c + '}$', 'g')
    return reg
  },

  // 数字和字母的组合校验(默认5~10位)
  isNumLetter (min, max) {
    let min_, max_, reg
    min_ = type.num(min) ? min : 5
    max_ = type.num(max) ? max : 10
    if (min_ > max_) {
      const num = min_
      min_ = max_
      max_ = num
    }
    reg = new RegExp('^[a-zA-Z0-9]{' + min_ + ',' + max_ + '}$')
    return reg
  },
  // 数字和字母必须6位
  isNumLetterOnly () {
    let reg
    reg = new RegExp('^[a-zA-Z0-9]{6}$')
    return reg
  },

  // 数字字母下划线组合(默认5~10位)
  isNumLetterDown (min, max) {
    let min_, max_, reg
    min_ = type.num(min) ? min : 5
    max_ = type.num(max) ? max : 10
    if (min_ > max_) {
      const num = min_
      min_ = max_
      max_ = num
    }
    reg = new RegExp('^[0-9a-zA-Z_]{' + min_ + ',' + max_ + '}$')
    return reg
  },

  // 验证用户名、字母开头，4-20字母或数字组合
  isUserName (min, max) {
    let min_, max_, reg
    min_ = type.num(min) ? min : 4
    max_ = type.num(max) ? max : 20
    if (min_ > max_) {
      const num = min_
      min_ = max_
      max_ = num
    }
    reg = new RegExp('^[a-zA-Z][a-zA-Z0-9]{' + min_ + ',' + max_ + '}$')
    return reg
  },

  // 1到多少的整数  例如1-99整数
  isPositiveInteger (min, max) {
    let min_, max_, reg
    min_ = type.num(min) ? min : 0
    max_ = type.num(max) ? max : 10
    if (min_ > max_) {
      const num = min_
      min_ = max_
      max_ = num
    }
    reg = new RegExp('^[1-9]\\d{' + min_ + ',' + max_ + '}$')
    return reg
  },
  // 0到多少的整数  例如0-99整数
  isPositiveInteger0 (min, max) {
    let min_, max_, reg
    min_ = type.num(min) ? min : 0
    max_ = type.num(max) ? max : 10
    if (min_ > max_) {
      const num = min_
      min_ = max_
      max_ = num
    }
    reg = new RegExp('^\\d{' + min_ + ',' + max_ + '}$')
    return reg
  },

  // 验证邮箱
  regEmail (str) {
    return this.email.test(str)
  },

  // 验证手机号码
  regPhone (str) {
    return this.phone.test(str)
  },

  // 验证电话号码
  regTelphone (str) {
    return this.telphone.test(str)
  },

  // 同时验证手机和固话
  regPhoneTwo (str) {
    return this.phoneTwo.test(str)
  },

  // 验证手机验证码
  regVailCode (str, num) {
    const reg = this.vailCode(num)
    return reg.test(str)
  },

  // 验证url
  regUrl (str) {
    return this.url.test(str)
  },

  // 验证数字和字母的组合校验5~10位
  regIsNumLetter (str, min, max) {
    const reg = this.isNumLetter(min, max)
    return reg.test(str)
  },

  // 数字字母下划线组合校验5~10位
  regIsNumLetterDown (str, min, max) {
    const reg = this.isNumLetterDown(min, max)
    return reg.test(str)
  },

  // 验证金钱 xx.xx
  regMoney (str) {
    return this.money.test(str)
  },

  // 验证时间字符串  yyyy-MM-dd
  regTime1 (str) {
    return this.time1.test(str)
  },

  // 验证时间字符串  yyyy-MM-dd hh:mm:ss
  regTime2 (str) {
    return this.time2.test(str)
  },

  // 验证空格
  regSpace (str) {
    return this.space.test(str)
  }
}

// 常用对象类型判断
/*
 * vue项目使用说明
 * 1.this.type.str  判断字符串
 */
const type = {
  // 判断字符串
  str (str) {
    return Object.prototype.toString.call(str) == '[object String]'
  },

  // 判断数字
  num (str) {
    return Object.prototype.toString.call(str) == '[object Number]'
  },

  // 判断数组
  arr (str) {
    return Object.prototype.toString.call(str) == '[object Array]'
  },

  // 判断方法
  fun (str) {
    return Object.prototype.toString.call(str) == '[object Function]'
  },

  // 判断布尔
  bool (str) {
    return Object.prototype.toString.call(str) == '[object Boolean]'
  },

  // 判断对象
  obj (str) {
    return Object.prototype.toString.call(str) == '[object Object]'
  },

  // 判断NaN
  nan (str) {
    return isNaN(str)
  }
}

// 日期格式化
/**
 * 将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)、早午晚(T) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).dateFormat("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).dateFormat("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).dateFormat("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).dateFormat("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).dateFormat("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 * (new Date()).dateFormat("yyyy/MM/dd (EEE) T hh:mm") ==> 2017/09/06 (星期三) 下午 05:01
 */
Date.prototype.dateFormat = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
    'H+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  var week = {
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d'
  }
  var time = {
    0: '\u51cc\u6668', // 上午
    1: '\u4e0a\u5348', // 下午
    2: '\u4e0b\u5348', // 晚上
    3: '\u665a\u4e0a' // 凌晨
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + ''])
  }
  if (/(T)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, time[parseInt(this.getHours() / 6)])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return unescape(fmt.replace(/\/u/g, '%u'))
}

Number.prototype.toFixed = function (length) {
  let carry = 0 // 存放进位标志
  let num // num为原浮点数放大multiple倍后的数
  let multiple // multiple为10的length次方
  const _this = this < 0 ? -this : this // 转为正数处理
  const str = _this + '' // 将调用该方法的数字转为字符串
  let dot = str.indexOf('.') // 找到小数点的位置
  length = length < 0 || isNaN(parseInt(length)) ? 0 : parseInt(length) // 参数处理
  // 找到要进行舍入的数的位置，手动判断是否大于等于5，满足条件进位标志置为1
  if (str.indexOf('.') > -1 && str.substr(dot + length + 1, 1) >= 5) carry = 1 // 修复bug 必须同时满足
  multiple = Math.pow(10, length) // 设置浮点数要扩大的倍数
  num = Math.round(_this * multiple) + carry // 去掉舍入位后的所有数，然后加上我们的手动进位数
  let result = num / multiple + '' // 将进位后的整数再缩小为原浮点数

  dot = result.indexOf('.') // 处理进位后无小数
  if (dot < 0 && length != 0) { // length为0不保留小数点
    result += '.'
    dot = result.indexOf('.')
  }
  const len = result.length - (dot + 1) // 处理多次进位 例如.9999这种 缺位补零
  if (len < length) {
    for (let i = 0; i < length - len; i++) {
      result += 0
    }
  }
  return this < 0 ? '-' + result : result // 负号
}

// 表单检验
// 密码验证
const passwordValidator = (rule, value, callback) => {
  if (!check.password.test(value)) {
    callback(new Error('密码由6到20位数字和字符组成'))
  } else {
    callback()
  }
}

// 手机
const mobileValidator = (rule, value, callback) => {
  if (!check.phone.test(value)) {
    callback(new Error('手机号码格式错误'))
  } else {
    callback()
  }
}

// 邮箱
const emailValidator = (rule, value, callback) => {
  if (!check.email.test(value)) {
    callback(new Error('邮箱格式错误'))
  } else {
    callback()
  }
}

// 固话或者手机号码
const MobileOrTelephoneValidator = (rule, value, callback) => {
  if (!check.phone.test(value) && !check.telephone.test(value)) {
    callback(new Error('手机号码或固话格式错误'))
  } else {
    callback()
  }
}

// 手机验证码
const MobileVerificationCodeValidator = (rule, value, callback) => {
  console.log('mobileVerificationCode=' + value)
  if (!check.MobileVerificationCode.test(value)) {
    callback(new Error('验证码为6个数字'))
  } else {
    callback()
  }
}

// 金额大写转换
const changeMoney = function convertCurrency (money) {
  // 汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖')
  // 基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟')
  // 对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆')
  // 对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘')
  // 整数金额时后面跟的字符
  var cnInteger = '整'
  // 整型完以后的单位
  var cnIntLast = '元'
  // 最大处理的数字
  var maxNum = 999999999999999.9999
  // 金额整数部分
  var integerNum
  // 金额小数部分
  var decimalNum
  // 输出的中文金额字符串
  var chineseStr = ''
  // 分离金额后用的数组，预定义
  var parts
  if (money == '') { return '' }
  money = parseFloat(money)
  if (money >= maxNum) {
    // 超出最大处理数字
    return ''
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  // 转换为字符串
  money = money.toString()
  if (money.indexOf('.') == -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0
    var IntLen = integerNum.length
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1)
      var p = IntLen - i - 1
      var q = p / 4
      var m = p % 4
      if (n == '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        // 归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  // 小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1)
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum == '') {
    chineseStr += cnInteger
  }
  return chineseStr
}
  /**
 * 判断是否是空对象
 * @param data
 * @returns {boolean}
 */
   const $isEmptyObj = (data) => {
    return data ? JSON.stringify(data) === '{}' : true;
  };
  /**
   * 去除最后的符号
   * @param data
   * @returns {*}
   */
   const $removeComma = (data) => {
    const reg = /(,|，|\.|。|、|;|；|!|！|\?|？|~|～|@|#|¥|\$|%|&|\*|\(|\)|（|）|'|"|“|”|:|：|\\|\/|\^|\-|\=)$/;
    return data.replace(reg, '');
  };

  /**
   * 将'-'替换为'/'
   * @param data
   * @returns {*}
   */
  const $formatIOSData = (data) => {
    return /-/g.test(data) ? data.replace(/-/g, '/') : data;
  };
  /**
   * 格式化时间
   * @param {string} data - 时间戳
   * @param {string} fmt - 转换格式
   * @param {boolean} deleteZero - 是否去除时、分、秒和毫秒中的0（比如：2021-01-14 18:15:00:00 => 2021-01-14 18:15）
   * @returns {string} - 格式化后的时间
   */
   const $formatDate = (data, fmt = 'yyyy-MM-dd', deleteZero = false) => {
    if (!data) {
      return '';
    }
    let date = new Date(data);
    if (date === null) {
      return "";
    }
    const dateArr = [
      {regExp: 'c+', value: date.getMilliseconds()}, // 毫秒
      {regExp: 's+', value: date.getSeconds()}, // 秒
      {regExp: 'm+', value: date.getMinutes()}, // 分
      {regExp: 'h+', value: date.getHours()}, // 小时
      {regExp: 'd+', value: date.getDate()}, // 日
      {regExp: 'M+', value: date.getMonth() + 1}, // 月份
    ];
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    let _deleteZero = deleteZero;
    dateArr.forEach((item, index) => {
      if (new RegExp("(" + item.regExp + ")").test(fmt)) {
        const matchStr = RegExp.$1;
        const value = item.value;
        // 时、分、秒和毫秒为0时，不显示在最终结果中
        if (index < 4 && _deleteZero && value === 0) {
          fmt = fmt.replace(new RegExp(`[^csmh]?${matchStr}`), '');
          return;
        }
        const length = matchStr.length;
        fmt = fmt.replace(matchStr, (length == 1) ? (value) : ((Array(length + 1).join('0') + value).substr(('' + value).length)));
        if (_deleteZero = true) {
          _deleteZero = false;
        }
      }
    });
    return fmt;
  };
  /**
 * 对象深拷贝
 * @param obj
 * @returns {*}
 */
 const $deepCopy = (obj) => {
  // 根据obj的类型判断是新建一个数组还是对象
  let newObj = Array.isArray(obj) ? [] : {};
  // 判断传入的obj存在，且类型为对象
  if (obj && typeof obj === 'object') {
    for (let k in obj) {
      // 如果obj的子元素是对象，则进行递归操作
      if (obj[k] && typeof obj[k] === 'object') {
        newObj[k] = $deepCopy(obj[k]);
      } else {
        // 如果obj的子元素不是对象，则直接赋值
        newObj[k] = obj[k];
      }
    }
  }
  return newObj;
};

export default {
  check,
  type,
  passwordValidator,
  emailValidator,
  MobileOrTelephoneValidator,
  changeMoney,
  mobileValidator,
  MobileVerificationCodeValidator,
  $formatIOSData,
  $formatDate,
  $removeComma,
  $isEmptyObj,
  $deepCopy,
}
