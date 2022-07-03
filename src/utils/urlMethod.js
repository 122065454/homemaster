// token-icons 访问域名
const tokenIconsDomain = 'https://mdex.co'

// 域名
const hostname = window.location.hostname.replace('www.', '')

/**
 * 获取图标地址
 * @param {String}  la   // 语言
 * @param {String}  sk   // BSC,HECO,ETH链名称
 * @param {Boolean} tm   // 是否为移动端  true：是  false：否
 */
const _collectLink = (la, sk, tm) => {
  const setlangPram = `?lang=${la}`
  return {
    // ['Header']
    'Github': 'https://github.com/mdexSwap',
    // ['Header']
    'Medium': 'https://medium.com/@MdexOfficial',
    // ['Header']
    'Telegram': `https://t.me/${la === 'zh-CN' ? 'MixDex' : 'MdexEN'}`,
    // ['Header']
    'Twitter': 'https://twitter.com/Mdextech',
    // ['Header']
    'Discord': 'https://discord.com/invite/3TYDPktjqC',
    // 微博['Footer']
    'Weibo': 'https://weibo.com/u/7627233529',
    // MDEX生态基金申请['H5Side', 'Footer']
    'Fund': 'https://docs.google.com/forms/d/e/1FAIpQLSdn9wYhf_jI01nNORQXWgiyGSPKcVTP4fCq2cLYBxINd35vuw/viewform',
    // FAQ['H5Side', 'Footer']
    'Faq': `https://mdexdoc.gitbook.io/doc/${['zh-CN', 'zh-HK'].includes(la) ? '/v/chinese' : ''}/faq`,
    // 公告['Header', 'H5Side'， 'Footer']
    'Notice': `https://mdexdoc.gitbook.io/doc${['zh-CN', 'zh-HK'].includes(la) ? '/v/chinese' : ''}/gong-gao-1`,
    // 首页['Footer', 'Header']
    'Home': `/${setlangPram}`,
    // 兑换['Header','Footer']
    'Swap': `https://${sk === 'Heco' ? 'ht' : sk.toLowerCase()}.${hostname}/#/swap${setlangPram}`,
    // 流动性挖矿['Footer', Header]
    'Farm': `/liquidity${setlangPram}`,
    // 董事会['Footer', 'Header']
    'Boardroom': `/boardroom${setlangPram}`,
    // ['H5Side', 'Footer']
    'IMO': `https://imo.${hostname}/#/${setlangPram}`,
    // 行情 ['Header', 'Footer']
    'NewChart': `https://trade.${hostname}/#/${tm ? 'quotes' : ''}${setlangPram}`,
    // info['Header', 'Footer']
    'Chart': `https://info.${hostname}/#/${sk === 'Heco' ? 'heco' : ''}`,
    'Apply': 'https://docs.google.com/forms/d/e/1FAIpQLSem595jWpO5_A5fRj9W4-wX_3mg3ypqqNiXcC_yi-tpcbOaqA/viewform',
    'Fluidity': 'https://docs.google.com/forms/d/e/1FAIpQLSem595jWpO5_A5fRj9W4-wX_3mg3ypqqNiXcC_yi-tpcbOaqA/viewform' ,
    'Portal' : 'https://forms.gle/b6SCc4cXzn7apFhk7',
    'Liquidity': `https://${sk === 'Heco' ? 'ht' : sk.toLowerCase()}.${hostname}/#/add/HT${setlangPram}`,
    // 上币申请['H5Side', 'Footer']
    'ACText1': 'https://docs.google.com/forms/d/e/1FAIpQLSem595jWpO5_A5fRj9W4-wX_3mg3ypqqNiXcC_yi-tpcbOaqA/viewform',
    // 申请流动性激励['H5Side', 'Footer']
    'ACText2': 'https://docs.google.com/forms/d/e/1FAIpQLSem595jWpO5_A5fRj9W4-wX_3mg3ypqqNiXcC_yi-tpcbOaqA/viewform',
    // IMO申请['Footer']
    'ACText3': 'https://forms.gle/b6SCc4cXzn7apFhk7',
    // 用户使用指南['Footer']
    'Guidance': `https://mdexdoc.gitbook.io/doc${['zh-CN', 'zh-HK'].includes(la) ? '/v/chinese' : ''}/yong-hu-zhi-nan`,
    // 流动性池['Header', 'Footer']
    'Pool': `https://${sk === 'Heco' ? 'ht' : sk.toLowerCase()}.${hostname}/#/pool${setlangPram}`,
    // 交易挖矿['Footer', 'Header']
    'Trade': `/trading${setlangPram}`,
    // 矿池调整['Footer']
    'ABText2': `https://mdexcom.zendesk.com/hc/${la === 'zh-CN' ? 'zh-cn' : 'en-gb'}/sections/360012110672${la === 'en' && '-Adjustment-of-Pool'}`,
    // 跨链桥['Header', 'H5Side']
    'Bridge': `/bridge${setlangPram}`,
    // 漏洞赏金计划['Footer', 'H5Side']
    'Vulnerability': `/priceplan${setlangPram}`,
    // 回购销毁/燃烧黑洞['H5Side', 'Header']
    'Buyback': `/buyback${setlangPram}`,
    // 联系我们
    'ContactUS2':`https://mdexdoc.gitbook.io/doc/${['zh-CN', 'zh-HK'].includes(la) ? 'v/chinese/' : ''}lian-xi-wo-men`,
    // 邀请返佣['H5Side']
    'Invite': `https://${sk === 'Bsc' ? 'bsc' : 'ht'}.${hostname}/#/invite/${setlangPram}`,
    // Dao['H5Side']
    'Dao': `https://dao.${hostname}/#/${setlangPram}`,
    // 最新域名['Header']
    'Domain': `https://mdex.blog/#/${setlangPram}`,
    // 申请加入邀请计划['Footer']
    'InvitePlan': `${la === 'zh-CN' ? 'https://sourl.cn/RZcKSY' : 'https://docs.google.com/forms/d/1wSRjDMWKARB5-YiHXzniGtAWOfMIXHnofLoHlRSTC8s/edit'}`,
    // 申请成为M-angel
    'MangelApplication': 'https://forms.gle/4QKK1p7DLS6WzUx67',
    // 投票挖矿
    'VoteDig': `https://trade.${hostname}/#/vote${setlangPram}`,
    // openMeta
    'OpenMeta': `https://nft.openmeta.finance/#/${setlangPram}` 
  } 
}

/**
 * 流动性池子指定性跳转
 * @param {String} la   // 语言
 * @param {String} sk   // BSC,HECO,ETH链名称
 * @param {String} from // 兑换地址
 * @param {String} to   // 兑换地址
 */
const _pooljump = (la, sk, from, to) => {
  const setlangPram = `?lang=${la}`
  return `https://${sk === 'Bsc' ? 'bsc' : 'ht'}.${hostname}/#/add/${from}/${to}${setlangPram}`;
}

/**
 * hash查詢地址
 * @param {String} address  //地址
 * @param {String} chain    //鏈
 * @param {String} lang     //语言
 * @param {String} state    //查询类型 tk、token、address
 */
 const _hashQueryAddress= (address, chain, lang, state) => {
	let kind = state ? state : 'tx'
	return `https://${chain === 'Heco' ? 'hecoinfo' : 'bscscan'}.com/${kind}/${address}?lang=${lang === 'zh-CN' ? 'zh-CN' : 'en'}`
 }

/**
 * 行情跳转
 * @param {String}  address  //合约地址
 * @param {String}  la       // 语言
 * @param {Boolean} tm       // 是否为移动端  true：是  false：否
 */
const _toTrade = (address, la, tm) => {
  const setlangPram = `?lang=${la}`
  window.open(`https://trade.${hostname}/#/${tm ? 'transaction' : 'exchange'}/${address}${tm ? '/1' : ''}${setlangPram}`, '_self')
  // window.open(`https://trade.mdex.com/#/${tm ? 'transaction' : 'exchange'}/${address}${tm ? '/1' : ''}${setlangPram}`, '_self')
}

/**
 * 区块跳转
 * @param {Number}  block  //区块高度
 * @param {String}  chain    //鏈
 */
const _toBlock = (block, chain) => {
  window.open(`https://${chain === 'Heco' ? 'hecoinfo' : 'bscscan'}.com/block/countdown/${block}`)
}

export {
  _hashQueryAddress,
  tokenIconsDomain,
  _collectLink,
  _pooljump,
  _toTrade,
  _toBlock
}
