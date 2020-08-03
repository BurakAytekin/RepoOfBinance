import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { sha256 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})
export class MaService {

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


  MaBuyCoin() {

    const binanceUrl = 'https://api.binance.com/api/v3/';

    const asilkeys = {
      akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
      skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
    };

    const dilberkeys = {
      akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
      skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
    };

    const acc = 'asil';
    const algorithmtype = 'MA';

    // bakiye çek
    // 4 e böl
    // btc kontrolü yap // aynı coin olmasın
    // alım kontrolü ma yap
    // al


    // BAKIYE ÇEK

    let time = 0;
    const endPointTime = binanceUrl + 'time';
    const ourRequestTime = new XMLHttpRequest();

    ourRequestTime.open('GET', endPointTime, false);
    ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

    ourRequestTime.onload = function () {

      const ourDataTime = JSON.parse(ourRequestTime.responseText);
      time = ourDataTime.serverTime;

      const dataQueryStringAccount = 'timestamp=' + time;

      const signatureAccount = sha256.hmac(asilkeys.skey, dataQueryStringAccount);

      const endPointAccountInfo = binanceUrl + 'account';
      const urlAccountInfo = endPointAccountInfo + '?' + dataQueryStringAccount + '&signature=' + signatureAccount;
      const ourRequestAccountInfo = new XMLHttpRequest();

      ourRequestAccountInfo.open('GET', urlAccountInfo, false);
      ourRequestAccountInfo.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

      // tslint:disable-next-line: only-arrow-functions
      ourRequestAccountInfo.onload = function () {
        let myBalance = 0.00000001;
        const accountBalance = [];
        const tempAccountBalance = [];
        const accountInfo = JSON.parse(ourRequestAccountInfo.responseText);
        let countBigCoin = 0;
        accountInfo.balances.forEach(element => {
          if (element.free > 0) {
            accountBalance.push(element);




            if (element.asset !== 'BTC') {
              const endPointTicker = 'https://api.binance.com/api/v3/' + 'ticker/price';
              const ourRequestTicker = new XMLHttpRequest();


              const dataQueryString = '&symbol=' + element.asset + 'BTC';
              const urlTicker = endPointTicker + '?' + dataQueryString;

              ourRequestTicker.open('GET', urlTicker, false);
              ourRequestTicker.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


              // tslint:disable-next-line: only-arrow-functions
              ourRequestTicker.onload = function () {


                const ourDataTicker = JSON.parse(ourRequestTicker.responseText);

                const coinPrice = ourDataTicker.price;
                const elementTotalBtc = element.free * coinPrice;



                if (elementTotalBtc > 0.0001) {
                  countBigCoin++;

                  tempAccountBalance.push(element);

                }

              };
              ourRequestTicker.send();
            }

          }

          // Anlık price listesi


        });

        console.log('tempAccountBalance');

        console.log(tempAccountBalance);


        const canBuyableCoinCount =  10; //(1 btc) - 1 bnb

        const minBuyTrade = 0.0001; // (  btc)

        const coinCount = countBigCoin; //accountBalance.length;


        if (coinCount >= canBuyableCoinCount) {// alma
          console.log('1. ====> ' + new Date() + ' - coinCount : ' + coinCount + ' - canBuyableCoinCount : ' + canBuyableCoinCount);
        } else {
          accountBalance.forEach(element => {
            if (element.asset.includes('BTC')) {
              myBalance = Number(parseFloat(String(element.free)).toFixed(10));
            }
          });

          let buyCoinCount = Number(canBuyableCoinCount - coinCount);

          console.log('2. ====> ' + new Date() + ' - count : ' + coinCount + '  buyCoinCount : '
            + buyCoinCount + '  - my Btc Total Balance : ' + myBalance);

          let myDividedBalance = 0;

          /*** For döngüsü  Alınabileek*/
          for (let index = buyCoinCount; index > 1; index--) {
            myDividedBalance = Number(parseFloat(String(myBalance / index)).toFixed(10));
            console.log('3. ====> ' + new Date() + '  - myDividedBalance : ' + myDividedBalance);
            let continueToDivide = 1;
            if (continueToDivide > 0) {
              if (myDividedBalance >= minBuyTrade) // Alınabilecek sayı AL
              {
                buyCoinCount = index;
                console.log('4. ====> ' + new Date() + ' - buyCoinCount : '
                  + buyCoinCount + '  - myDividedBalance 2 : ' + myDividedBalance);

                continueToDivide = 0;
                break;

              }
            }


          }

          /*** For döngüsü  bitiş */
          /***************************ourRequest24hr START********************/


          const endPoint24hr = binanceUrl + 'ticker/24hr';
          const ourRequest24hr = new XMLHttpRequest();

          ourRequest24hr.open('GET', endPoint24hr, false);
          ourRequest24hr.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

          // tslint:disable-next-line: only-arrow-functions
          ourRequest24hr.onload = function () {
            const ourData24hr = JSON.parse(ourRequest24hr.responseText);

            // const orderedList24hr =
            const orderedList24hr =
              ourData24hr.slice().sort((a, b) => Number(a.priceChangePercent) - Number(b.priceChangePercent));

            let ii = 0;


            for (let index = 0; index < buyCoinCount; index++) {


              orderedList24hr.forEach(element24hr => {

                const btcSymbol = element24hr.symbol;
                if (btcSymbol.endsWith('BTC')) {

                  if (element24hr.priceChangePercent > 0) {

                    let subSymbol = btcSymbol;
                    subSymbol = subSymbol.replace('BTC', '');

                   // if (canBuyableCoinCount >=  accountBalance.length)
                    if (canBuyableCoinCount >= coinCount  ) {
                      if ((!accountBalance.some(e => e.asset === subSymbol))) {

                        // tslint:disable-next-line: max-line-length

                        ii++;

                        // Alış For döngüsü başlangıç


                        // klines
                        const endPointklines = binanceUrl + 'klines';

                        const getFullYear = new Date().getFullYear();
                        const getMonth = new Date().getMonth();
                        const getDay = new Date().getDate();
                        const getHours = new Date().getHours();

                        const startTime = new Date(getFullYear, getMonth, getDay, getHours - 105, 0, 0, 0).getTime();
                        const endTime = new Date(getFullYear, getMonth, getDay, getHours, -1, 0, 0).getTime();

                        console.log('5. ====> ' + 'buy MA -- c' + ii
                          + 'COIN : ' + btcSymbol + ' percentage : ' + element24hr.priceChangePercent
                          + '  startTime : ' + new Date(startTime) + 'endTime : ' + new Date(endTime));


                        const dataQueryStringklines = 'symbol=' + btcSymbol + '&' + 'interval=' + '1h'
                          + '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime;



                        const urlklines = endPointklines + '?' + dataQueryStringklines;
                        const ourRequestklines = new XMLHttpRequest();

                        ourRequestklines.open('GET', urlklines, false);
                        ourRequestklines.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);
                        ourRequestklines.onload = function () {

                          const ourDataKlineList = JSON.parse(ourRequestklines.responseText);
                          const tempklinesMA = [];

                          const ma7Array = [];
                          const ma25Array = [];
                          const ma99Array = [];

                          let _ma7 = 0;
                          let _ma25 = 0;
                          let _ma99 = 0;

                          let ma7T = 0;
                          let ma25T = 0;
                          let ma99T = 0;

                          const ma7Len = 7;
                          const ma25Len = 25;
                          const ma99Len = 99;

                          let closeDifOpen = 0;
                          let highDifLow = 0;


                          ourDataKlineList.forEach(klineElement => {

                            closeDifOpen = Math.abs(klineElement[4] - klineElement[1]);
                            highDifLow = Math.abs(klineElement[2] - klineElement[3]);

                            // tslint:disable-next-line: max-line-length
                            const _avgPrice = Number(parseFloat(String((Number(klineElement[1]) + Number(klineElement[4])) / 2)).toFixed(10));

                            // MA7
                            if (ma7Array.length < ma7Len) {

                              ma7Array.push(_avgPrice);
                              _ma7 = 0;
                              //  ma7T = ma7T + _avgPrice;
                              ma7T = ma7Array.reduce((a, b) => a + b, 0);
                              if (ma7Array.length === ma7Len) {
                                _ma7 = Number(parseFloat(String(ma7T / ma7Len)).toFixed(10));
                              }

                            } else {

                              ma7Array.shift();
                              ma7T = ma7T - ma7Array[0];
                              ma7Array.push(_avgPrice);
                              //  ma7T = ma7T + _avgPrice;
                              ma7T = ma7Array.reduce((a, b) => a + b, 0);

                              _ma7 = Number(parseFloat(String(ma7T / ma7Len)).toFixed(10));


                            }


                            // MA25
                            if (ma25Array.length < ma25Len) {

                              ma25Array.push(_avgPrice);
                              _ma25 = 0;

                              //        ma25T = ma25T + _avgPrice;
                              ma25T = ma25Array.reduce((a, b) => a + b, 0);

                              if (ma25Array.length === ma25Len) {
                                _ma25 = Number(parseFloat(String(ma25T / ma25Len)).toFixed(10));
                              }

                            } else {

                              ma25Array.shift();
                              ma25T = ma25T - ma25Array[0];
                              ma25Array.push(_avgPrice);
                              //        ma25T = ma25T + _avgPrice;
                              ma25T = ma25Array.reduce((a, b) => a + b, 0);
                              _ma25 = Number(parseFloat(String(ma25T / ma25Len)).toFixed(10));

                            }

                            // MA99
                            if (ma99Array.length < ma99Len) {

                              ma99Array.push(_avgPrice);
                              _ma99 = 0;
                              ma99T = ma99T + _avgPrice;
                              //        ma99T = ma99T + _avgPrice;
                              ma99T = ma99Array.reduce((a, b) => a + b, 0);

                              if (ma99Array.length === ma99Len) {
                                _ma99 = Number(parseFloat(String(ma99T / ma99Len)).toFixed(10));
                              }

                            } else {

                              ma99Array.shift();
                              ma99T = ma99T - ma99Array[0];
                              ma99Array.push(_avgPrice);
                              //        ma99T = ma99T + _avgPrice;
                              ma99T = ma99Array.reduce((a, b) => a + b, 0);
                              _ma99 = Number(parseFloat(String(ma99T / ma99Len)).toFixed(10));

                            }

                            const modelklinesMA = {
                              isSpec: Number(closeDifOpen - highDifLow),
                              openTime: new Date(klineElement[0]).toLocaleString(),
                              closeTime: new Date(klineElement[6]).toLocaleString(),
                              openPrice: klineElement[1],
                              closePrice: klineElement[4],
                              avgPrice: _avgPrice,
                              ma7: _ma7,
                              ma25: _ma25,
                              ma99: _ma99,
                            };

                            tempklinesMA.push(modelklinesMA);
                            console.log("Modelleme verisi:");
                            console.log(modelklinesMA);

                          });

                          console.log('6. ====> ' + ' for döngüsüne girecek lenght : ' + tempklinesMA.length);
                          // console.log(tempklinesMA);

                          for (let j = tempklinesMA.length - 2; j < tempklinesMA.length - 1; j++) {
                            console.log(' for döngüsüne girdi lenght : ' + tempklinesMA.length);
                            const notSpecReally = (tempklinesMA[j].isSpec !== 0) && (tempklinesMA[j + 1].isSpec !== 0);

                            if (notSpecReally && tempklinesMA[j].ma7 !== 0 && tempklinesMA[j].ma25 !== 0 && tempklinesMA[j].ma99 !== 0) {

                              const ma7isInc = (tempklinesMA[j + 1].ma7 - tempklinesMA[j].ma7) > 0 ? 1 : -1;
                              const ma25isInc = (tempklinesMA[j + 1].ma25 - tempklinesMA[j].ma25) > 0 ? 1 : -1;
                              // const ma99isInc = (tempklinesMA[j + 1].ma99 - tempklinesMA[j].ma99) > 0 ? 1 : -1;

                              const ma7islowerthanMa99 = (tempklinesMA[j].ma99 * 1.05 > tempklinesMA[j].ma7) ? 1 : -1;
                              const ma25islowerthanMa99 = (tempklinesMA[j].ma99 > tempklinesMA[j].ma25) ? 1 : -1;


                              if (ma7isInc === 1 && ma25isInc === 1 && ma7islowerthanMa99 === 1 && ma25islowerthanMa99 === 1) {
                                console.log('7. ====> ' + 'openTime : ' + tempklinesMA[j].openTime);
                                console.log('8. ====> ' + 'ma7isInc : ' + ma7isInc);
                                console.log('9. ====> ' + 'ma25isInc : ' + ma25isInc);
                                //   console.log('ma99isInc : ' + ma99isInc);
                                console.log('10. ====> ' + 'ma7islowerthanMa99 : ' + ma7islowerthanMa99);
                                console.log('11. ====> ' + 'ma25islowerthanMa99 : ' + ma25islowerthanMa99);

                                console.log('12. ====> ' + 'tempklinesMA : ');
                                console.log(tempklinesMA);
                                // ALIM İŞLEMİ BAŞLANGIÇ
                                /******************************************************************* */

                                // Anlık price listesi

                                const endPointTicker = binanceUrl + 'ticker/price';
                                const ourRequestTicker = new XMLHttpRequest();


                                const dataQueryString = '&symbol=' + btcSymbol;
                                const urlTicker = endPointTicker + '?' + dataQueryString;

                                ourRequestTicker.open('GET', urlTicker, false);
                                ourRequestTicker.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                // tslint:disable-next-line: only-arrow-functions
                                ourRequestTicker.onload = function () {

                                  let buyQuantity = 0;

                                  const ourDataTicker = JSON.parse(ourRequestTicker.responseText);
                                  console.log('13. ====> ' + 'ourDataTicker : ');
                                  console.log(ourDataTicker);
                                  const coinPrice = ourDataTicker.price;

                                  const tempQuantity = myDividedBalance / coinPrice;

                                  const quantity = Math.floor(tempQuantity);
                                  console.log('14. ====> ' + 'tempQuantity : ' + tempQuantity
                                    + ' quantity : ' + quantity + ' coinPrice : ' + coinPrice);

                                  /************************************** */


                                  let timeBuy = 0;
                                  const endPointTime = binanceUrl + 'time';
                                  const ourRequestTimeBuy = new XMLHttpRequest();

                                  ourRequestTimeBuy.open('GET', endPointTime, false);
                                  // tslint:disable-next-line: max-line-length
                                  ourRequestTimeBuy.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                  // tslint:disable-next-line: only-arrow-functions
                                  ourRequestTimeBuy.onload = function () {

                                    // let geciciDeger = 100000000;
                                    const ourDataTime = JSON.parse(ourRequestTimeBuy.responseText);
                                    timeBuy = ourDataTime.serverTime;

                                    const endPointBuy = binanceUrl + 'order';

                                    const dataQueryStringBuy = 'symbol=' + btcSymbol + '&type=market&side=buy&quantity='
                                      + quantity + '&timestamp=' + timeBuy;

                                    // tslint:disable-next-line: max-line-length
                                    const signatureBuy = sha256.hmac(asilkeys.skey, dataQueryStringBuy);

                                    const ourRequestBuy = new XMLHttpRequest();

                                    const urlBuy = endPointBuy + '?' + dataQueryStringBuy + '&signature=' + signatureBuy;


                                    const tempBuyQuantity = quantity * coinPrice;
                                    buyQuantity = tempBuyQuantity;
                                    console.log('15. ====> ' + '1H BUY Ma, quantity --> ' + quantity + '-***-' + 'coinPrice --> '
                                      + coinPrice + '-***-' + 'tempBuyQuantity --> ' + tempBuyQuantity);
                                    /*
                                    if (tempBuyQuantity > 0.0001) {

                                      ourRequestBuy.open('post', urlBuy, false);
                                      ourRequestBuy.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                      // // tslint:disable-next-line: only-arrow-functions
                                      ourRequestBuy.onload = function () {
                                        const ourdatabuy = JSON.parse(ourRequestBuy.responseText);
                                        console.log('16. ====> ' + 'ourdatabuy : ');
                                        console.log(ourdatabuy);
                                      };
                                      ourRequestBuy.send();



                                      const item = {
                                        "asset": subSymbol,
                                        "free": String(quantity),
                                        "locked": "0"
                                      }

                                      accountBalance.push(item);
                                      console.log('166. ====> ' + 'accountBalance');
                                      console.log(accountBalance);
                                    }

                                  };
                                  ourRequestTimeBuy.send();


                                  /******************write db start******************** */
                                  /*
                                  if (buyQuantity > 0.0001) {

                                    const endPointDelDB = 'https://localhost:44391/api/orderhistory/delete/?symbol=' + btcSymbol +
                                      '&account=' + acc + '&algorithmtype=' + algorithmtype;
                                    const ourRequestDelDB = new XMLHttpRequest();

                                    ourRequestDelDB.open('POST', endPointDelDB, false);

                                    ourRequestDelDB.onload = function () {
                                      console.log('17. ====> ' + 'ourRequestDelDB');
                                      console.log(ourRequestDelDB.responseText);

                                      const endPointWriteDB = 'https://localhost:44391/api/orderhistory/create?symbol=' + btcSymbol +
                                        '&alis=' + coinPrice + '&satis=' + coinPrice + '&flag=' + (coinPrice * 97 / 100) +
                                        '&gecensaat=0' + '&auditdate=' + new Date().toLocaleString() +
                                        '&account=' + acc + '&algorithmtype=' + algorithmtype;

                                      const ourRequestWriteDB = new XMLHttpRequest();

                                      ourRequestWriteDB.open('POST', endPointWriteDB, false);

                                      ourRequestWriteDB.onload = function () {
                                        console.log('18. ====> ' + 'ourRequestTimeLoc');

                                        const ourDataTimeLoc = JSON.parse(ourRequestWriteDB.responseText);
                                        console.log(ourDataTimeLoc);

                                      };
                                      ourRequestWriteDB.send();

                                    

                                    };
                                    ourRequestDelDB.send();
                                    /******************write db end******************** */
                                    
                                  }

                                };
                                ourRequestTicker.send();


                                // ALIM SON


                              }

                            }

                          }

                        };

                        ourRequestklines.send();

                      }

                    }

                  }






                }
                // Alış For döngüsü bitiş



              });
            }



          };
          ourRequest24hr.send();


          /***************************ourRequest24hr END********************/

        }




      };
      ourRequestAccountInfo.send();



    };
    ourRequestTime.send();
  }

  MaSellCoin() {

    const acc = 'asil';

    const binanceUrl = 'https://api.binance.com/api/v3/';

    const asilkeys = {
      akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
      skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
    };

    const dilberkeys = {
      akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
      skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
    };



    // bakiye çek
    // coinleri gez
    // btc kontrolü yap // aynı coin olmasın
    // satis kontrolü ma yap
    // al


    // BAKIYE ÇEK

    let time = 0;
    const endPointTime = binanceUrl + 'time';
    const ourRequestTime = new XMLHttpRequest();

    ourRequestTime.open('GET', endPointTime, false);
    ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

    ourRequestTime.onload = function () {

      const ourDataTime = JSON.parse(ourRequestTime.responseText);
      time = ourDataTime.serverTime;

      const dataQueryStringAccount = 'timestamp=' + time;

      const signatureAccount = sha256.hmac(asilkeys.skey, dataQueryStringAccount);

      const endPointAccountInfo = binanceUrl + 'account';
      const urlAccountInfo = endPointAccountInfo + '?' + dataQueryStringAccount + '&signature=' + signatureAccount;
      const ourRequestAccountInfo = new XMLHttpRequest();

      ourRequestAccountInfo.open('GET', urlAccountInfo, false);
      ourRequestAccountInfo.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

      // tslint:disable-next-line: only-arrow-functions
      ourRequestAccountInfo.onload = function () {

        const accountBalance = [];
        const accountInfo = JSON.parse(ourRequestAccountInfo.responseText);

        accountInfo.balances.forEach(element => {

          if (!element.asset.includes('BTC') && element.free > 0) {
            accountBalance.push(element);
          }

        });

        accountBalance.forEach(element => {

          // klines start
          const btcSymbol = element.asset + 'BTC';

          const endPointklines = binanceUrl + 'klines';

          const getFullYear = new Date().getFullYear();
          const getMonth = new Date().getMonth();
          const getDay = new Date().getDate();
          const getHours = new Date().getHours();


          const startTime = new Date(getFullYear, getMonth, getDay, getHours - 105, 0, 0, 0).getTime();
          const endTime = new Date(getFullYear, getMonth, getDay, getHours, -1, 0, 0).getTime();

          console.log('sell MA -- c' + 'COIN : ' + btcSymbol
            + '  startTime : ' + new Date(startTime) + 'endTime : ' + new Date(endTime));


          const dataQueryStringklines = 'symbol=' + btcSymbol + '&' + 'interval=' + '1h'
            + '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime;


          const urlklines = endPointklines + '?' + dataQueryStringklines;
          const ourRequestklines = new XMLHttpRequest();

          ourRequestklines.open('GET', urlklines, false);
          ourRequestklines.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);
          ourRequestklines.onload = function () {

            const ourDataKlineList = JSON.parse(ourRequestklines.responseText);
            const tempklinesMA = [];

            const ma7Array = [];
            const ma25Array = [];
            const ma99Array = [];

            let _ma7 = 0;
            let _ma25 = 0;
            let _ma99 = 0;

            let ma7T = 0;
            let ma25T = 0;
            let ma99T = 0;

            const ma7Len = 7;
            const ma25Len = 25;
            const ma99Len = 99;

           // let closeDifOpen = 0;
            // let highDifLow = 0;


            ourDataKlineList.forEach(klineElement => {
              //  console.log('klineElement');
              //  console.log(klineElement);


             // closeDifOpen = Math.abs(klineElement[4] - klineElement[1]);
              //  highDifLow = Math.abs(klineElement[2] - klineElement[3]);


              const _avgPrice = Number(parseFloat(String((Number(klineElement[1]) + Number(klineElement[4])) / 2)).toFixed(10));

              // console.log('avgPrice : ' + _avgPrice);

              //const _avgPrice = (Number(klineElement[1]) + Number(klineElement[4])) / 2;

              // MA7
              if (ma7Array.length < ma7Len) {

                ma7Array.push(_avgPrice);
                _ma7 = 0;
                //  ma7T = ma7T + _avgPrice;
                ma7T = ma7Array.reduce((a, b) => a + b, 0);
                if (ma7Array.length === ma7Len) {
                  _ma7 = Number(parseFloat(String(ma7T / ma7Len)).toFixed(10));
                }

              } else {

                ma7Array.shift();
                ma7T = ma7T - ma7Array[0];
                ma7Array.push(_avgPrice);
                //  ma7T = ma7T + _avgPrice;
                ma7T = ma7Array.reduce((a, b) => a + b, 0);

                _ma7 = Number(parseFloat(String(ma7T / ma7Len)).toFixed(10));


              }


              // MA25
              if (ma25Array.length < ma25Len) {

                ma25Array.push(_avgPrice);
                _ma25 = 0;

                //        ma25T = ma25T + _avgPrice;
                ma25T = ma25Array.reduce((a, b) => a + b, 0);

                if (ma25Array.length === ma25Len) {
                  _ma25 = Number(parseFloat(String(ma25T / ma25Len)).toFixed(10));
                }

              } else {

                ma25Array.shift();
                ma25T = ma25T - ma25Array[0];
                ma25Array.push(_avgPrice);
                //        ma25T = ma25T + _avgPrice;
                ma25T = ma25Array.reduce((a, b) => a + b, 0);
                _ma25 = Number(parseFloat(String(ma25T / ma25Len)).toFixed(10));

              }

              // MA99
              if (ma99Array.length < ma99Len) {

                ma99Array.push(_avgPrice);
                _ma99 = 0;
                ma99T = ma99T + _avgPrice;
                //        ma99T = ma99T + _avgPrice;
                ma99T = ma99Array.reduce((a, b) => a + b, 0);

                if (ma99Array.length === ma99Len) {
                  _ma99 = Number(parseFloat(String(ma99T / ma99Len)).toFixed(10));
                }

              } else {

                ma99Array.shift();
                ma99T = ma99T - ma99Array[0];
                ma99Array.push(_avgPrice);
                //        ma99T = ma99T + _avgPrice;
                ma99T = ma99Array.reduce((a, b) => a + b, 0);
                _ma99 = Number(parseFloat(String(ma99T / ma99Len)).toFixed(10));

              }

              const modelklinesMA = {

                openTime: new Date(klineElement[0]).toLocaleString(),
                closeTime: new Date(klineElement[6]).toLocaleString(),
                openPrice: klineElement[1],
                closePrice: klineElement[4],
                avgPrice: _avgPrice,
                ma7: _ma7,
                ma25: _ma25,
                ma99: _ma99,
              };

              tempklinesMA.push(modelklinesMA);


            });


            //  console.log('tempklinesMA : ');
            //  console.log(tempklinesMA);

           // for (let j = 0; j < tempklinesMA.length - 1; j++) {

            for (let j = tempklinesMA.length - 2; j < tempklinesMA.length - 1; j++) {
              // const notSpecReally = (tempklinesMA[j].isSpec !== 0) && (tempklinesMA[j + 1].isSpec !== 0);
              // if (notSpecReally &&
              if (tempklinesMA[j].ma7 !== 0 && tempklinesMA[j].ma25 !== 0 && tempklinesMA[j].ma99 !== 0) {

                const ma7isInc = (tempklinesMA[j + 1].ma7 - tempklinesMA[j].ma7) > 0 ? 1 : -1;
                const ma25isInc = (tempklinesMA[j + 1].ma25 - tempklinesMA[j].ma25) > 0 ? 1 : -1;
                const ma99isInc = (tempklinesMA[j + 1].ma99 - tempklinesMA[j].ma99) > 0 ? 1 : -1;

                const ma7ishigherthanMa99 = (tempklinesMA[j].ma99 < tempklinesMA[j].ma7) ? 1 : -1;
                const ma25ishigherthanMa99 = (tempklinesMA[j].ma99 < tempklinesMA[j].ma25) ? 1 : -1;


                // ma7 ve ma25 azalışta ve ma99 dan yukarı ise && ma7ishigherthanMa99 === 1 && ma25ishigherthanMa99 === 1
                if (ma7isInc === -1 && ma25isInc === -1 ) {


                  console.log('tempklinesMA : ');
                  console.log(tempklinesMA);

                  // Tradelist
                  const endPointTimeTrade = binanceUrl + 'time';
                  const ourRequestTimeTrade = new XMLHttpRequest();

                  ourRequestTimeTrade.open('GET', endPointTimeTrade, false);
                  ourRequestTimeTrade.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                  // tslint:disable-next-line: only-arrow-functions
                  ourRequestTimeTrade.onload = function () {

                    const ourDataTime = JSON.parse(ourRequestTimeTrade.responseText);
                    const timeTrade = ourDataTime.serverTime;


                    const endPointMyTrades = binanceUrl + 'myTrades';
                    const dataQueryStringTrade = 'timestamp=' + timeTrade + '&symbol=' + btcSymbol;
                    const signatureTrade = sha256.hmac(asilkeys.skey, dataQueryStringTrade);
                    const urlMyTrades = endPointMyTrades + '?' + dataQueryStringTrade + '&signature=' + signatureTrade;
                    const ourRequestMyTrades = new XMLHttpRequest();

                    ourRequestMyTrades.open('GET', urlMyTrades, false);
                    ourRequestMyTrades.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                    ourRequestMyTrades.onload = function () {
                      const myTrades = JSON.parse(ourRequestMyTrades.responseText);
                      console.log('myTrades');
                      console.log(myTrades);

                      const buyPrice = myTrades[myTrades.length - 1].price;
                      const btcSymbolTrade = myTrades[myTrades.length - 1].symbol;
                      const quantity = element.free;

                      console.log('1h - buyPrice : ' + buyPrice);
                      console.log('1h - btcSymbolTrade : ' + btcSymbolTrade);
                      console.log('1h - quantity : ' + quantity);



                      // SATIŞ İŞLEMİ BAŞLANGIÇ
                      /******************************************************************* */

                      const endPointTime = binanceUrl + 'time';
                      const ourRequestTime = new XMLHttpRequest();

                      ourRequestTime.open('GET', endPointTime, false);
                      ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                      // tslint:disable-next-line: only-arrow-functions
                      ourRequestTime.onload = function () {
                        const ourDataTime = JSON.parse(ourRequestTime.responseText);
                        time = ourDataTime.serverTime;


                        /****************************************************** */

                        const endPointOrder = binanceUrl + 'order';

                        const dataQueryStringSell = 'symbol=' + btcSymbol + '&type=market&side=SELL&quantity=' + quantity
                          + '&timestamp=' + time;

                        const ourRequestSell = new XMLHttpRequest();

                        const signatureStringSell = sha256.hmac(asilkeys.skey, dataQueryStringSell);

                        const urlSell = endPointOrder + '?' + dataQueryStringSell + '&signature=' + signatureStringSell;

                        ourRequestSell.open('POST', urlSell, false);
                        ourRequestSell.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                        ourRequestSell.onload = function () {
                          const ourDataSell = JSON.parse(ourRequestSell.responseText);
                          console.log('1h ourDataSell');

                          console.log(ourDataSell);
                        };

                        ourRequestSell.send();

                        /*********************

                        const endPointDelDB = 'https://localhost:44391/api/orderhistory/delete/' + btcSymbol;
                        const ourRequestDelDB = new XMLHttpRequest();

                        ourRequestDelDB.open('POST', endPointDelDB, false);

                        ourRequestDelDB.onload = function () {
                          console.log('ourRequestDelDB');
                          console.log(ourRequestDelDB.responseText);


                        };
                        ourRequestDelDB.send();
                        **********************/
                        /*******************************************************/



                      };
                      ourRequestTime.send();
                      // SATIŞ SON



                    };
                    ourRequestMyTrades.send();
                  };
                  ourRequestTimeTrade.send();
                  // Tradelist end

                }

              }

            }

          };

          ourRequestklines.send();

          // kliens end

        });




      };
      ourRequestAccountInfo.send();
      /************************* */

    };
    ourRequestTime.send();


  }
}
