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

export const getBalance = async(tokenAddress, account, decimal = 18) => { // ????????????????????????
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

// ???????????????????????????
export const isConnectMetaMask = () => {
  const { ethereum } = window
  if(ethereum) {
    ethereum.request({ method: 'eth_requestAccounts' })
  } else {
    console.log('!---??????????????????---!')
  }
}

/**
 *
 * @param chainId ??? id
 * @param type room??????  eg: liquidity/boardroom
 * @param earn ???????????? eg: wht,mdx,hdmx
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
    async claimThirdPrize() { // ???????????????
      return destroyContarct.methods.claimThirdPrize().send({ from: account });
    },
    async claimSecondPrize() { // ???????????????
      return destroyContarct.methods.claimSecondPrize().send({ from: account });
    },
    async deposit(base, amount) { // ??????
      try {
        const num = new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
        const baseNum = new BigNumber(base).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
        return destroyContarct.methods.deposit(baseNum, num).send({ from: account });
      } catch (error) {
        console.error('deposit', error);
      }
    }, 
    async getUserSecondPrize() { // ???????????????????????????
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
    async getUserThirdPrize() { // ???????????????????????????
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
    async getPhase() { // ??????????????????, 0 ????????? ???1 ????????? ??? 2 ?????????
      return destroyContarct.methods.getPhase().send({ from: account });
    }
  }
}

/**
 * ????????????
 * @param {String} chainId       ???id
 * @param {String} earn          ????????????
 * @param {String} tokenAddress  ????????????
 * @param {String} account       ????????????
 */ 
export const lockUpUtils = async(chainId, earn, tokenAddress, account) => {

  // ????????????
  const contractAddress = addressConfig[chainId]['lockup'][earn.toLowerCase()];

  // ??????????????? 
  const operateContract = await getContract(contractAddress, LOCKUPABI)
  
  // ????????????
  const _approveOperate = () => {
    return approveErc20Token(tokenAddress, account, contractAddress)
  }

  // ??????????????????
  const _saveLocalAllowanceOperate = (allowance=MaxUint256) => {
    setLocalAllowance(tokenAddress, account, contractAddress, allowance)
  }

  // ??????????????????
  const _getLocalAllowanceOperate = async() => {
    let allowance = getLocalAllowance(tokenAddress, account, contractAddress)
    if (!allowance || allowance == '0') {
      const tokenContract = await getContract(tokenAddress, ERC20ABI);
      allowance = await tokenContract.methods.allowance(account, contractAddress).call()
    } 
    return allowance
  }

  // ????????????????????????
  const _getSingleBalanceOperate = (tkAddress=tokenAddress) => {
    return getBalance(tkAddress, account)
  }

  /**
   * ????????????(????????????)
   * @param {String} num  ??????
   */ 
  const inputTranfer = (num, decimal = 18) => {
    return new BigNumber(num).times(new BigNumber(10).pow(decimal)).toString(10)
  }

  /**
   * ????????????(??????????????????)
   * @param {String} num  ??????
   */ 
  const outputTranfer = (num, decimal = 18) => {
    return new BigNumber(num).div(new BigNumber(10).pow(decimal)).toString(10)
  }

  /**
   * ????????????
   * @param {String} type    ????????????: 0:??????, 1:7???
   * @param {String} amount  ???????????? 
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
      console.error('??????????????????:', error)
    }
  }

  /**
   * ??????????????????
   * @param {String} type    ????????????: 0:??????, 1:7???
   * @param {String} amount  ???????????? 
   */ 
   const _setExtractOperate = (type, amount) => {
    console.log({amount, type})
    try {
      const num = inputTranfer(amount)
      console.log({num})
      return operateContract.methods.withdraw(num, type).send({ from: account })
    } catch (error) {
      console.error('????????????????????????:', error)
    }
  }

  /**
   * ??????????????????
   */ 
  const _setEarnOperate = () => {
    try {
      return operateContract.methods.deposit(0).send({ from: account })
    } catch (error) {
      console.error('????????????????????????:', error)
    }
  }

  /**
   * ????????????????????????????????????
   * @param {String} type    ????????????: 0:??????, 1:7???
   */ 
  const _getSinglePledgeAmountOperate = async(type) => {
    try {
      const pledgeNum = await operateContract.methods.userInfo(account, type).call()
      return outputTranfer(pledgeNum.userTotalAmount)
    } catch (error) {
      console.error('??????????????????????????????????????????:', error)
    }
  }

  /**
   * ?????????????????????????????????
   * @param {String} type    ????????????: 0:??????, 1:7???
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
      console.error('???????????????????????????????????????:', error)
    }
  }

  /**
   * ?????????????????????????????????
   * @param {String} type    ????????????: 0:??????, 1:7???
   */ 
  const _getSingleEarnAmountOperate = async() => {
    try {
      const earnAmount = await operateContract.methods.pending(account).call()
      return outputTranfer(earnAmount)
    } catch (error) {
      console.error('???????????????????????????????????????:', error)
    }
  }

  /**
   * ????????????????????????????????????(????????????)
   * @param {String} type    ????????????: 0:??????, 1:7???
   */ 
   const _getSinglePoolAmountOperate = async(type) => {
    try {
      const poolAmount = await operateContract.methods.cycleLockAmount(type).call()
      return outputTranfer(poolAmount)
    } catch (error) {
      console.error('???????????????????????????????????????:', error)
    }
  }

  /**
   * ????????????????????????????????????????????????
   * @param {String} type    ????????????: 0:??????, 1:7???
   */ 
   const _getSinglePledgeStatusOperate = (type) => {
    try {
      return operateContract.methods.canLock(account, type).call()
    } catch (error) {
      console.error('??????????????????????????????????????????????????????:', error)
    }
  }

  /**
   * ??????????????????????????????????????????
   */ 
  const _getVmdxAmountOperate = async() => { 
    try {
      const vmdxAmount = await operateContract.methods.getUserXmdxAmount(account).call()
      return outputTranfer(vmdxAmount)
    } catch (error) {
      console.error('????????????????????????????????????????????????:', error)
    }
  }

  /**
   * ??????????????????
   */ 
  const _setExtractVmdxOperate = () => {
    try {
      return operateContract.methods.claimXmdx().send({ from: account })
    } catch (error) {
      console.error('??????????????????:', error)
    }
  }

  /**
   * ??????????????????????????????
   * @param {String} type    ????????????: 0:??????, 1:7???
   */ 
  const _setUnlockAmountOperate = (type) => {
    try {
      return operateContract.methods.updateUserInfo([account],[type]).send({ from: account })
    } catch (error) {
      console.error('????????????????????????????????????:', error)
    }
  }

  /**
   *  ?????????????????????????????????
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
      console.error('?????????????????????????????????????????????:', error)
    }
  }

  /**
   * ??????
   * @param {String} type       ????????????: 0:??????, 1:7???
   * @param {String} amount     ???????????????mdx?????????
   */ 
  const _setUnlockEarlyOperate = (type, amount) => {
    const num = new BigNumber(inputTranfer(amount)).decimalPlaces(0, 1).toString(10)
    console.log({type, num})
    try {
      return operateContract.methods.unlockEarly(type, num).send({ from: account })
    } catch (error) {
      console.error('??????????????????:', error)
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