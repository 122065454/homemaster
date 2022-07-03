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
      lpAddress: "0x9C65AB58d8d978DB963e63f2bfB7121627e3a739",
      name: "MDX",
      pid: 0,
      earnedToken: "MDX",
    }
    // {
    //   lpAddress: "0xA8befE3A797Faf16700827877F9bE9663cC01Ce9",
    //   name: "AA",
    //   pid: 0,
    //   earnedToken: "AA",
    // }
  ]
};
