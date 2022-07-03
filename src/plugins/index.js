import Vue from 'vue'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '../utils/formatBalance'

// global components
import Card from '@/components/card'
import Button from '@/components/button'
import CountUp from 'vue-countup-v2'

Vue.component(Card.name, Card)
Vue.component(Button.name, Button)

CountUp.props.options.default = () => ({decimalPlaces: 2, useEasing: true, useGrouping: true})
CountUp.props.delay.default = 2
Vue.component('CountUp', CountUp)

//  model
// import modal from './modal'
// import modals from '@/modals'

// Vue.use(modal, modals)

// filter
const digitsRE = /(\d{3})(?=\d)/g
Vue.filter('currency', (v, fixed = 2) => {
  if (v instanceof BigNumber) {
    v = v.toNumber()
  }
  v = parseFloat(v)
  if (!isFinite(v) || (!v && v !== 0)) return ''
  var stringified = Math.abs(v).toFixed(fixed)
  var _int = fixed
    ? stringified.slice(0, -1 - fixed)
    : stringified
  var i = _int.length % 3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  var _float = fixed
    ? stringified.slice(-1 - fixed)
    : ''
  var sign = v < 0 ? '-' : ''
  return sign + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
})

Vue.filter('balanceNum', function (balance, fixed = 3, decimals = 0) {
  if (!(balance instanceof BigNumber)) {
    balance = new BigNumber(balance)
  }
  return Vue.filter('currency')(getBalanceNumber(balance, decimals), fixed);
})

Vue.filter('ellipsis', (v, leftCount, rightCount) => {
  if (v.length <= (leftCount + rightCount)) {
    return v
  }
  const lstr = v.substr(0, leftCount)
  const rstr = v.substr(v.length - rightCount ,v.length)
  return lstr + '...' + rstr
})
