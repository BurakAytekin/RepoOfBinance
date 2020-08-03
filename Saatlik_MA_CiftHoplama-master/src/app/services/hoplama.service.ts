import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { sha256 } from 'js-sha256';
import { ExportService } from './export.service';


@Injectable({
  providedIn: 'root'
})
export class HoplamaService extends ExportService {

  constructor() {
    super();
  }
  keys = {
    akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
    skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
  };

  askeys = {
    akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
    skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
  };

  burl = 'https://api.binance.com';


  HoplamaSellCoin() {
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
    const algorithmtype = 'Hop';

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


      //let - var (değişebilir değerler) -const (değişmeyen değerler için)
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

            if (!element.asset.includes('BNB')) {
              // if (element.asset === 'AMB' || element.asset === 'COS') {

              accountBalance.push(element);
              //  }
            }

          }

        });

        accountBalance.forEach(element => {

          // klines start
          const btcSymbol = element.asset + 'BTC'; // 'NEO' + 'USDT';
          const endPointklines = binanceUrl + 'klines';

          const getFullYear = new Date().getFullYear();
          const getMonth = new Date().getMonth();
          const getDay = new Date().getDate();
          const getHours = new Date().getHours();


          const startTime = new Date(getFullYear, getMonth, getDay, getHours - 60, 0, 0, 0).getTime();
          const endTime = new Date(getFullYear, getMonth, getDay, getHours, -1, 0, 0).getTime();
          const dataQueryStringklines = 'symbol=' + btcSymbol + '&' + 'interval=' + '1h'
            + '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime;

          console.log(dataQueryStringklines); // account balance

          const urlklines = endPointklines + '?' + dataQueryStringklines;
          const ourRequestklines = new XMLHttpRequest();

          ourRequestklines.open('GET', urlklines, false);
          ourRequestklines.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);
          ourRequestklines.onload = function () {

            const ourDataKlineList = JSON.parse(ourRequestklines.responseText);

            const tempklines24h = [];

            let index = 0;
            ourDataKlineList.forEach(klineElement => {



              const AvgPrice = Number(parseFloat(String((Number(klineElement[2]) + Number(klineElement[3])) / 2)).toFixed(10));

              const Cdr = Number(parseFloat(String((Number(klineElement[2]) - Number(klineElement[3])) * 100
                / Number(klineElement[3]))).toFixed(10));

              const modelklines24h = {
                timeIndex24h: index,
                hour: new Date(klineElement[0]).getHours(),
                openTime: new Date(klineElement[0]).toLocaleString(),
                closeTime: new Date(klineElement[6]).toLocaleString(),
                highPrice: klineElement[2],
                lowPrice: klineElement[3],
                avgPrice: AvgPrice,
                cdr: Cdr
              };

              tempklines24h.push(modelklines24h);

              index = index + 1;

            });
            console.log(' ******************************************************** ');
            console.log(' tempklines24h ==> ');
            console.log(tempklines24h); // tempklines24h
            console.log(' ******************************************************** ');




            // kendinden önceki 5 saati hesapla  Hop 1 sağlıyormu-----------------------

            const tempRunBeforeCiftHoplamaArray = [];

            for (let xx = 0; xx < tempklines24h.length; xx++) {

              let S5sd = 0;
              const tempS5sdArray = [];

              let IsS5sdBetween1and4 = false;
              let IsLowPriceRising = false;

              if (xx > 4) {

                for (let xxx = xx - 1; xxx >= xx - 5; xxx--) {
                  const element = tempklines24h[xxx];
                  tempS5sdArray.push(element);

                }

                // get min low item
                const lowPriceItem = tempS5sdArray.reduce(function (prev, current) {
                  return (prev.lowPrice < current.lowPrice) ? prev : current;
                });

                // get max high item
                const highPriceItem = tempS5sdArray.reduce(function (prev, current) {
                  return (prev.highPrice > current.highPrice) ? prev : current;
                });


                // get last 5 hours s5sd
                S5sd = Number(parseFloat(String((Number(highPriceItem.highPrice) - Number(lowPriceItem.lowPrice)) * 100
                  / Number(lowPriceItem.lowPrice))).toFixed(10));



                if (S5sd > 1 && S5sd < 4) {
                  IsS5sdBetween1and4 = true;
                }
                // son 3 saatteki low price artışta mı?
                if ((tempklines24h[xx - 2].lowPrice < tempklines24h[xx - 1].lowPrice)
                  && (tempklines24h[xx - 1].lowPrice < tempklines24h[xx].lowPrice)) {
                  IsLowPriceRising = true;
                }


              }


              const beforeCiftHoplamaItem = {
                timeIndex24h: tempklines24h[xx].timeIndex24h,
                hour: tempklines24h[xx].hour,
                openTime: tempklines24h[xx].openTime,
                closeTime: tempklines24h[xx].closeTime,
                highPrice: tempklines24h[xx].highPrice,
                lowPrice: tempklines24h[xx].lowPrice,
                avgPrice: tempklines24h[xx].avgPrice,
                cdr: tempklines24h[xx].cdr,
                s5sd: S5sd,
                s5sdBetween1and4: IsS5sdBetween1and4,
                isLowPriceRising: IsLowPriceRising
              };


              tempRunBeforeCiftHoplamaArray.push(beforeCiftHoplamaItem);
            }
            console.log(' tempRunBeforeCiftHoplamaArray ==> ');
            console.log(tempRunBeforeCiftHoplamaArray); // tempRunBeforeCiftHoplamaArray
            console.log(' ******************************************************** ');

            // --------------------------------------------------------
            // ----------------------- listemizin sonundan IsLowPriceRising == true and s5sdBetween1and4== true ise runciftHoplama Kümesini al

            const runciftHoplamaArray = [];
            let donguDevammi = true;

            // Çift Hoplama For Döngüsü ------------------------------------------------
            for (let xxxx = tempRunBeforeCiftHoplamaArray.length - 1; xxxx >= 1 && donguDevammi; xxxx--) {

              if (runciftHoplamaArray.length === 0) {

                if (tempRunBeforeCiftHoplamaArray[xxxx].s5sdBetween1and4 && tempRunBeforeCiftHoplamaArray[xxxx].isLowPriceRising &&
                  tempRunBeforeCiftHoplamaArray[xxxx - 1].s5sdBetween1and4 && tempRunBeforeCiftHoplamaArray[xxxx - 1].isLowPriceRising
                  && tempRunBeforeCiftHoplamaArray[xxxx -2].s5sdBetween1and4 && tempRunBeforeCiftHoplamaArray[xxxx -1].isLowPriceRising
                ) {
                  runciftHoplamaArray.push(tempRunBeforeCiftHoplamaArray[xxxx]);
                }

              } else {
                if (tempRunBeforeCiftHoplamaArray[xxxx].s5sdBetween1and4 && tempRunBeforeCiftHoplamaArray[xxxx].isLowPriceRising) {

                  runciftHoplamaArray.push(tempRunBeforeCiftHoplamaArray[xxxx]);

                } else {

                  if (runciftHoplamaArray.length > 2) {

                    donguDevammi = false;

                  }

                }
              }

            }
            // ------------------------------------------------


            if (runciftHoplamaArray.length > 1) {
              // --------------------------------------------------------
              /*************** sabit başlangıç noktası hesaplama *****************************************/
              //max cdr  Item
              const cdrItem = runciftHoplamaArray.reduce(function (prev, current) {
                return (prev.cdr > current.cdr) ? prev : current;
              });
              console.log(' cdrItem ==> ');
              console.log(cdrItem);
              console.log(' ******************************************************** ');

              const sbnIndex24h = cdrItem.timeIndex24h - 1;
              console.log(' sbnIndex24h ==> ' + sbnIndex24h);
              var sbnItem = tempklines24h.filter(function (item) { return item.timeIndex24h === sbnIndex24h; });
              console.log('sbnItem : ');
              console.log(sbnItem);
              console.log('******************************************************** ');
              /****/
              const tempklines24hLength = tempklines24h.length;

              const startPrice = sbnItem[0].lowPrice;   // sbn Price
              const finalPrice = tempklines24h[tempklines24hLength - 1].highPrice; // finalPrice

              console.log('startPrice : ' + startPrice);
              console.log('finalPrice : ' + finalPrice);

              console.log('******************************************************** ');
              const sbnItem24hIndexHour = sbnItem[0].timeIndex24h; // get sbn 24h hour

              const tanArray = [];

              let tanDonguDevam = true;
              let sellModeOn = false;

              for (let j = sbnItem24hIndexHour + 1; j < tempklines24hLength - 1 && tanDonguDevam; j++) {

                const tanElement1 = Number(parseFloat(String((tempklines24h[j].highPrice - startPrice) /
                  (tempklines24h[j].timeIndex24h - sbnItem24hIndexHour))).toFixed(10));

                const tanElement2 = Number(parseFloat(String((tempklines24h[j + 1].highPrice - startPrice) /
                  (tempklines24h[j + 1].timeIndex24h - sbnItem24hIndexHour))).toFixed(10));



                console.log('highPrice(' + tempklines24h[j].timeIndex24h + ')=>  ' + tempklines24h[j].highPrice);
                console.log('tanElement(' + tempklines24h[j].timeIndex24h + ')=>  ' + tanElement1);
                //   console.log('tanElement(' + tempklines24h[j + 1].timeIndex24h + ')=>  ' + tanElement2);


                if (tanElement2 > tanElement1) {
                  tanDonguDevam = false;
                  sellModeOn = true;

                  console.log('tanElement2 > tanElement1==>  ' + tanElement2 + ' > ' + tanElement1);


                  console.log('******************************************************** ');

                  // tan(4) >  tan(3) sağlaması gereken tek koşul


                }

              } // for sbnItem24hIndexHour close tag

              console.log('sellModeOn ==>  ' + sellModeOn);
              console.log('******************************************************** ');
              if (sellModeOn) {



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

                    const myLastTrade = myTrades[myTrades.length - 1];
                    if (myLastTrade.isBuyer) {
                      const dateTrade = new Date(myLastTrade.time); // alış zamanı
                      console.log('dateTrade ' + dateTrade);
                      console.log('sbnItem[0].openTime ' + sbnItem[0].openTime);

                      let dateTradeTime = dateTrade.getTime();
                      console.log('dateTrade 2' + dateTrade.getTime());

                      let sbnItemopenTime = new Date(sbnItem[0].openTime).getTime();

                      console.log('sbnItem[0].openTime 2' + sbnItemopenTime);

                      if (dateTradeTime < sbnItemopenTime) {

                        const buyPrice = myTrades[myTrades.length - 1].price;
                        const btcSymbolTrade = myTrades[myTrades.length - 1].symbol;
                        let quantity = element.free;
                        console.log('1h - quantity 1: ' + quantity);


                        // quantity = Math.floor(quantity);

                        console.log('--------------' + new Date() + '---------------------------');
                        console.log('1h - buyPrice : ' + buyPrice);
                        console.log('1h - btcSymbolTrade : ' + btcSymbolTrade);
                        console.log('1h - quantity 2: ' + quantity);






                        const endPointTicker = binanceUrl + 'ticker/price';
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

                          console.log('1h coinPrice');
                          console.log(coinPrice);
                          console.log('1h buyPrice');
                          console.log(buyPrice);

                          const tempSellQuantity = quantity * coinPrice;
                          console.log('1h quantity --> ' + quantity + '***' + 'coinPrice --> ' + coinPrice
                            + '***' + 'tempSellQuantity --> ' + tempSellQuantity);

                          let commission = (quantity * coinPrice) * 0.001;
                          let sellQuantity = (tempSellQuantity - commission) / coinPrice;
                          sellQuantity = Number(parseFloat(String(sellQuantity)).toPrecision(10));


                          console.log('commission');
                          console.log(commission);
                          console.log('sellQuantity');
                          console.log(sellQuantity);


                          //   sellQuantity = Number(parseFloat(String(sellQuantity)).toPrecision(8));
                          //  console.log('1h sellQuantity');
                          // console.log(sellQuantity);

                          if (tempSellQuantity > 0.0001) {


                            const endPointExchangeInfo = binanceUrl + 'exchangeInfo';
                            const ourRequestExchangeInfo = new XMLHttpRequest();

                            const urlExchangeInfo = endPointExchangeInfo; //+ '?' + dataQueryStringExchangeInfo;

                            ourRequestExchangeInfo.open('GET', urlExchangeInfo, false);
                            ourRequestExchangeInfo.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                            ourRequestExchangeInfo.onload = function () {

                              const ourExchangeInfo = JSON.parse(ourRequestExchangeInfo.responseText);
                              console.log('  ourExchangeInfo');
                              console.log(ourExchangeInfo);

                              var precisionItem = ourExchangeInfo.symbols.filter(function (item) { return item.symbol === btcSymbol; });
                              console.log('precisionItem');
                              console.log(precisionItem);

                              const precision = precisionItem[0].baseAssetPrecision;
                              console.log('precision');
                              console.log(precision);



                              // tslint:disable-next-line: max-line-length
                              const lot_size_Item = precisionItem[0].filters.filter(function (item) { return item.filterType === 'LOT_SIZE'; });
                              console.log('lot_size_Item');
                              console.log(lot_size_Item);

                              const stepSize = Number(lot_size_Item[0].stepSize);

                              console.log('stepSize');
                              console.log(stepSize);


                              let realSellQuantity = sellQuantity - (sellQuantity % stepSize); //console.log(10000000000000004n % 97n);

                              console.log('realSellQuantity');
                              console.log(realSellQuantity);




                              // SATIŞ İŞLEMİ BAŞLANGIÇ
                              /********************************************************************/

                              const endPointTime = binanceUrl + 'time';
                              const ourRequestTime = new XMLHttpRequest();

                              ourRequestTime.open('GET', endPointTime, false);
                              ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                              /*
                              // tslint:disable-next-line: only-arrow-functions
                              ourRequestTime.onload = function () {
                                const ourDataTime = JSON.parse(ourRequestTime.responseText);
                                time = ourDataTime.serverTime;

                                
                                /****************************************************** */
                                /*

                                const endPointOrder = binanceUrl + 'order';



                                console.log('sellQuantity 2');
                                console.log(sellQuantity);


                                const dataQueryStringSell = 'symbol=' + btcSymbol + '&type=market&side=SELL&quantity=' + realSellQuantity
                                  + '&timestamp=' + time;





                                const ourRequestSell = new XMLHttpRequest();

                                const signatureStringSell = sha256.hmac(asilkeys.skey, dataQueryStringSell);

                                const urlSell = endPointOrder + '?' + dataQueryStringSell + '&signature=' + signatureStringSell;

                                ourRequestSell.open('POST', urlSell, false);
                                ourRequestSell.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                // ourRequestSell.onload = function () {
                                //   const ourdatasell = JSON.parse(ourRequestSell.responseText);
                                //   console.log('1h ourdatasell');
                                //   console.log(ourdatasell);
                                // };

                                // ourRequestSell.send();
                                */
                                console.log('   /******************************************************************* */');

                                /*
                              };
                              
                              ourRequestTime.send();
                              // SATIŞ SON
                              */

                              
                            };
                            ourRequestExchangeInfo.send();
                            // //




                          }


                        };
                        ourRequestTicker.send();


                      }

                    }



                  };
                  ourRequestMyTrades.send();
                };
                ourRequestTimeTrade.send();
                // Tradelist end F

                // Gauss
                // gauss hesaplama kare matris olmalı


                // // /**** Gauss Matrisi kare Bulma */
                // // const hourMatris = [];
                // // const coinValueMatris = [];
                // // const matrisLength = tempklines24hLength - sbnItem24hIndexHour;

                // // for (let i = 0; i < matrisLength; i++) {
                // //   hourMatris[i] = [];
                // //   coinValueMatris[i] = tempklines24h[i + sbnItem24hIndexHour].highPrice;
                // //   for (let j = 0; j < matrisLength; j++) {

                // //     if (i === 0 || j === 0) {
                // //       hourMatris[i][j] = 1;
                // //     } else {
                // //       hourMatris[i][j] = Math.pow(i + 1, j);

                // //     }


                // //   }
                // // }


                // // console.log('======' + '=========')
                // // console.log('hour Matris :');
                // // // tslint:disable-next-line: prefer-for-of
                // // for (let k = 0; k < hourMatris.length; ++k) {

                // //   console.log(hourMatris[k]);
                // // }
                // // console.log('coinValueMatris :');
                // // console.log('======' + '=========')
                // // // tslint:disable-next-line: prefer-for-of
                // // for (let k = 0; k < coinValueMatris.length; ++k) {

                // //   console.log(coinValueMatris[k]);
                // // }

                // // console.log('==========================')



                /**** Gauss Matrisi kare Bulma End */




                /*******Gauss Hesaplama *************************************** */
                // // // function solve(A, b) {
                // // //   // print(A, "A");
                // // //   makeM(A, b);

                // // for (let i = 0; i < hourMatris.length; ++i) {
                // //   hourMatris[i].push(coinValueMatris[i]);
                // // }


                // // //   // print(A, "M");
                // // //   diagonalize(A);
                // // // köşegenleştirme

                // // const m = hourMatris.length;
                // // const n = hourMatris[0].length;
                // // for (let k = 0; k < Math.min(m, n); ++k) {
                // //   // Find the k-th pivot
                // //   // const i_max = findPivot(M, k);
                // //   // tslint:disable-next-line: variable-name
                // //   let i_max = k;
                // //   for (let i = k + 1; i < hourMatris.length; ++i) {
                // //     if (Math.abs(hourMatris[i][k]) > Math.abs(hourMatris[i_max][k])) {
                // //       i_max = i;
                // //     }
                // //   }

                // //   // swap_rows(M, k, i_max);

                // //   // function swap_rows(M, i_max, k) {
                // //   if (i_max !== k) {
                // //     const temp = hourMatris[i_max];
                // //     hourMatris[i_max] = hourMatris[k];
                // //     hourMatris[k] = temp;
                // //   }
                // //   //  }

                // //   // Do for all rows below pivot
                // //   for (let i = k + 1; i < m; ++i) {
                // //     // Do for all remaining elements in current row:
                // //     const c = hourMatris[i][k] / hourMatris[k][k];
                // //     for (let j = k + 1; j < n; ++j) {
                // //       hourMatris[i][j] = hourMatris[i][j] - hourMatris[k][j] * c;
                // //     }
                // //     // Fill lower triangular matrix with zeros
                // //     hourMatris[i][k] = 0;
                // //   }
                // // }

                // // //   // print(A, "diag");
                // // //   substitute(A);


                // // // function substitute(M) {
                // // const mm = hourMatris.length;
                // // for (let i = mm - 1; i >= 0; --i) {
                // //   const sx = hourMatris[i][mm] / hourMatris[i][i];
                // //   for (let j = i - 1; j >= 0; --j) {
                // //     hourMatris[j][mm] -= sx * hourMatris[j][i];
                // //     hourMatris[j][i] = 0;
                // //   }
                // //   hourMatris[i][mm] = sx;
                // //   hourMatris[i][i] = 1;
                // // }
                // // // }
                // // //   // print(A, "subst");
                // // //   const xx = extractX(A);


                // // // function extractX(M) {
                // // const ex = [];
                // // const mmm = hourMatris.length;
                // // const nn = hourMatris[0].length;
                // // for (let i = 0; i < mmm; ++i) {
                // //   ex.push(hourMatris[i][nn - 1]);
                // // }

                // // // }

                // // //   // print(x, "x");
                // // //   return xx;
                // // // }
                // // console.log('solved :');
                // // // tslint:disable-next-line: prefer-for-of
                // // for (let k = 0; k < ex.length; ++k) {

                // //   console.log(ex[k]);
                // // }


                /***************************************************************** */







              }

            } //   if (runciftHoplamaArray.length > 1) close tag


          };

          ourRequestklines.send();

        });

      };
      ourRequestAccountInfo.send();

    };
    ourRequestTime.send();

  }



}
