import BigNumber from 'bignumber.js';

export const numTimes = (amount, decimal=18) => {
    return new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString(10)
}

export const toBalanceNumber = (balance, decimals = 18) => {
    return balance.dividedBy(new BigNumber(10).pow(decimals));
}
export const getBalanceNumber = (balance, decimals = 18) => {
    const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals));
    return displayBalance.toNumber();
};
export const getDisplayBalance = (balance, decimals = 18) => {
    const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals));
    if (displayBalance.lt(1)) {
        return displayBalance.toPrecision(4);
    }
    else {
        return displayBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
};
export const getFullDisplayBalance = (balance, decimals = 18) => {
    return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed();
};

export const formatFloat = function(value, n ,type) {
    let f = 0
    if(type == 'round') {
        f = Math.round(value*Math.pow(10,n))/Math.pow(10,n);
    } else {
        f = Math.floor(value*Math.pow(10,n))/Math.pow(10,n);
    }
    let s = f.toString();
    if (s.indexOf('.') < 0) {     
        s += '.';   
    } 
    for(let i = s.length - s.indexOf('.'); i <= n; i++){
      s += "0";
    }
    return s;
}