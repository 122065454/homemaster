/**
 * 匹配质押币种信息（最外层对象key值为收益币种名称）
 * @param {String} lpAddress   //质押币种地址
 * @param {String} name        //质押币种名称
 * @param {String} pid         //用来区分质押不同币种，获得同一币种收益(不一定有用)
 * @param {String} earnedToken //收益币种名称
 */
export default {
  lock: [
    {
      lpAddress: "0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c",
      name: "MDX",
      pid: 0,
      earnedToken: "MDX",
    }
    // {
    //   lpAddress: "0x3634B5457FFcb6aC859856B985e8839b42097cC6",
    //   name: "AA",
    //   pid: 0,
    //   earnedToken: "AA",
    // }
  ]
}
