import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sha256, sha224 } from 'js-sha256';
import { HelperService } from './helper.service';



@Injectable({
  providedIn: 'root'
})
export class FlowService {

  constructor(private httpClient: HttpClient, private helperService: HelperService) { }

  keys = {
    akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
    skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
  };

  askeys = {
    akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
    skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
  };

  burl = 'https://api.binance.com';


  // 24 candle 1h Akış
  FlowBuyCoin() {

    const asilkeys = {
      akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
      skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
    };

    const dilberkeys = {
      akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
      skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
    };
    const acc = 'dilber';
    const algorithmtype = 'FLOW';

    /******************************************account START********************************************************************** */

    let time = 0;
    const endPointTime = 'https://api.binance.com/api/v3/time';
    const ourRequestTime = new XMLHttpRequest();

    ourRequestTime.open('GET', endPointTime, false);
    // tslint:disable-next-line: max-line-length
    ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


    // tslint:disable-next-line: only-arrow-functions
    ourRequestTime.onload = function () {

      // let geciciDeger = 100000000;
      const ourDataTime = JSON.parse(ourRequestTime.responseText);
      time = ourDataTime.serverTime;

      const dataQueryStringAccount = 'timestamp=' + time;

      // tslint:disable-next-line: max-line-length
      const signatureAccount = sha256.hmac(asilkeys.skey, dataQueryStringAccount);

      const endPointAccountInfo = 'https://api.binance.com/api/v3/account';
      const urlAccountInfo = endPointAccountInfo + '?' + dataQueryStringAccount + '&signature=' + signatureAccount;
      const ourRequestAccountInfo = new XMLHttpRequest();

      ourRequestAccountInfo.open('GET', urlAccountInfo, false);
      ourRequestAccountInfo.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

      // tslint:disable-next-line: only-arrow-functions
      ourRequestAccountInfo.onload = function () {
        let myBalance = 0.00000001;
        console.log('myBalance : ' + myBalance);
        const accountInfo = JSON.parse(ourRequestAccountInfo.responseText);
        console.log('accountInfo : ');
        console.log(accountInfo);

        const accountBalance = [];
        accountInfo.balances.forEach(element => {

          if (element.free > 0) {
            accountBalance.push(element);
          }

        });
        console.log('accountBalance');
        console.log(accountBalance);
        accountBalance.forEach(element => {
          if (element.asset.includes('BTC')) {
            console.log(element.free);
            myBalance = element.free;
          }
        });


        /************************* */

        // element.asset.includes('BTC') &&

        if (myBalance > 0.0001) {


          let latestBalance = myBalance;
          let myBalance25per = myBalance / 4;
          console.log('myBalance25per : ');
          console.log(myBalance25per);

          if (myBalance25per > 0.0001025) {

            for (let index = 0; index < 1; index++) {

              console.log('index : ' + index);


              latestBalance = latestBalance - myBalance25per;

              if (myBalance25per > latestBalance) {
                myBalance25per = latestBalance;
              }

              // tslint:disable-next-line: max-line-length
              /******************************************ourRequest24hr START********************************************************************** */


              const endPoint24hr = 'https://api.binance.com/api/v3/ticker/24hr';
              const ourRequest24hr = new XMLHttpRequest();

              ourRequest24hr.open('GET', endPoint24hr, false);
              ourRequest24hr.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

              // tslint:disable-next-line: only-arrow-functions
              ourRequest24hr.onload = function () {


                const ourData24hr = JSON.parse(ourRequest24hr.responseText);
                // console.log(ourData24hr);


                const orderedList24hr = ourData24hr.sort((a, b) => Number(b.priceChangePercent) - Number(a.priceChangePercent));
                console.log('orderedList24hr : ');
                console.log(orderedList24hr);
                let ii = 0;
                orderedList24hr.forEach(element24hr => {


                  let symbol = element24hr.symbol;
                  if (symbol.endsWith('BTC')) {
                    if (element24hr.priceChangePercent > 0) {
                      let subSymbol = symbol;
                      subSymbol = subSymbol.replace('BTC', '');

                      if ((!accountBalance.some(e => e.asset === subSymbol))) {

                        console.log('-----------element.asset -----------');
                        console.log(subSymbol);
                        console.log('-----------element24hr.symbol-----------');
                        console.log(symbol);



                        // if (element24hr.symbol.includes('BTC')) {


                        ii++;
                        // if (ii < 6) {
                        /************************************ ourRequestklines START ********************************************* */

                        const endPointklines = 'https://api.binance.com/api/v3/klines';

                        //  const startTime = new Date().getTime() + (-2) * 3600000; // 2 saat fark
                        //  const endTime = Date.now();

                        // console.log('c' + ii + 'COIN : ' + symbol);

                        const getFullYear = new Date().getFullYear();
                        const getMonth = new Date().getMonth();
                        const getDay = new Date().getDate();
                        const getHours = new Date().getHours();



                        const startTime = new Date(getFullYear, getMonth, getDay, getHours - 2, 0, 0, 0).getTime();
                        const endTime = new Date(getFullYear, getMonth, getDay, getHours, 15, 0, 0).getTime();

                        // console.log('startTime : ' + new Date(getFullYear, getMonth, getDay, getHours - 2, 0, 0, 0)
                        //   + 'endTime : ' + new Date(getFullYear, getMonth, getDay, getHours, 15, 0, 0));

                        console.log('c' + ii + 'COIN : ' + symbol
                          + '  startTime : ' + new Date(startTime) + 'endTime : ' + new Date(endTime));

                        if (!symbol.endsWith('BTC')) {
                          symbol = symbol + 'BTC';
                        }
                        const dataQueryStringklines = 'symbol=' + symbol + '&' + 'interval=' + '1h'
                          + '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime; //

                        const urlklines = endPointklines + '?' + dataQueryStringklines;
                        const ourRequestklines = new XMLHttpRequest();

                        ourRequestklines.open('GET', urlklines, false);
                        ourRequestklines.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                        // tslint:disable-next-line: only-arrow-functions
                        ourRequestklines.onload = function () {

                          const ourDataPipeDiffList = JSON.parse(ourRequestklines.responseText);

                          let closeDifOpen = 0;
                          let highDifLow = 0;

                          const tempklines3hr = [];

                          ourDataPipeDiffList.forEach(elementPipeDiff => {

                            closeDifOpen = Math.abs(elementPipeDiff[4] - elementPipeDiff[1]);
                            highDifLow = Math.abs(elementPipeDiff[2] - elementPipeDiff[3]);


                            let isIncreasing = elementPipeDiff[4] - elementPipeDiff[1];

                            if (isIncreasing > 0) {
                              isIncreasing = 1;
                            } else if (isIncreasing < 0) {
                              isIncreasing = -1;

                            }


                            const modelklines3hr = {
                              isSpec: closeDifOpen - highDifLow,
                              diff: isIncreasing, // (elementPipeDiff[4] - elementPipeDiff[1]) > 0 ? 1 : -1,
                              openPrice: elementPipeDiff[1],
                              closePrice: elementPipeDiff[4],
                              closeDivOpen: elementPipeDiff[4] / elementPipeDiff[1] > 1.009 ? 1 : -1,
                              openTimeEpoch: elementPipeDiff[0],
                              openTime: new Date(elementPipeDiff[0]).toLocaleString(),
                              closeTime: new Date(elementPipeDiff[6]).toLocaleString(),
                            };


                            const startTimeAdd1h = startTime + 3600000;

                            //    console.log('openTimeEpoch - ' + modelklines3hr.openTimeEpoch
                            //     + ' -startTimeM- ' + startTime + ' -startTimeAdd1h- ' + startTimeAdd1h);


                            if (modelklines3hr.openTimeEpoch === startTime || modelklines3hr.openTimeEpoch === startTimeAdd1h) {
                              tempklines3hr.push(modelklines3hr);
                            }



                          });

                          console.log('3HR- tempklines3hr - symbol - ' + symbol);
                          console.log(tempklines3hr);

                          for (let j = 0; j < tempklines3hr.length - 1; j++) {

                            const isSpecReally = (tempklines3hr[j].isSpec !== 0) &&
                              (tempklines3hr[j + 1].isSpec !== 0);


                            if (isSpecReally) {

                              const resDiff = tempklines3hr[j].diff + tempklines3hr[j + 1].diff;
                              const resDiv = tempklines3hr[j + 1].closeDivOpen;

                              console.log(symbol + ' candle resDiff==>  ' + resDiff);
                              console.log(symbol + ' candle resDiv ==>  ' + resDiv);

                              if (resDiff === 2 && resDiv === 1) {


                                /******************************************************************* */

                                /********************* ourRequestklines 15 DK LIK START ************************/


                                const endPointklinesM = 'https://api.binance.com/api/v3/klines';

                                //  const startTimeM = new Date().getTime() + (-15) * 60000; // 15 dakikalık fark
                                // const endTimeM = Date.now();


                                const getFullYearM = new Date().getFullYear();
                                const getMonthM = new Date().getMonth();
                                const getDayM = new Date().getDate();
                                const getHoursM = new Date().getHours();
                                const startTimeM = new Date(getFullYearM, getMonthM, getDayM, getHoursM, 0, 0, 0).getTime();
                                const endTimeM = new Date(getFullYearM, getMonthM, getDayM, getHoursM, 15, 0, 0).getTime();


                                console.log('symbol ' + symbol + ' - startTime : ' + new Date(startTimeM)
                                  + ' - endTime : ' + new Date(endTimeM));

                                if (!symbol.endsWith('BTC')) {
                                  symbol = symbol + 'BTC';
                                }

                                const dataQueryStringklinesM = 'symbol=' + symbol + '&' + 'interval=' + '15m'
                                  + '&' + 'startTime=' + startTimeM
                                  + '&' + 'endTime=' + endTimeM; //


                                const urlklinesM = endPointklinesM + '?' + dataQueryStringklinesM;
                                const ourRequestklinesM = new XMLHttpRequest();


                                ourRequestklinesM.open('GET', urlklinesM, false);
                                ourRequestklinesM.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                const tempklines15M = [];


                                // tslint:disable-next-line: only-arrow-functions
                                ourRequestklinesM.onload = function () {

                                  const ourDataPipeDiffListM = JSON.parse(ourRequestklinesM.responseText);

                                  console.log(ourDataPipeDiffListM);

                                  ourDataPipeDiffListM.forEach(elementPipeDiffM => {

                                    const closeDifOpenM = Math.abs(elementPipeDiffM[4] - elementPipeDiffM[1]);
                                    const highDifLowM = Math.abs(elementPipeDiffM[2] - elementPipeDiffM[3]);


                                    let isIncreasing15 = elementPipeDiffM[4] - elementPipeDiffM[1];

                                    if (isIncreasing15 > 0) {
                                      isIncreasing15 = 1;
                                    } else if (isIncreasing15 < 0) {
                                      isIncreasing15 = -1;

                                    }


                                    const modelklines15M = {
                                      openTimeEpoch: elementPipeDiffM[0],
                                      openTime: new Date(elementPipeDiffM[0]).toLocaleString(),
                                      closeTime: new Date(elementPipeDiffM[6]).toLocaleString(),
                                      isSpec: closeDifOpenM - highDifLowM,
                                      diff: isIncreasing15,
                                      openPrice: elementPipeDiffM[1],
                                      closePrice: elementPipeDiffM[4]
                                    };
                                    //  console.log('openTimeEpoch - ' + modelklines15M.openTimeEpoch + ' -startTimeM- ' + startTimeM);
                                    if (modelklines15M.openTimeEpoch === startTimeM) {
                                      tempklines15M.push(modelklines15M);
                                    }



                                  });

                                  console.log('tempklines15M - ');
                                  console.log(tempklines15M);

                                  const MUpDiff = tempklines15M[0].diff;
                                  if (MUpDiff > 0) {

                                    /******************************************************************* */

                                    // Anlık price listesi

                                    const endPointTicker = 'https://api.binance.com/api/v3/ticker/price';
                                    const ourRequestTicker = new XMLHttpRequest();


                                    const dataQueryString = '&symbol=' + symbol;
                                    const urlTicker = endPointTicker + '?' + dataQueryString;

                                    ourRequestTicker.open('GET', urlTicker, false);
                                    ourRequestTicker.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                    // tslint:disable-next-line: only-arrow-functions
                                    ourRequestTicker.onload = function () {

                                      let buyQuantity = 0;

                                      const ourDataTicker = JSON.parse(ourRequestTicker.responseText);
                                      console.log('ourDataTicker : ');
                                      console.log(ourDataTicker);
                                      const coinPrice = ourDataTicker.price;

                                      const tempQuantity = myBalance25per / coinPrice;

                                      const quantity = Math.floor(tempQuantity);
                                      console.log('tempQuantity : ' + tempQuantity);

                                      /************************************** */


                                      let timeBuy = 0;
                                      const endPointTime = 'https://api.binance.com/api/v3/time';
                                      const ourRequestTimeBuy = new XMLHttpRequest();

                                      ourRequestTimeBuy.open('GET', endPointTime, false);
                                      // tslint:disable-next-line: max-line-length
                                      ourRequestTimeBuy.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                      // tslint:disable-next-line: only-arrow-functions
                                      ourRequestTimeBuy.onload = function () {

                                        // let geciciDeger = 100000000;
                                        const ourDataTime = JSON.parse(ourRequestTimeBuy.responseText);
                                        timeBuy = ourDataTime.serverTime;

                                        const endPointBuy = 'https://api.binance.com/api/v3/order';

                                        const dataQueryStringBuy = 'symbol=' + symbol + '&type=market&side=buy&quantity='
                                          + quantity + '&timestamp=' + timeBuy;

                                        // tslint:disable-next-line: max-line-length
                                        const signatureBuy = sha256.hmac(asilkeys.skey, dataQueryStringBuy);

                                        const ourRequestBuy = new XMLHttpRequest();

                                        const urlBuy = endPointBuy + '?' + dataQueryStringBuy + '&signature=' + signatureBuy;


                                        const tempBuyQuantity = quantity * coinPrice;
                                        buyQuantity = tempBuyQuantity;
                                        console.log('1H BUY , quantity --> ' + quantity + '-***-' + 'coinPrice --> '
                                          + coinPrice + '-***-' + 'tempBuyQuantity --> ' + tempBuyQuantity);

                                        if (tempBuyQuantity > 0.0001) {
                                          if (quantity > 0) {

                                            ourRequestBuy.open('post', urlBuy, false);
                                            ourRequestBuy.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                                            // // tslint:disable-next-line: only-arrow-functions
                                            ourRequestBuy.onload = function () {
                                              const ourdatabuy = JSON.parse(ourRequestBuy.responseText);
                                              console.log('ourdatabuy : ');
                                              console.log(ourdatabuy);
                                            };
                                            ourRequestBuy.send();

                                          }
                                        }

                                      };
                                      ourRequestTimeBuy.send();


                                      /************************************** */
                                      if (buyQuantity > 0.0001) {

                                        const endPointTimeLocDel = 'https://localhost:44391/api/orderhistory/delete?symbol=' + symbol +
                                          '&account=' + acc + '&algorithmtype=' + algorithmtype;

                                        const ourRequestTimeLocDel = new XMLHttpRequest();

                                        ourRequestTimeLocDel.open('POST', endPointTimeLocDel, false);

                                        ourRequestTimeLocDel.onload = function () {
                                          console.log('ourRequestTimeLocDel');
                                          console.log(ourRequestTimeLocDel.responseText);

                                          const endPointTimeLoc = 'https://localhost:44391/api/orderhistory/create?symbol=' + symbol +
                                            '&alis=' + coinPrice + '&satis=' + coinPrice + '&flag=' + (coinPrice * 97 / 100) +
                                            '&gecensaat=0' + '&auditdate=' + new Date().toLocaleString() +
                                            '&account=' + acc + '&algorithmtype=' + algorithmtype;
                                          const ourRequestTimeLoc = new XMLHttpRequest();

                                          ourRequestTimeLoc.open('POST', endPointTimeLoc, false);

                                          ourRequestTimeLoc.onload = function () {
                                            console.log('ourRequestTimeLoc');

                                            const ourDataTimeLoc = JSON.parse(ourRequestTimeLoc.responseText);
                                            console.log(ourDataTimeLoc);


                                          };
                                          ourRequestTimeLoc.send();



                                        };
                                        ourRequestTimeLocDel.send();

                                      }

                                    };
                                    ourRequestTicker.send();

                                  }


                                };

                                ourRequestklinesM.send();


                              }

                            }



                          }

                        };
                        ourRequestklines.send();


                        /************************************ ourRequestklines END ********************************************* */
                        // }
                      }


                    }
                  }

                });



              };
              ourRequest24hr.send();

              /******************************************ourRequest24hr END************************************************** */

            }


          }


        }

        /******************************************account END********************************************************************** */


        ///// end if BTC Balance }
        ////  });

      };
      ourRequestAccountInfo.send();
      /******************************************time END********************************************************************** */
    };

    ourRequestTime.send();

  }


  // FLAG = 0;


  // ıştan 1 saat sonra çışıcak
  FlowSellCoin1h() {


    const asilkeys = {
      akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
      skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
    };

    const dilberkeys = {
      akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
      skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
    };

    const acc = 'dilber';
    const algorithmtype = 'FLOW';

    /******************************************************************** */
    let time = 0;
    const endPointTime = 'https://api.binance.com/api/v3/time';
    const ourRequestTime = new XMLHttpRequest();

    ourRequestTime.open('GET', endPointTime, false);
    ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


    // tslint:disable-next-line: only-arrow-functions
    ourRequestTime.onload = function () {

      const ourDataTime = JSON.parse(ourRequestTime.responseText);
      time = ourDataTime.serverTime;

      const dataQueryStringAccount = 'timestamp=' + time;

      const signatureAccount = sha256.hmac(asilkeys.skey, dataQueryStringAccount);

      const endPointAccountInfo = 'https://api.binance.com/api/v3/account';
      const urlAccountInfo = endPointAccountInfo + '?' + dataQueryStringAccount + '&signature=' + signatureAccount;
      const ourRequestAccountInfo = new XMLHttpRequest();

      ourRequestAccountInfo.open('GET', urlAccountInfo, false);
      ourRequestAccountInfo.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

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

            // GET /api/v3/myTrades  (HMAC SHA256)  // İşlemlerim

            if (myBalance > 0) {
              console.log('1h symbol : ' + symbol);
              console.log(element.free);

              const ourRequestTimeTrade = new XMLHttpRequest();

              ourRequestTimeTrade.open('GET', endPointTime, false);
              ourRequestTimeTrade.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


              // tslint:disable-next-line: only-arrow-functions
              ourRequestTimeTrade.onload = function () {

                const ourDataTime = JSON.parse(ourRequestTimeTrade.responseText);
                const timeTrade = ourDataTime.serverTime;


                const endPointMyTrades = 'https://api.binance.com/api/v3/myTrades';
                const dataQueryStringTrade = 'timestamp=' + timeTrade + '&symbol=' + symbol + 'BTC';
                const signatureTrade = sha256.hmac(asilkeys.skey, dataQueryStringTrade);
                const urlMyTrades = endPointMyTrades + '?' + dataQueryStringTrade + '&signature=' + signatureTrade;
                const ourRequestMyTrades = new XMLHttpRequest();

                ourRequestMyTrades.open('GET', urlMyTrades, false);
                ourRequestMyTrades.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                ourRequestMyTrades.onload = function () {

                  if (ourRequestMyTrades.responseText !== '' && ourRequestMyTrades.responseText !== undefined) {

                    setTimeout(function () { }, 1000);

                    const myTrades = JSON.parse(ourRequestMyTrades.responseText);

                    setTimeout(function () { }, 1000);

                    const orderedMyTrades = myTrades;
                    // if (myTrades.length > 1) {

                    // orderedMyTrades = myTrades.sort(function (a, b) { return a.time < b.time; });
                    //  orderedMyTrades = myTrades.slice(0).sort((a, b) => b.time - a.time);
                    // }



                    console.log('1h ------------orderedMyTrades starts------------');
                    console.log(orderedMyTrades);
                    console.log('1h ------------orderedMyTrades ends------------');
                    // orderedMyTrades.balances.forEach(element => {

                    // ış Fiyatı
                    const buyPrice = orderedMyTrades[myTrades.length - 1].price;
                    const btcSymbol = orderedMyTrades[myTrades.length - 1].symbol;
                    const quantity = myBalance;

                    console.log('1h - buyPrice : ' + buyPrice);
                    console.log('1h - btcSymbol : ' + btcSymbol);
                    console.log('1h - quantity : ' + quantity);
                    // Fiyatını sorgula

                    const endPointTicker = 'https://api.binance.com/api/v3/ticker/price';
                    const ourRequestTicker = new XMLHttpRequest();


                    const dataQueryString = '&symbol=' + btcSymbol;
                    const urlTicker = endPointTicker + '?' + dataQueryString;

                    ourRequestTicker.open('GET', urlTicker, false);
                    ourRequestTicker.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                    // tslint:disable-next-line: only-arrow-functions
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
                      // ourRequestTimeLoc.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                      // tslint:disable-next-line: only-arrow-functions
                      ourRequestTimeLoc.onload = function () {

                        if (ourRequestTimeLoc.responseText !== '' && ourRequestTimeLoc.responseText !== undefined) {

                          const ourDataTimeLoc = JSON.parse(ourRequestTimeLoc.responseText);


                          console.log('1h ourRequestTimeLoc');
                          console.log(ourDataTimeLoc);

                          hour = Number(ourDataTimeLoc.gecensaat);
                          const alis = buyPrice;
                          const flag = ourDataTimeLoc.flag;
                          const satis = ourDataTimeLoc.satis;

                          if (hour >= 24) {

                            // if (profit < 0) {


                            let time = 0;
                            const endPointTime = 'https://api.binance.com/api/v3/time';
                            const ourRequestTime = new XMLHttpRequest();

                            ourRequestTime.open('GET', endPointTime, false);
                            ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                            // tslint:disable-next-line: only-arrow-functions
                            ourRequestTime.onload = function () {
                              const ourDataTime = JSON.parse(ourRequestTime.responseText);
                              time = ourDataTime.serverTime;




                              /***************** */
                              /****************************************************** */

                              const endPointOrder = 'https://api.binance.com/api/v3/order';

                              const dataQueryStringSell = 'symbol=' + btcSymbol + '&type=market&side=SELL&quantity=' + quantity
                                + '&timestamp=' + time;

                              const ourRequestSell = new XMLHttpRequest();

                              const signatureStringSell = sha256.hmac(asilkeys.skey, dataQueryStringSell);

                              const urlSell = endPointOrder + '?' + dataQueryStringSell + '&signature=' + signatureStringSell;

                              ourRequestSell.open('POST', urlSell, false);
                              ourRequestSell.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                              const tempSellQuantity = quantity * coinPrice;

                              console.log('1H SELL , quantity --> ' + quantity + '***' + 'coinPrice --> '
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

                            // }



                            // else
                          } else {

                            hour = hour + 1;

                            /******************* endPointSetHour************************ */
                            const endPointSetHour = 'https://localhost:44391/api/orderhistory/SetHour'
                              + '?' + 'symbol=' + btcSymbol + '&gecensaat=' + hour +
                              '&account=' + acc + '&algorithmtype=' + algorithmtype;

                            const ourRequestSetHour = new XMLHttpRequest();

                            console.log('1h profit > 0 ==> ' + endPointSetHour);
                            ourRequestSetHour.open('POST', endPointSetHour, false);
                            // ourRequestTimeLoc.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                            // tslint:disable-next-line: only-arrow-functions
                            ourRequestSetHour.onload = function () {

                              const ourDataTimeZeroHourSave = JSON.parse(ourRequestSetHour.responseText);
                              console.log('1h ourDataTimeZeroHourSave');

                              console.log(ourDataTimeZeroHourSave);

                            };
                            ourRequestSetHour.send();

                            /******************* endPointSetHour ************************ */


                            console.log('1h  profit -- ' + profit);
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
                                ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                // tslint:disable-next-line: only-arrow-function
                                ourRequestTime.onload = function () {
                                  const ourDataTime = JSON.parse(ourRequestTime.responseText);
                                  time = ourDataTime.serverTime;

                                  /****************************************************** */
                                  const endPointOrder = 'https://api.binance.com/api/v3/order';

                                  const dataQueryStringSell = 'symbol=' + btcSymbol +
                                    '&type=market&side=SELL&quantity=' + quantity + '&timestamp=' + time;

                                  const ourRequestSell = new XMLHttpRequest();

                                  const signatureStringSell = sha256.hmac(asilkeys.skey, dataQueryStringSell);


                                  const urlSell = endPointOrder + '?' + dataQueryStringSell + '&signature=' + signatureStringSell;

                                  ourRequestSell.open('POST', urlSell, false);
                                  ourRequestSell.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

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
                                ourRequestklinesM.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


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

                            } else {

                              // ZARAR

                              /***
                               // FlowSellCoin1h
                               const endPointSetFlag = 'https://localhost:44391/api/orderhistory/Edit/' + '?' + 'symbol=' + symbol +
                                 '&alis=' + buyPrice + '&satis=' + coinPrice + '&flag=' + flag + '&gecensaat=' + hour;

                               const ourRequestSetFlag = new XMLHttpRequest();

                               ourRequestSetFlag.open('POST', endPointSetFlag, false);
                               // tslint:disable-next-line: only-arrow-functions
                               ourRequestSetFlag.onload = function () {

                                 const ourDataTimeZeroHourSave = JSON.parse(ourRequestSetFlag.responseText);
                                 console.log('1h ourDataTimeZeroHourSave');
                                 console.log(ourDataTimeZeroHourSave);

                               };
                               ourRequestSetFlag.send();
                               **/

                              /*************************/

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
                                ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                                // tslint:disable-next-line: only-arrow-function
                                ourRequestTime.onload = function () {
                                  const ourDataTime = JSON.parse(ourRequestTime.responseText);
                                  time = ourDataTime.serverTime;

                                  /****************************************************** */
                                  const endPointOrder = 'https://api.binance.com/api/v3/order';

                                  const dataQueryStringSell = 'symbol=' + btcSymbol +
                                    '&type=market&side=SELL&quantity=' + quantity + '&timestamp=' + time;

                                  const ourRequestSell = new XMLHttpRequest();

                                  const signatureStringSell = sha256.hmac(asilkeys.skey, dataQueryStringSell);


                                  const urlSell = endPointOrder + '?' + dataQueryStringSell + '&signature=' + signatureStringSell;

                                  ourRequestSell.open('POST', urlSell, false);
                                  ourRequestSell.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

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






                              /*************************/






                            }

                          }

                        }

                      };
                      ourRequestTimeLoc.send();



                    };
                    ourRequestTicker.send();

                    // });
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
  /*********************************************************** */

  // //Satıştan 1 dk sonra
  FlowSellCoin1m() {

    const asilkeys = {
      akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
      skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
    };

    const dilberkeys = {
      akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
      skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
    };

    const acc = 'dilber';
    const algorithmtype = 'FLOW';

    /******************************************************************** */
    let time = 0;
    const endPointTime = 'https://api.binance.com/api/v3/time';
    const ourRequestTime = new XMLHttpRequest();

    ourRequestTime.open('GET', endPointTime, false);
    ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


    ourRequestTime.onload = function () {

      // console.log('1m ourRequestTime');

      const ourDataTime = JSON.parse(ourRequestTime.responseText);
      time = ourDataTime.serverTime;

      const dataQueryStringAccount = 'timestamp=' + time;

      const signatureAccount = sha256.hmac(asilkeys.skey, dataQueryStringAccount);

      const endPointAccountInfo = 'https://api.binance.com/api/v3/account';
      const urlAccountInfo = endPointAccountInfo + '?' + dataQueryStringAccount + '&signature=' + signatureAccount;
      const ourRequestAccountInfo = new XMLHttpRequest();

      ourRequestAccountInfo.open('GET', urlAccountInfo, false);
      ourRequestAccountInfo.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

      ourRequestAccountInfo.onload = function () {
        let myBalance = 0.00000001;
        // console.log('1m myBalance : ' + myBalance);
        const accountInfo = JSON.parse(ourRequestAccountInfo.responseText);
        // console.log('1m accountInfo : ');
        // console.log(accountInfo);

        const accountBalance = [];
        accountInfo.balances.forEach(element => {

          if (element.free > 0) {
            accountBalance.push(element);
          }

        });
        console.log('1m accountBalance');
        console.log(accountBalance);


        accountBalance.forEach(element => {
          if (!element.asset.includes('BTC')) {

            myBalance = element.free;

            let symbol = element.asset;


            if (myBalance > 0) {
              console.log(' --------------------------------------------------------------- ');
              console.log('1m symbol : ' + symbol + '  1m element.free  ' + element.free);
              // GET /api/v3/myTrades  (HMAC SHA256)  // İşlemlerim
              let timeTrade = 0;

              const ourRequestTimeTrades = new XMLHttpRequest();

              ourRequestTimeTrades.open('GET', endPointTime, false);
              ourRequestTimeTrades.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


              ourRequestTimeTrades.onload = function () {

                // console.log('1m ourRequestTimeTrades');

                const ourDataTime = JSON.parse(ourRequestTimeTrades.responseText);
                timeTrade = ourDataTime.serverTime;

                const endPointMyTrades = 'https://api.binance.com/api/v3/myTrades';

                const dataQueryStringTrade = 'timestamp=' + timeTrade + '&symbol=' + symbol + 'BTC';
                const signatureTrade = sha256.hmac(asilkeys.skey, dataQueryStringTrade);
                const urlMyTrades = endPointMyTrades + '?' + dataQueryStringTrade + '&signature=' + signatureTrade;
                const ourRequestMyTrades = new XMLHttpRequest();


                ourRequestMyTrades.open('GET', urlMyTrades, false);
                ourRequestMyTrades.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                ourRequestMyTrades.onload = function () {
                  if (ourRequestMyTrades.responseText !== '' && ourRequestMyTrades.responseText !== undefined) {
                    setTimeout(function () { }, 1000);
                    const myTrades = JSON.parse(ourRequestMyTrades.responseText);

                    if (myTrades.length > 0) {

                      const orderedMyTrades = myTrades;
                      /*
                                            if (myTrades.length > 1) {

                                              console.log('ordering');

                                              orderedMyTrades = myTrades.sort(function (a, b) {
                                                console.log('a.time' + a.time);
                                                console.log('b.time' + b.time);


                                                return a.time > b.time;
                                              });

                                            }*/

                      console.log('1m orderedMyTrades');
                      console.log(orderedMyTrades);

                      // // orderedMyTrades.forEach(element => {

                      // orderedMyTrades.forEach(element => {

                      // ış Fiyatı
                      const buyPrice = orderedMyTrades[myTrades.length - 1].price;
                      const btcSymbol = orderedMyTrades[myTrades.length - 1].symbol;
                      const quantity = myBalance;
                      console.log('1m buyPrice = ' + buyPrice);
                      console.log('1m btcSymbol = ' + btcSymbol);
                      console.log('1m quantity = ' + quantity);
                      // Fiyatını sorgula

                      const endPointTicker = 'https://api.binance.com/api/v3/ticker/price';
                      const ourRequestTicker = new XMLHttpRequest();


                      const dataQueryString = '&symbol=' + btcSymbol;
                      const urlTicker = endPointTicker + '?' + dataQueryString;

                      ourRequestTicker.open('GET', urlTicker, false);
                      ourRequestTicker.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                      // tslint:disable-next-line: only-arrow-functions
                      ourRequestTicker.onload = function () {
                        const ourDataTicker = JSON.parse(ourRequestTicker.responseText);
                        console.log('1m ourDataTicker : ');
                        console.log(ourDataTicker);
                        const coinPrice = ourDataTicker.price;

                        const profit = coinPrice - buyPrice;
                        console.log('1m profit = ' + profit);
                        // if (profit > 0) {


                        // const sellResult = coinPrice + profit;
                        let hour = 0;

                        const endPointTimeLoc = 'https://localhost:44391/api/orderhistory/get?symbol=' +   btcSymbol+
                        '&account=' + acc + '&algorithmtype=' + algorithmtype;
                        const ourRequestTimeLoc = new XMLHttpRequest();

                        ourRequestTimeLoc.open('GET', endPointTimeLoc, false);
                        // tslint:disable-next-line: only-arrow-functions
                        ourRequestTimeLoc.onload = function () {

                          if (ourRequestTimeLoc.responseText !== '' && ourRequestTimeLoc.responseText !== undefined) {

                            const ourDataTimeLoc = JSON.parse(ourRequestTimeLoc.responseText);
                            console.log('1m ourDataTimeLoc');
                            console.log(ourDataTimeLoc);
                            hour = Number(ourDataTimeLoc.gecensaat);
                            const alis = buyPrice;
                            const flag = ourDataTimeLoc.flag;
                            const satis = ourDataTimeLoc.satis;

                            /********************************* */

                            const timeTrade = myTrades[myTrades.length - 1].time;
                            const endTime = Date.now();
                            const startTime = new Date().getTime() + (-1) * 3600000; // 1 saat fark
                            // const timePast = (endTime - timeTrade);
                            console.log('1m timeTrade > ' + timeTrade + ' == ' + new Date(timeTrade));
                            console.log('1m endTime > ' + endTime + ' == ' + new Date(endTime));

                            if (profit > 0) {


                              // if (timePast >= 2700000 && timePast <= 2800000) {
                              const minutes = new Date().getMinutes();
                              const timePastDateHour = new Date().getHours() - new Date(timeTrade).getHours();
                              // var timePastDateHour = new Date(timeTrade).getHours() + 1;
                              console.log('1m minutes =  ' + minutes + ' ,timePastDateHour =' + timePastDateHour);
                              if (minutes > 0 && minutes < 6 && timePastDateHour === 1) { // ALIŞ YAPTIĞIM SÜREDEN HEMEN SONRAKİ SAAT

                                console.log('1m profit > 0 timePastDateHour girdi ==> ' + timePastDateHour);

                                const endPointklines = 'https://api.binance.com/api/v3/klines';


                                if (!symbol.endsWith('BTC')) {
                                  symbol = symbol + 'BTC';
                                }
                                const dataQueryStringklines = 'symbol=' + symbol + '&' + 'interval=' + '1h' + '&' + 'startTime=' + startTime
                                  + '&' + 'endTime=' + endTime; //

                                const urlklines = endPointklines + '?' + dataQueryStringklines;
                                const ourRequestklines = new XMLHttpRequest();

                                ourRequestklines.open('GET', urlklines, false);
                                ourRequestklines.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                // tslint:disable-next-line: only-arrow-functions
                                ourRequestklines.onload = function () {

                                  const ourDataPipeDiffList = JSON.parse(ourRequestklines.responseText);
                                  console.log('1m ourDataPipeDiffList ==> ');
                                  console.log(ourDataPipeDiffList);

                                  const isIncrease = (ourDataPipeDiffList[4] - ourDataPipeDiffList[1]);
                                  console.log('1m isIncrease ==> ' + isIncrease);
                                  if (isIncrease > 0) {

                                    let tempFlag = Number((buyPrice + (profit / 2)));
                                    console.log('1m tempFlag ==> ' + tempFlag);
                                    console.log('1m buyPrice ==> ' + buyPrice);
                                    console.log('1m profit ==> ' + profit);
                                    console.log('1m profit / 2 ==> ' + profit / 2);

                                    const tempTempFlag = parseFloat(String(tempFlag)).toFixed(10);

                                    tempFlag = Number(tempTempFlag);
                                    console.log('1m tempFlag 2==> ' + tempFlag);


                                    // tslint:disable-next-line: max-line-length FlowSellCoin1m
                                    const endPointSetFlag = 'https://localhost:44391/api/orderhistory/SetFlag' + '?' + 'symbol=' + btcSymbol + '&flag=' + tempFlag+
                                    '&account=' + acc + '&algorithmtype=' + algorithmtype;
                                    const ourRequestSetFlag = new XMLHttpRequest();

                                    console.log('1m profit > 0 URL ==> ' + endPointSetFlag);
                                    ourRequestSetFlag.open('POST', endPointSetFlag, false);
                                    // ourRequestTimeLoc.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                                    // tslint:disable-next-line: only-arrow-functions
                                    ourRequestSetFlag.onload = function () {

                                      const ourDataTimeZeroHourSave = JSON.parse(ourRequestSetFlag.responseText);
                                      console.log('1m ourDataTimeZeroHourSave');
                                      console.log(ourDataTimeZeroHourSave);

                                    };
                                    ourRequestSetFlag.send();


                                  }


                                };

                                ourRequestklines.send();



                              }

                            }

                            /********************************* */
                            console.log('1m coinPrice : ' + coinPrice + ' <=> flag : ' + flag);

                            if (coinPrice <= flag) {


                              /*******************************************************/
                              let time = 0;
                              const endPointTime = 'https://api.binance.com/api/v3/time';
                              const ourRequestTime = new XMLHttpRequest();

                              ourRequestTime.open('GET', endPointTime, false);
                              ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                              // tslint:disable-next-line: only-arrow-function
                              ourRequestTime.onload = function () {
                                const ourDataTime = JSON.parse(ourRequestTime.responseText);
                                time = ourDataTime.serverTime;

                                /****************************************************** */
                                const endPointOrder = 'https://api.binance.com/api/v3/order';

                                const dataQueryStringSell = 'symbol=' + btcSymbol + '&type=market&side=SELL&quantity='
                                  + quantity + '&timestamp=' + time;

                                const ourRequestSell = new XMLHttpRequest();

                                const signatureStringSell = sha256.hmac(asilkeys.skey, dataQueryStringSell);


                                const urlSell = endPointOrder + '?' + dataQueryStringSell + '&signature=' + signatureStringSell;

                                ourRequestSell.open('POST', urlSell, false);
                                ourRequestSell.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                const tempSellQuantity = quantity * coinPrice;
                                console.log(' 1m quantity --> ' + quantity + ' *** ' + ' coinPrice --> ' + coinPrice
                                  + ' *** ' + ' tempSellQuantity --> ' + tempSellQuantity);

                                if (tempSellQuantity > 0.0001) {


                                  ourRequestSell.onload = function () {
                                    const ourDataSell = JSON.parse(ourRequestSell.responseText);
                                    console.log('1m ourDataSell');
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

                        };
                        ourRequestTimeLoc.send();
                        // }

                      };
                      ourRequestTicker.send();

                      // });

                    }


                  }
                };
                ourRequestMyTrades.send();


              };
              ourRequestTimeTrades.send();


            }




          }
        });

      };
      ourRequestAccountInfo.send();

    };
    ourRequestTime.send();

  }
  /*********************************************************** */


}
