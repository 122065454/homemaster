/**
 * 时间转换
 * @param {String} data   //毫秒时间戳
 * @param {Number} type   //展示方式
 */
 const _formatDate = (data, type) => {
	var date = new Date(+data)
	var y = date.getFullYear()
	var m = date.getMonth() + 1
	m = m < 10 ? ('0' + m) : m
	var d = date.getDate()
	d = d < 10 ? ('0' + d) : d
	var h = date.getHours()
	h = h < 10 ? ('0' + h) : h
	var minute = date.getMinutes()
	minute = minute < 10 ? ('0' + minute) : minute
	var second = date.getSeconds()
	second = second < 10 ? ('0' + second) : second
	if (type === 1) {
	  	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
	} else if (type === 2) {
	  	return y + '-' + m + '-' + d + ' ' + h + ':' + minute
	} else if (type === 3) {
	  	return m + '-' + d + ' ' + h + ':' + minute + ':' + second
	}else if (type === 4) {
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
	}else if (type === 5) {
		return m + '月' + d + '日'
	}else if (type === 6) {
		return y + '/' + m + '/' + d 
	}else if (type === 7) {
		return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second
	}else if (type === 8) {
		return m + '/' + d + ' ' + h + ':' + minute
	}else if (type === 9) {
		return h + ':' + minute + ' ' + m + '/' + y
	}else if (type === 10) {
		return y + '-' + m + '-' + d 
	}else if (type === 11) {
		return m + '-' + d 
	}else if (type === 12) {
		return m + '/' + d + ' ' + h + ':' + minute
	}else if (type === 13) {
		return m + '-' + d + ' ' + h + ':' + minute
	}else {
	  return h + ':' + minute + ':' + second
	}
}

/**
 * 每三位隔一逗号
 * @param {String/Number} str  //需要格式化得数字
 * @param {Number}  index   保留小数位数
 */
 const _numComma = (num, decimal) => {
	const index = decimal ? decimal : 2
	if (Number(num) >= 0) {
		let a = 0
		a = a.toFixed(index).split('.')[1]
		let str = num.toString()
		let newStr = ""
		let count = 0
		// 当数字是整数
		if (str.indexOf(".") === -1) {
			for (let i = str.length - 1; i >= 0; i--) {
				if (count % 3 === 0 && count !== 0) {
					newStr = str.charAt(i) + "," + newStr;
				} else {
					newStr = str.charAt(i) + newStr;
				}
				count++;
			}
			str = newStr ; //自动补小数点后两位
			return str;
		}
		// 当数字带有小数
		else {
			for (let i = str.indexOf(".") - 1; i >= 0; i--) {
				if (count % 3 === 0 && count !== 0) {
					newStr = str.charAt(i) + "," + newStr;
				} else {
					newStr = str.charAt(i) + newStr; //逐个字符相接起来
				}
				count++;
			}
			str = newStr + (str + a).substr((str + a).indexOf("."), index + 1);
			return str
		}
	}
}

/**
 * 地址截取
 * @param {String} str  //地址
 * @param {String} ind  //截断位数
 */
const _substrAddress = (str, ind) => {
	if(str) {
		return str ? (str.substring(0,ind)+'...'+str.substring(str.length - ind)) : ''
	} else {
		return str
	}
}

/**
 * 精度列表
 * @param {String} coin  //币种
 */
const _getPrecision= (coin) => {
	const list = {
	  MDX: 4
	}
	return list[coin] ? list[coin] : 4
}


/**
 * 转义亿、万简写(>=千万，用亿为单位【保留两位小数】, 反之用万为单位【取整】)
 * @param {String} num    //传入数值
 * @param {String} lang   //语言
 */
const _transferNum = (num, lang) => {
	const el = Number(num)
	if (el) {
		if (['zh-CN', 'zh-HK'].includes(lang)) {
			if(el >= 10000 && el < 10000000) {
				return Number((el/10000).toFixed(2))
			} else if(el >= 10000000) {
				return Number((el/100000000).toFixed(2))
			} else {
				return parseInt(el)
			}
		} else {
			if(el >= 10000 && el < 100000000) {
				return Number((el/1000000).toFixed(2))
			}else if (el >= 100000000) {
				return Number((el/1000000000).toFixed(2))
			} else {
				return parseInt(el)
			}
		}
	} else {
		return 0
	}
}

// 根据不同语言展示不同单位
const _transferUnit = (num, lang, unitB, unitM) => {
	return num >= (['zh-CN', 'zh-HK'].includes(lang) ? 10000000 : 100000000) ? unitB : num >= 10000 ? unitM : '' 
}

/**
 * 获取APY
 * @param {String} apr      //年化
 * @param {String} weight   //权重数值如1.2 1.3
 */
const _getApy = (apr, weight) => {
	const wl = weight ? weight : 1
	if (apr) {
		return Number((Math.pow(1 + apr * wl/365/100, 365)*100 - 100).toFixed(2))
	} else {
		return 0
	}
}

/**
 * 获取banner图片KEY
 * @param {String} device    // true：PC, false: h5
 * @param {String} lang      // 语言标识
 */
const _getImgKey = (device, lang) => {
	// 临时代码
	let language = (lang == 'zh-HK' ? 'zh-CN' : lang)
	let con = 'image_'
	if (device){con += 'pc_'} else {con += 'h5_'}
	if (language === 'zh-CN'){con += 'cn'} else {con += 'en'}
	return con
}

export {
	_substrAddress,
	_transferUnit,
	_getPrecision,
	_transferNum,
  	_formatDate,
	_getImgKey,
	_numComma,
	_getApy
}
