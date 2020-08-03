import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sha256, sha224 } from 'js-sha256';


@Injectable({
    providedIn: 'root'
  })

export class CheckSellService {
  


    SellCoinWithLoss()
    {
        const keys = {
            akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
            skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
        };
        const acc = 'dilber';
        const algorithmtype = 'FLOW';

        const burl = 'https://api.binance.com';
        const headerkey = 'X-MBX-APIKEY';
        let time = 0;
        const endPointTime = 'https://api.binance.com/api/v3/time';
        const ourRequestTime = new XMLHttpRequest();

        ourRequestTime.open('GET', endPointTime, true);

        ourRequestTime.setRequestHeader(headerkey, keys.akey);

        ourRequestTime.onload = function () {
            const ourDataTime = JSON.parse(ourRequestTime.responseText);
            console.log(ourDataTime);
            time = ourDataTime.serverTime;
            console.log(time);
            const dataQueryStringAccount = 'timestamp=' + time;
            const signatureAccount = sha256.hmac(keys.skey, dataQueryStringAccount);

            const endPointAccountInfo = 'https://api.binance.com/api/v3/account';
            const urlAccountInfo = endPointAccountInfo + '?' + dataQueryStringAccount + '&signature=' + signatureAccount;
            const ourRequestAccountInfo = new XMLHttpRequest();
            ourRequestAccountInfo.open('GET', urlAccountInfo, false);
            ourRequestAccountInfo.setRequestHeader(headerkey, keys.akey);

            ourRequestAccountInfo.onload = function () {

                let myBalance = 0.00000001;
                console.log('1h myBalance : ' + myBalance);
                const accountInfo = JSON.parse(ourRequestAccountInfo.responseText);
                console.log('1h accountInfo : ');
                console.log(accountInfo);

                accountInfo.balances.forEach(element => {
                    if (!element.asset.includes('BTC')) {
                        myBalance = element.free;
                        let symbol = element.asset;
                        if (myBalance > 0) {
                            console.log('1h symbol : ' + symbol);
                            console.log(element.free);

                            const ourRequestTimeTrade = new XMLHttpRequest();

                            ourRequestTimeTrade.open('GET', endPointTime, false);
                            ourRequestTimeTrade.setRequestHeader(headerkey, keys.akey);
                            ourRequestTimeTrade.onload = function () {
                                

                                const ourDataTime = JSON.parse(ourRequestTimeTrade.responseText);
                                const timeTrade = ourDataTime.serverTime;

                                const endPointMyTrades = 'https://api.binance.com/api/v3/myTrades';
                                const dataQueryStringTrade = 'timestamp=' + timeTrade + '&symbol=' + symbol + 'BTC';
                                const signatureTrade = sha256.hmac(keys.skey, dataQueryStringTrade);
                                const urlMyTrades = endPointMyTrades + '?' + dataQueryStringTrade + '&signature=' + signatureTrade;
                                const ourRequestMyTrades = new XMLHttpRequest();

                                ourRequestMyTrades.open('GET', urlMyTrades, false);

                                ourRequestMyTrades.setRequestHeader(headerkey, keys.akey);

                                ourRequestMyTrades.onload = function () {
                                    if (ourRequestMyTrades.responseText !== '' && ourRequestMyTrades.responseText !== undefined) {
                                        setTimeout(function () { }, 1000);

                                        const myTrades = JSON.parse(ourRequestMyTrades.responseText);
                    
                                        setTimeout(function () { }, 1000);
                    
                                        const orderedMyTrades = myTrades;

                                        console.log('1h ------------orderedMyTrades starts------------');
                                        console.log(orderedMyTrades);
                                        console.log('1h ------------orderedMyTrades ends------------');

                                        const buyPrice = orderedMyTrades[myTrades.length - 1].price;
                                        const btcSymbol = orderedMyTrades[myTrades.length - 1].symbol;
                                        const quantity = myBalance;

                                        console.log('1h - buyPrice : ' + buyPrice);
                                        console.log('1h - btcSymbol : ' + btcSymbol);
                                        console.log('1h - quantity : ' + quantity);
                                        const endPointTicker = 'https://api.binance.com/api/v3/ticker/price';
                                        const ourRequestTicker = new XMLHttpRequest();

                                        const dataQueryString = '&symbol=' + btcSymbol;
                                        const urlTicker = endPointTicker + '?' + dataQueryString;


                                        ourRequestTicker.open('GET', urlTicker, false);
                                        ourRequestTicker.setRequestHeader(headerkey, keys.akey);

                                        ourRequestTicker.onload = function () {
                                            const ourDataTicker = JSON.parse(ourRequestTicker.responseText);
                                            console.log('1h ourDataTicker : ');
                                            console.log(ourDataTicker);

                                            const coinPrice = ourDataTicker.price;
                                            let hour = 0;

                                            const profit = coinPrice - buyPrice;
                                            const endPointTimeLoc = 'https://localhost:44391/api/orderhistory/get?symbol=' + btcSymbol +
                                            '&account=' + acc + '&algorithmtype=' + algorithmtype;
                                            const ourRequestTimeLoc = new XMLHttpRequest();
                                            console.log('1h endPointTimeLoc');
                                            console.log(endPointTimeLoc);
                                            ourRequestTimeLoc.open('GET', endPointTimeLoc, false);

                                            ourRequestTimeLoc.onload = function () {

                                                if (ourRequestTimeLoc.responseText !== '' && ourRequestTimeLoc.responseText !== undefined) {
                                                    const ourDataTimeLoc = JSON.parse(ourRequestTimeLoc.responseText);

                                                    hour = Number(ourDataTimeLoc.gecensaat);
                                                    const alis = buyPrice;
                                                    const flag = ourDataTimeLoc.flag;
                                                    const satis = ourDataTimeLoc.satis;
                                                    if (hour >= 24) {
                                                        let time = 0;
                                                        const endPointTime = 'https://api.binance.com/api/v3/time';
                                                        const ourRequestTime = new XMLHttpRequest();
                                                        ourRequestTime.open('GET', endPointTime, false);
                                                        ourRequestTime.setRequestHeader(headerkey, keys.akey);

                                                        ourRequestTime.onload = function () {
                                                            const ourDataTime = JSON.parse(ourRequestTime.responseText);
                                                            time = ourDataTime.serverTime;

                                                            const endPointOrder = 'https://api.binance.com/api/v3/order';
                                                            const dataQueryStringSell = 'symbol=' + btcSymbol + '&type=market&side=SELL&quantity=' + quantity
                                                            + '&timestamp=' + time;


                                                            const ourRequestSell = new XMLHttpRequest();
                                                            const signatureStringSell = sha256.hmac(keys.skey, dataQueryStringSell);

                                                            const urlSell = endPointOrder + '?' + dataQueryStringSell + '&signature=' + signatureStringSell;
                            
                                                            ourRequestSell.open('POST', urlSell, false);
                                                            ourRequestSell.setRequestHeader(headerkey, keys.akey);
                            
                            
                                                            const tempSellQuantity = quantity * coinPrice;
                                                            if (tempSellQuantity > 0.0001) {

                                                                ourRequestSell.onload = function () {
                                                                const ourDataSell = JSON.parse(ourRequestSell.responseText);
                                                                console.log('1h ourDataSell');
                                
                                                                console.log(ourDataSell);
                                                                };
                                                                ourRequestSell.send();
                                                            }
                                                        };
                                                        ourRequestTime.send();
                                                    } else {
                                                        hour = hour + 1;
                                                        const endPointSetHour = 'https://localhost:44391/api/orderhistory/SetHour'
                                                        + '?' + 'symbol=' + btcSymbol + '&gecensaat=' + hour +
                                                        '&account=' + acc + '&algorithmtype=' + algorithmtype;

                                                        const ourRequestSetHour = new XMLHttpRequest();

                                                        ourRequestSetHour.open('POST', endPointSetHour, false);
                                                        ourRequestSetHour.onload = function () {

                                                            const ourDataTimeZeroHourSave = JSON.parse(ourRequestSetHour.responseText);
                                                            console.log('1h ourDataTimeZeroHourSave');
                            
                                                            console.log(ourDataTimeZeroHourSave);
                            
                                                        };
                                                        ourRequestSetHour.send();
                                                        if (profit > 0) {
                                                            console.log('1h  profit -- girdi' + profit);
                            
                            
                                                            let temoPer10 = parseFloat(String(profit / buyPrice)).toFixed(10);
                            
                                                            const per10 = Number(temoPer10);
                            
                                                            console.log('1h per10 -- ' + per10);
                            
                                                            if (per10 >= 0.1) {
                            
                                                            /*******************************************************/
                                                            let time = 0;
                                                            const endPointTime = 'https://api.binance.com/api/v3/time';
                                                            const ourRequestTime = new XMLHttpRequest();
                            
                                                            ourRequestTime.open('GET', endPointTime, false);
                                                            ourRequestTime.setRequestHeader(headerkey, keys.akey);
                            
                            
                                                            // tslint:disable-next-line: only-arrow-function
                                                            ourRequestTime.onload = function () {
                                                                const ourDataTime = JSON.parse(ourRequestTime.responseText);
                                                                time = ourDataTime.serverTime;
                            
                                                                /****************************************************** */
                                                                const endPointOrder = 'https://api.binance.com/api/v3/order';
                            
                                                                const dataQueryStringSell = 'symbol=' + btcSymbol +
                                                                '&type=market&side=SELL&quantity=' + quantity + '&timestamp=' + time;
                            
                                                                const ourRequestSell = new XMLHttpRequest();
                            
                                                                const signatureStringSell = sha256.hmac(keys.skey, dataQueryStringSell);
                            
                            
                                                                const urlSell = endPointOrder + '?' + dataQueryStringSell + '&signature=' + signatureStringSell;
                            
                                                                ourRequestSell.open('POST', urlSell, false);
                                                                ourRequestSell.setRequestHeader(headerkey, keys.akey);
                            
                                                                const tempSellQuantity = quantity * coinPrice;
                                                                console.log('1h quantity --> ' + quantity + '***' + 'coinPrice --> '
                                                                + coinPrice + '***' + 'tempSellQuantity --> ' + tempSellQuantity);
                            
                                                                if (tempSellQuantity > 0.0001) {
                            
                                                                ourRequestSell.onload = function () {
                                                                    const ourDataSell = JSON.parse(ourRequestSell.responseText);
                                                                    console.log('1h ourDataSell');
                                                                    console.log(ourDataSell);
                            
                                                                };
                                                                ourRequestSell.send();
                            
                                                                }
                            
                            
                            
                                                                /*******************************************************/
                            
                            
                                                            };
                                                            ourRequestTime.send();
                                                            /*******************************************************/
                            
                                                            } else {
                                                            console.log('1h  profit 10 -- else blogu' + profit);
                                                            /**********************EX START************************* */
                            
                                                            /*
                                                            const tempFlag = buyPrice + (profit / 2);
                                                            console.log('1h  --> ' );
                                                            console.log('1h buyPrice --> ' + tempFlag);
                                                            console.log('1h (profit / 2) --> ' + (profit / 2));
                                                            console.log('1h profit --> ' + profit);
                                                            console.log('1h tempFlag --> ' + tempFlag);
                            
                                                            if (flag < tempFlag) {
                            
                                                                flag = tempFlag;
                            
                                                            }*/
                            
                                                            /***********************EX END************************ */
                                                            /***********************START ************************ */
                                                            const endPointklinesM = 'https://api.binance.com/api/v3/klines';
                                                            const startTime = new Date().getTime() + (-1) * 3600000; // 1 saat fark
                                                            const endTimeM = Date.now();
                            
                                                            if (!symbol.endsWith('BTC')) {
                                                                symbol = symbol + 'BTC';
                                                            }
                                                            const dataQueryStringklinesM = 'symbol=' + symbol + '&' + 'interval=' + '1h' + '&'
                                                                + 'startTime=' + startTime + '&' + 'endTime=' + endTimeM; //
                            
                                                            const urlklinesM = endPointklinesM + '?' + dataQueryStringklinesM;
                                                            const ourRequestklinesM = new XMLHttpRequest();
                            
                                                            ourRequestklinesM.open('GET', urlklinesM, false);
                                                            ourRequestklinesM.setRequestHeader(headerkey, keys.akey);
                            
                            
                                                            // tslint:disable-next-line: only-arrow-functions
                                                            ourRequestklinesM.onload = function () {
                            
                                                                const ourDataPipeDiffListM = JSON.parse(ourRequestklinesM.responseText);
                                                                console.log('1h ourDataPipeDiffListM');
                                                                console.log(ourDataPipeDiffListM);
                            
                                                                ourDataPipeDiffListM.forEach(elementPipeDiffM => {
                            
                                                                const closeDifOpenM = elementPipeDiffM[4];
                            
                                                                /*********************************SET FLAG START ******************** */
                                                                let tempFlag = closeDifOpenM + (profit / 2);
                                                                console.log('1 h  --> ');
                                                                console.log('1 h  --> open time ' + new Date(elementPipeDiffM[0]));
                                                                console.log('1 h  --> close time ' + new Date(elementPipeDiffM[6]));
                                                                console.log('1h closeDifOpenM --> ' + closeDifOpenM);
                                                                console.log('1h  (profit / 2) --> ' + (profit / 2));
                                                                console.log('1h profit --> ' + profit);
                                                                console.log('1h tempFlag --> ' + tempFlag);
                            
                                                                const tempTempFlag = parseFloat(String(tempFlag)).toFixed(10);
                            
                                                                tempFlag = Number(tempTempFlag);
                            
                                                                console.log('1h tempFlag --> ' + tempFlag);
                                                                console.log('1h flag --> ' + flag);
                                                                if (flag > tempFlag) {
                                                                    tempFlag = flag;
                                                                    // flag = tempFlag;
                                                                    console.log('1h flag > tempFlag --> ' + flag);
                            
                                                                }
                            
                            
                                                                // tslint:disable-next-line: max-line-length FlowSellCoin1h
                                                                // const endPointSetFlag = 'https://localhost:44391/api/orderhistory/Edit/' + '?' + 'symbol=' + btcSymbol + '&alis=' + buyPrice
                                                                // + '&satis=' + coinPrice + '&flag=' + flag + '&gecensaat=' + hour;
                            
                                                                const endPointSetFlag = 'https://localhost:44391/api/orderhistory/SetFlag'
                                                                    + '?' + 'symbol=' + btcSymbol + '&flag=' + tempFlag +
                                                                    '&account=' + acc + '&algorithmtype=' + algorithmtype;
                            
                            
                                                                const ourRequestSetFlag = new XMLHttpRequest();
                            
                            
                                                                console.log('1h profit > 0 ==> ' + endPointSetFlag);
                                                                ourRequestSetFlag.open('POST', endPointSetFlag, false);
                                                                // ourRequestTimeLoc.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);
                            
                                                                // tslint:disable-next-line: only-arrow-functions
                                                                ourRequestSetFlag.onload = function () {
                            
                                                                    const ourDataTimeZeroHourSave = JSON.parse(ourRequestSetFlag.responseText);
                                                                    console.log('1h ourDataTimeZeroHourSave');
                                                                    console.log(ourDataTimeZeroHourSave);
                                                                };
                                                                ourRequestSetFlag.send();
                            
                                                                /*********************************SET FLAG END ******************** */
                            
                            
                                                                });
                            
                                                            };
                                                            ourRequestklinesM.send();
                            
                                                            /***************************************************** */
                            
                                                            }
                            
                                                        } else{
                                                            const isLoss = coinPrice / buyPrice;
                                                            console.log('1h coinPrice');
                                                            console.log(coinPrice);
                                                            console.log('1h buyPrice');
                                                            console.log(buyPrice);
                                                            console.log('1h isLoss');
                                                            console.log(isLoss);
                                                            if (isLoss < 0.97) {

                                                                /*******************************************************/
                                                                let time = 0;
                                                                const endPointTime = 'https://api.binance.com/api/v3/time';
                                                                const ourRequestTime = new XMLHttpRequest();
                                
                                                                ourRequestTime.open('GET', endPointTime, false);
                                                                ourRequestTime.setRequestHeader(headerkey, keys.akey);
                                
                                                                // tslint:disable-next-line: only-arrow-function
                                                                ourRequestTime.onload = function () {
                                                                const ourDataTime = JSON.parse(ourRequestTime.responseText);
                                                                time = ourDataTime.serverTime;
                                
                                                                /****************************************************** */
                                                                const endPointOrder = 'https://api.binance.com/api/v3/order';
                                
                                                                const dataQueryStringSell = 'symbol=' + btcSymbol +
                                                                    '&type=market&side=SELL&quantity=' + quantity + '&timestamp=' + time;
                                
                                                                const ourRequestSell = new XMLHttpRequest();
                                
                                                                const signatureStringSell = sha256.hmac(keys.skey, dataQueryStringSell);
                                
                                
                                                                const urlSell = endPointOrder + '?' + dataQueryStringSell + '&signature=' + signatureStringSell;
                                
                                                                ourRequestSell.open('POST', urlSell, false);
                                                                ourRequestSell.setRequestHeader(headerkey, keys.akey);
                                
                                                                const tempSellQuantity = quantity * coinPrice;
                                                                console.log('1h quantity --> ' + quantity + '***' + 'coinPrice --> ' + coinPrice
                                                                    + '***' + 'tempSellQuantity --> ' + tempSellQuantity);
                                
                                                                if (tempSellQuantity > 0.0001) {
                                
                                                                    ourRequestSell.onload = function () {
                                                                    const ourDataSell = JSON.parse(ourRequestSell.responseText);
                                                                    console.log('1h ourDataSell');
                                                                    console.log(ourDataSell);
                                
                                                                    };
                                                                    ourRequestSell.send();
                                                                }
                                                                /*******************************************************/
                                
                                
                                                                };
                                                                ourRequestTime.send();
                                                                /*******************************************************/
                                                            }
                                                        }
                                                    }
                                                }
                                            };
                                            ourRequestTimeLoc.send();
                                        };
                                        ourRequestTicker.send();
                                    }
                            
                                };
                                ourRequestMyTrades.send();
                            };
                            ourRequestTimeTrade.send();

                        }

                }
            });

        };
        ourRequestAccountInfo.send();
    };
    ourRequestTime.send();
    }
}