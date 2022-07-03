export { default as formatAddress } from "./formatAddress";

function singleFormat(str) {
  return str.toString().length === 1 ? "0" + str : str;
}

/**
 *
 * @content 格式化时间
 * @param date
 * @param connector
 * * @returns {
 *   y: 年,
 *   m: 月,
 *   d: 日,
 *   ymd: 年-月-日,
 *   ym: 年-月,
 *   md: 月-日
 * }
 */
export function formatDate(date, connector = "-", hoursConnect = ":") {
  if (!date) return {};
  const now = new Date(date);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const formatMonth = month < 10 ? `0${month}` : month;
  const day = now.getDate();
  const formatDay = day < 10 ? `0${day}` : day;
  const hours = now.getHours();
  const minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  const seconds = now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
  return {
    y: year,
    m: formatMonth,
    d: day,
    ymd: `${year}${connector}${formatMonth}${connector}${formatDay}`,
    ym: `${year}${connector}${formatMonth}`,
    md: `${formatMonth}${connector}${formatDay}`,
    ymdhms: `${year}${connector}${formatMonth}${connector}${formatDay} ${hours}${hoursConnect}${minutes}${hoursConnect}${seconds}`,
  };
}

/**
 * @content 两个数相除
 * @param dividend<string | number> 相除的第一个数
 * @param divisor<string | number> 相除的第二个数
 * @returns <number>
 */
export function divide(dividend, divisor) {
  if (!dividend) return 0;
  if (!divisor) return 0;
  let dividendPointLength = 0;
  let divisorPointLength = 0;
  const dividendString = dividend.toString();
  const divisorString = divisor.toString();
  try {
    dividendPointLength = dividendString.split(".")[1].length;
  } catch (e) {}
  try {
    divisorPointLength = divisorString.split(".")[1].length;
  } catch (e) {}
  return (
    Number(dividendString.replace(".", "")) /
    Number(divisorString.replace(".", "")) /
    10 ** Math.abs(divisorPointLength - dividendPointLength)
  );
}

/**
 * @content 格式化数字小数位数,多余截取
 * @param num <number | stirng> 需要格式化的数字
 * @param fractionDigits <number> 位数
 * @returns <string>  格式化后的值
 */
export function splitFormat(num, fractionDigits = 0) {
  if (Number.isNaN(num)) return num;
  if (!num) return num;
  if (num === "0") {
    return num;
  }
  if (fractionDigits === 0) {
    return parseInt(num, 10);
  }

  // 如果有小数点
  if (num.toString().indexOf(".") > -1) {
    const digit = num.toString().split(".");
    // 如果小数点长度不足,补 0
    if (digit[1].length < fractionDigits) {
      const digitResult = "".padEnd(fractionDigits - digit[1].length, "0");
      return num + digitResult;
    }
    // 如果小数点长度多余,截取
    const digitResult = digit[1].substring(0, fractionDigits);
    return `${digit[0]}.${digitResult}`;
  }

  // 如果没有小数点,补小数点和 0
  const digitResult = ".".padEnd(fractionDigits, "0");
  return num + digitResult;
}

/**
 * @content 格式化时间戳
 * @param time <number> 时间戳
 * * @returns {
 *  s: 秒,
 *  m: 分,
 *  h: 时,
 * }
 */
export function formatSecondsToDate(time) {
  let hours = singleFormat(parseInt(time / 3600));
  let minutes = singleFormat(parseInt((time % 3600) / 60));
  let seconds = singleFormat(time % 60);
  return {
    hms: `${hours}:${minutes}:${seconds}`,
    ms: `${minutes}:${seconds}`,
    s: seconds,
    m: minutes,
    h: hours,
  };
}
export function formatSecondsToDateDay(time) {
  let hours, day;
  if (parseInt(time / 3600) > 24) {
    day = singleFormat(parseInt(time / 3600 / 24));
    const h = time / 3600 - day * 24;
    hours = singleFormat(parseInt(h));
  } else {
    hours = singleFormat(parseInt(time / 3600));
    day = 0;
  }
  let minutes = singleFormat(parseInt((time % 3600) / 60));
  let seconds = singleFormat(time % 60);
  return {
    hms: `${hours}:${minutes}:${seconds}`,
    ms: `${minutes}:${seconds}`,
    s: seconds,
    m: minutes,
    h: hours,
    d: day,
  };
}
export const API_URL = "https://gateway.mdex.one/v2";

/**
 * 截取2位数据
 * @param {Number/String} num //待处理数据
 * @param {Number} accuracy   //精度
 * @param {Bool} status 	  //是否保持原数据
 */
 export function  _sliceData(num, accuracy, status){
	if(num) {
		const size = accuracy ? accuracy : 2
		const arr = num.toString().split('.')
		if (arr.length > 1) {
			if (arr[1].length >= size) {
				let data = `${arr[0]}.${arr[1].slice(0, size)}`
				if(status) data = Number(data)
				return data
			} else {
				let lastData = arr[1]
				if(!status) {
					for(let i=0; i < size - arr[1].length; i++){
						lastData += '0'
					}
					return `${arr[0]}.${lastData}`
				} else {
					return Number(`${arr[0]}.${lastData}`)
				}
			}
		} else {
			if(!status) {
				return `${num}.00`
			} else {
				return Number(num)
			}
		}
	} else {
		return '0.00'
	}
}
export const Base_url=`https://gateway.${window.location.hostname.replace('www.', '')}/v2/`
export const Base_url_V3=`https://gateway.${window.location.hostname.replace('www.', '')}/v3/`

