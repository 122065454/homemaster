// input框输入校验
const _check_proving = (ele, index) => {
	let ind = index ? index : 18
    let status = ele?.replace(/[^\d.]/g, '')
      .replace(/^\./g, '')
      .replace(/\.{ind,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
	const decimal = status.split('.')[1]
    if (decimal && decimal.length > ind) {
      status = status.slice(0, status.length - decimal.length + ind )
	  if(status == 0) status = 0
    }
    return status
}

export {
	_check_proving
}
