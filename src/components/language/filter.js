const zh = require("./zh")
const kr = require("./kr")
const en = require("./en")
const hk = require("./hk")
const tur = require("./tur")
const jp = require("./jp")


// const getKeys = (data) => {
//   let list = []
//   for(let i in data) {
//     if (typeof(data[i]) === 'object') {
//       list.concat(Object.keys(data[i]))
//     } else {
//       list.push[i]
//     }
//   }
//   return list
// }
// const zhList = getKeys(zh)
// const enList = getKeys(en)
// const hkList = getKeys(hk)
// const turList = getKeys(tur)
// const jpList = getKeys(jp)
// const krList = getKeys(kr)

const filterKey = Object.keys(zh).filter((item) => {
  return !Object.keys(en).includes(item)
})

console.log('-----------', filterKey)
