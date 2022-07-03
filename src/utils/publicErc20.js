import Web3 from "web3";
import BigNumber from "bignumber.js";
import sha256 from 'crypto-js/sha256';
let web3 = null;

import ERC20ABI from "@/config/abi/erc20.json";
import DESTROYABI from "@/config/abi/destroy.json"
import JOINTABI from "@/config/abi/joint.json"
import LOCKUPABI from "@/config/abi/lockup.json"
// import oracleConfig from "@/utils/oracle.config";
import addressConfig from "@/utils/address.config";
import abiConfig from "@/utils/abi.config";

export const MaxUint256 =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export const setLocalAllowance = (tokenAddress, account, contractAddr, allowance=MaxUint256) => { // save allowance
  try {
    sessionStorage.setItem(`Allowance-${tokenAddress.slice(0, 10)}${account.slice(0, 10)}${contractAddr.slice(0, 10)}`, allowance)
  } catch (error) {
    console.log('setLocalAllowance:', error)
  }
}

export const isAddress = (address) => {
  return Web3.utils.isAddress(address)
}

export const getBlockNumber = () => {
  return web3.eth.getBlockNumber()
}

export const getBlock = (block) => {
  return web3.eth.getBlock(block)
}

export const getTransaction = (hash) => {
  return web3.eth.getTransaction(hash)
}

function CryptJsWordArrayToUint8Array(wordArray) {                                                                                       
  const l = wordArray.sigBytes;                                                                                                        
  const words = wordArray.words;                                                                                                       
  const result = new Uint8Array(l);                                                                                                    
  var i=0 /*dst*/, j=0 /*src*/;
  while(true) {
    // here i is a multiple of 4
    if (i==l)
        break;
    var w = words[j++];
    result[i++] = (w & 0xff000000) >>> 24;
    if (i==l)
        break;
    result[i++] = (w & 0x00ff0000) >>> 16;                                                                                            
    if (i==l)                                                                                                                        
        break;                                                                                                                       
    result[i++] = (w & 0x0000ff00) >>> 8;
    if (i==l)
        break;
    result[i++] = (w & 0x000000ff);                                                                                                  
  }
  return result;
}

export const digestMessage = async(message)=> {
  // const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  // const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  // const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  // const hashHex = hashArray.map(text => text.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  const cryptoText = sha256(message)
  const hashArray = Array.from(CryptJsWordArrayToUint8Array(cryptoText));   
  const hashHex = hashArray.map(text => text.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const getLocalAllowance = (tokenAddress, account, contractAddr) => { // get allowance
  return sessionStorage.getItem(`Allowance-${tokenAddress.slice(0, 10)}${account.slice(0, 10)}${contractAddr.slice(0, 10)}`)
}

export const getContract = async (address, abi, account, needAccount=false) => {
  const provider = window.ethereum || window.web3?.currentProvider;
  web3 = web3 || new Web3(provider);
  if(needAccount){
    return new web3.eth.Contract(abi, address, {from: account});
  } if(account) {
    const gasPrice = await web3.eth.getGasPrice()
    return new web3.eth.Contract(abi, address, {from: account, gasPrice})
  } else {
    return new web3.eth.Contract(abi, address);
  }
}

export const getAccount = async() => {
  const provider = window.ethereum || window.web3?.currentProvider;
  web3 = web3 || new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  return accounts;
}

export const getAllowance = async(tokenAddress, account, contractAddr) => {
  const tokenContract = await getContract(tokenAddress, ERC20ABI);
  const allowance = await tokenContract.methods
    .allowance(account, contractAddr)
    .call();
  setLocalAllowance(tokenAddress, account, contractAddr, allowance)  
  return allowance;
}

export const getBalance = async(tokenAddress, account, decimal = 18) => { // 获取用户代币余额
  const tokenContract = await getContract(tokenAddress, ERC20ABI);
  const balance = await tokenContract.methods.balanceOf(account).call();
  return new BigNumber(balance).div(new BigNumber(10).pow(decimal)).toString(10);
}
export const getBaseBalance = async(account) => {
  const balance = await web3.eth.getBalance(account)
  return new BigNumber(balance).div(new BigNumber(10).pow(18)).toString(10);
}

export const approveErc20Token = async(tokenAddress, account, contractAddr) => {
  const tokenContract = await getContract(tokenAddress, ERC20ABI, account);
  return tokenContract.methods
    .approve(contractAddr, MaxUint256)
    .send({ from: account });
}

// 判读是否安装小狐狸
export const isConnectMetaMask = () => {
  const { ethereum } = window
  if(ethereum) {
    ethereum.request({ method: 'eth_requestAccounts' })
  } else {
    console.log('!---未安装小狐狸---!')
  }
}

/**
 *
 * @param chainId 链 id
 * @param type room类型  eg: liquidity/boardroom
 * @param earn 赚取的币 eg: wht,mdx,hdmx
 */ 

export const getErc20Utils = (chainId, type, earn) => {
  // let orcalabi = oracleConfig[chainId];
  // let orcaleAddress = addressConfig[chainId].orcale;
  let airdorpAddress = addressConfig[chainId][type][earn];
  let chefAbi = abiConfig[chainId][type];
  let isCombine = false
  if(earn == 'cow') {
    chefAbi = JOINTABI
    isCombine = true
  }
  return {
    async fetchLPAllowance(tokenAddress, account) {
      const tokenContract = await getContract(tokenAddress, ERC20ABI);
      const allowance = await tokenContract.methods
        .allowance(account, airdorpAddress)
        .call();
      setLocalAllowance(tokenAddress, account, airdorpAddress, allowance)    
      return allowance;
    },
    fetchLocalAllowance(tokenAddress, account) {
      return getLocalAllowance(tokenAddress, account, airdorpAddress)
    }, 
    saveLocalAllowance(tokenAddress, account, allowance=MaxUint256) {
      setLocalAllowance(tokenAddress, account, airdorpAddress, allowance)
    },
    async getStakeValue(pid, account, decimal = 18) {
      const chefContarct = await getContract(airdorpAddress, chefAbi);
      if(isCombine) {
        const { amount } = await chefContarct.methods
        .userInfo(account)
        .call();
        return new BigNumber(amount).div(new BigNumber(10).pow(decimal));
      } else {
        const { amount } = await chefContarct.methods
        .userInfo(pid, account)
        .call();
        return new BigNumber(amount).div(new BigNumber(10).pow(decimal));
      }
    },
    async despoitValue(pid, amount, account, decimal = 18) {
      try {
        const chefContarct = await getContract(airdorpAddress, chefAbi, account);
        const num = new BigNumber(amount)
          .times(new BigNumber(10).pow(decimal))
          .toString(10);
          if(isCombine) {
            return chefContarct.methods.deposit(num).send({ from: account });
          } else {
            return chefContarct.methods.deposit(pid, num).send({ from: account });
          }
      } catch (error) {
        console.error('despoitValue', error);
      }
    },
    async approveToken(tokenAddress, account) {
      const tokenContract = await getContract(tokenAddress, ERC20ABI, account);
      return tokenContract.methods
        .approve(airdorpAddress, MaxUint256)
        .send({ from: account });
    },
    async getReward(account, pid, decimal = 18) {
      const chefContarct = await getContract(airdorpAddress, chefAbi);
      let rewadrd = 0
      if(isCombine) {
        rewadrd = await chefContarct.methods.pending(account).call();
      } else {
        rewadrd = await chefContarct.methods.pending(pid, account).call();
      }
      if(type == 'liquidity') {
        return new BigNumber(rewadrd[0]).div(new BigNumber(10).pow(decimal));
      } else {
        if(isCombine) {
          return {
            mdx: new BigNumber(rewadrd[0]).div(new BigNumber(10).pow(decimal)),
            earn: new BigNumber(rewadrd[1]).div(new BigNumber(10).pow(decimal))
          }

        } else {
          return new BigNumber(rewadrd).div(new BigNumber(10).pow(decimal));
        }
      }
    },
    async unStake(pid, amount, account, decimal = 18) {
      const chefContarct = await getContract(airdorpAddress, chefAbi, account);
      const num = new BigNumber(amount)
        .times(new BigNumber(10).pow(decimal))
        .toString(10);
        if(isCombine) {
          return chefContarct.methods.withdraw(num).send({ from: account });
        } else {
          return chefContarct.methods.withdraw(pid, num).send({ from: account });
        }
    },
    async emergencyWithdraw(pid, account) {
      const chefContarct = await getContract(airdorpAddress, chefAbi, account);
      if(isCombine) {
        return chefContarct.methods.emergencyWithdraw().send({ from: account })
      } else {
        return chefContarct.methods.emergencyWithdraw(pid).send({ from: account })
      }
    }
  };
};


export const destroyUtils = async(contractAddress, tokenDecimal, rewadrdDecimal, account) => {
  // console.log({contractAddress, tokenDecimal, rewadrdDecimal, account});
  const destroyContarct = await getContract(contractAddress, DESTROYABI);
  return {
    async claimThirdPrize() { // 领取三等奖
      return destroyContarct.methods.claimThirdPrize().send({ from: account });
    },
    async claimSecondPrize() { // 领取二等奖
      return destroyContarct.methods.claimSecondPrize().send({ from: account });
    },
    async deposit(base, amount) { // 充值
      try {
        const num = new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
        const baseNum = new BigNumber(base).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
        return destroyContarct.methods.deposit(baseNum, num).send({ from: account });
      } catch (error) {
        console.error('deposit', error);
      }
    }, 
    async getUserSecondPrize() { // 获取用的二等奖详情
      try {
        const info = await destroyContarct.methods.getUserSecondPrize(account).call();
        const amount = new BigNumber(info[0]).div(new BigNumber(10).pow(rewadrdDecimal));
        return {
          secondAmount: amount.toString(10),
          secondStatus: info[1]
        }
      } catch (error) {
        console.error('getUserSecondPrize', error);
      }
    },
    async getUserThirdPrize() { // 获取用户三等奖详情
      try {
        const info = await destroyContarct.methods.getUserThirdPrize(account).call();
        const amount = new BigNumber(info[0]).div(new BigNumber(10).pow(rewadrdDecimal));
        return {
          thirdAmount: amount.toString(10),
          thirdStatus: info[1]
        }
      } catch (error) {
        console.error('getUserThirdPrize', error);
      }
    },
    async getPhase() { // 获取当前状态, 0 未开始 ；1 进行中 ； 2 清算中
      return destroyContarct.methods.getPhase().send({ from: account });
    }
  }
}

/**
 * 锁仓操作
 * @param {String} chainId       链id
 * @param {String} earn          收益币种
 * @param {String} tokenAddress  代币地址
 * @param {String} account       钱包地址
 */ 
export const lockUpUtils = async(chainId, earn, tokenAddress, account) => {

  // 合约地址
  const contractAddress = addressConfig[chainId]['lockup'][earn.toLowerCase()];

  // 实例化合约 
  const operateContract = await getContract(contractAddress, LOCKUPABI)
  
  // 授权操作
  const _approveOperate = () => {
    return approveErc20Token(tokenAddress, account, contractAddress)
  }

  // 保存授权状态
  const _saveLocalAllowanceOperate = (allowance=MaxUint256) => {
    setLocalAllowance(tokenAddress, account, contractAddress, allowance)
  }

  // 获取授权状态
  const _getLocalAllowanceOperate = async() => {
    let allowance = getLocalAllowance(tokenAddress, account, contractAddress)
    if (!allowance || allowance == '0') {
      const tokenContract = await getContract(tokenAddress, ERC20ABI);
      allowance = await tokenContract.methods.allowance(account, contractAddress).call()
    } 
    return allowance
  }

  // 获取用户代币余额
  const _getSingleBalanceOperate = (tkAddress=tokenAddress) => {
    return getBalance(tkAddress, account)
  }

  /**
   * 入参处理(质押数量)
   * @param {String} num  数量
   */ 
  const inputTranfer = (num, decimal = 18) => {
    return new BigNumber(num).times(new BigNumber(10).pow(decimal)).toString(10)
  }

  /**
   * 出参处理(当前权总金额)
   * @param {String} num  数量
   */ 
  const outputTranfer = (num, decimal = 18) => {
    return new BigNumber(num).div(new BigNumber(10).pow(decimal)).toString(10)
  }

  /**
   * 质押操作
   * @param {String} type    权重类型: 0:活期, 1:7天
   * @param {String} amount  质押数量 
   */ 
  const _setPledgeOperate = (type, amount) => {
    try {
      const num = inputTranfer(amount)
      if(type == 0) {
        return operateContract.methods.deposit(num).send({ from: account })
      } else {
        return operateContract.methods.lock(type, num).send({ from: account })
      }
    } catch (error) {
      console.error('质押操作异常:', error)
    }
  }

  /**
   * 提取锁仓资产
   * @param {String} type    权重类型: 0:活期, 1:7天
   * @param {String} amount  质押数量 
   */ 
   const _setExtractOperate = (type, amount) => {
    console.log({amount, type})
    try {
      const num = inputTranfer(amount)
      console.log({num})
      return operateContract.methods.withdraw(num, type).send({ from: account })
    } catch (error) {
      console.error('提取锁仓资产异常:', error)
    }
  }

  /**
   * 提取所有收益
   */ 
  const _setEarnOperate = () => {
    try {
      return operateContract.methods.deposit(0).send({ from: account })
    } catch (error) {
      console.error('提取所有收益异常:', error)
    }
  }

  /**
   * 查询当前权重的质押总金额
   * @param {String} type    权重类型: 0:活期, 1:7天
   */ 
  const _getSinglePledgeAmountOperate = async(type) => {
    try {
      const pledgeNum = await operateContract.methods.userInfo(account, type).call()
      return outputTranfer(pledgeNum.userTotalAmount)
    } catch (error) {
      console.error('获取当前权重的质押总金额异常:', error)
    }
  }

  /**
   * 查询当前权重的订单列表
   * @param {String} type    权重类型: 0:活期, 1:7天
   */ 
  const _getSinglePledgeListOperate = async(type) => {
    try {
      let newList = []
      const list =  await operateContract.methods.getLockInfo(account, type).call()
      if (list && list.length) {
        for(let item of list) {
          let arr = []
          arr['amount'] = outputTranfer(item.amount)
          arr['weightAmount'] = outputTranfer(item.weightAmount)
          arr['lockupTime'] = +item.lockupTime*1000
          arr['unLockTime'] = +item.unLockTime*1000
          newList.push(arr)
        }
        return newList
      } 
      return []
    } catch (error) {
      console.error('获取当前权重的订单列表异常:', error)
    }
  }

  /**
   * 查询当前合约的币种收益
   * @param {String} type    权重类型: 0:活期, 1:7天
   */ 
  const _getSingleEarnAmountOperate = async() => {
    try {
      const earnAmount = await operateContract.methods.pending(account).call()
      return outputTranfer(earnAmount)
    } catch (error) {
      console.error('查询当前合约的币种收益异常:', error)
    }
  }

  /**
   * 查询池子单一权重质押总数(所有用户)
   * @param {String} type    权重类型: 0:活期, 1:7天
   */ 
   const _getSinglePoolAmountOperate = async(type) => {
    try {
      const poolAmount = await operateContract.methods.cycleLockAmount(type).call()
      return outputTranfer(poolAmount)
    } catch (error) {
      console.error('查询当前合约的币种收益异常:', error)
    }
  }

  /**
   * 查询用户是否具备质押某一权重资格
   * @param {String} type    权重类型: 0:活期, 1:7天
   */ 
   const _getSinglePledgeStatusOperate = (type) => {
    try {
      return operateContract.methods.canLock(account, type).call()
    } catch (error) {
      console.error('查询用户是否具备质押某一权重资格异常:', error)
    }
  }

  /**
   * 查询用户可以领取的凭证的数量
   */ 
  const _getVmdxAmountOperate = async() => { 
    try {
      const vmdxAmount = await operateContract.methods.getUserXmdxAmount(account).call()
      return outputTranfer(vmdxAmount)
    } catch (error) {
      console.error('查询用户可以领取的凭证的数量异常:', error)
    }
  }

  /**
   * 提取用户凭证
   */ 
  const _setExtractVmdxOperate = () => {
    try {
      return operateContract.methods.claimXmdx().send({ from: account })
    } catch (error) {
      console.error('提取凭证异常:', error)
    }
  }

  /**
   * 解锁用户到期锁仓金额
   * @param {String} type    权重类型: 0:活期, 1:7天
   */ 
  const _setUnlockAmountOperate = (type) => {
    try {
      return operateContract.methods.updateUserInfo([account],[type]).send({ from: account })
    } catch (error) {
      console.error('解锁用户到期锁仓金额异常:', error)
    }
  }

  /**
   *  查询已解锁不同权重数量
   */ 
  const _getUserUnlockedAmountOperate = async() => {
    try {
      const currentAmount = await operateContract.methods.getUserUnlockedAmount(account).call()
      const {cam, am} = currentAmount
      console.log('currentAmount', am)
      return  {
        0: outputTranfer(cam),
        1: outputTranfer(am[1]),
        2: outputTranfer(am[2]),
        3: outputTranfer(am[3]),
        4: outputTranfer(am[4]),
      }
    } catch (error) {
      console.error('获取用户已解锁不同权重数量异常:', error)
    }
  }

  /**
   * 解锁
   * @param {String} type       权重类型: 0:活期, 1:7天
   * @param {String} amount     提前解锁的mdx的数量
   */ 
  const _setUnlockEarlyOperate = (type, amount) => {
    const num = new BigNumber(inputTranfer(amount)).decimalPlaces(0, 1).toString(10)
    console.log({type, num})
    try {
      return operateContract.methods.unlockEarly(type, num).send({ from: account })
    } catch (error) {
      console.error('提前解锁异常:', error)
    }
  }

  return {
    _getUserUnlockedAmountOperate,
    _getSinglePledgeStatusOperate,
    _getSinglePledgeAmountOperate,
    _getSinglePoolAmountOperate,
    _getSingleEarnAmountOperate,
    _getSinglePledgeListOperate,
    _saveLocalAllowanceOperate,
    _getLocalAllowanceOperate,
    _getSingleBalanceOperate,
    _setUnlockAmountOperate,
    _setUnlockEarlyOperate,
    _setExtractVmdxOperate,
    _getVmdxAmountOperate,
    _setExtractOperate,
    _setPledgeOperate,
    _setEarnOperate,
    _approveOperate
  }
}