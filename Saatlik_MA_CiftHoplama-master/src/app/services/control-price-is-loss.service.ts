import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { sha256 } from 'js-sha256';
import { MacdSellService } from './macd.sell.service';


@Injectable({
  providedIn: 'root'
})
export class ControlPriceIsLossService extends MacdSellService{





  constructor() {
    super();
  }


  SellIfLoss97 () {

    const binanceUrl = 'https://api.binance.com/api/v3/';

    const asilkeys = {
      akey: 'QDSTj2uPVkXtCIohYvN9EFP7IcHL46YGYzlaKzneb6U3xs3wulGgDPsUoEEfxOcT',
      skey: 'NdWpbzswwCJPDDlx1B99mVst1BFGGTn50ujeW7H1xEUqdvlzuiCVDUMFtx1klHXm'
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

          if (!element.asset.includes('USDT') && element.free > 0) {

            if (!element.asset.includes('BNB')) {
              accountBalance.push(element);
            }

          }

        });


        accountBalance.forEach(element => {
          const USDTSymbol = element.asset + 'USDT';




          const ourRequestTimeTrade = new XMLHttpRequest();

          ourRequestTimeTrade.open('GET', endPointTime, false);
          ourRequestTimeTrade.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


          // tslint:disable-next-line: only-arrow-functions
          ourRequestTimeTrade.onload = function () {

            const ourDataTime = JSON.parse(ourRequestTimeTrade.responseText);
            const timeTrade = ourDataTime.serverTime;



            const endPointMyTrades = binanceUrl + 'myTrades';
            const dataQueryStringTrade = 'timestamp=' + timeTrade + '&symbol=' + USDTSymbol;
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


                const buyPrice = myLastTrade.price;
                let quantity = element.free;
                console.log('1h - quantity 1: ' + quantity);
                quantity = Math.floor(quantity);

                console.log('--------------' + new Date() + '---------------------------');
                console.log('1h - buyPrice : ' + buyPrice);
                console.log('1h - USDTSymbolTrade : ' + USDTSymbol);
                console.log('1h - quantity 2: ' + quantity);




                const endPointTicker = binanceUrl + 'ticker/price';
                const ourRequestTicker = new XMLHttpRequest();


                const dataQueryString = '&symbol=' + USDTSymbol;
                const urlTicker = endPointTicker + '?' + dataQueryString;

                ourRequestTicker.open('GET', urlTicker, false);
                ourRequestTicker.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                // tslint:disable-next-line: only-arrow-functions
                ourRequestTicker.onload = function () {

                  const ourDataTicker = JSON.parse(ourRequestTicker.responseText);
                  console.log('1h ourDataTicker : ');
                  console.log(ourDataTicker);
                  const coinPrice = ourDataTicker.price;

                  const isLoss = coinPrice / buyPrice;
                  console.log('1h coinPrice');
                  console.log(coinPrice);
                  console.log('1h buyPrice');
                  console.log(buyPrice);
                  console.log('1h isLoss');
                  console.log(isLoss);

                  if (isLoss < 0.984) {

                    const endPointTime = binanceUrl + 'time';
                    const ourRequestTimeToSell = new XMLHttpRequest();

                    ourRequestTimeToSell.open('GET', endPointTime, false);
                    ourRequestTimeToSell.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);
                    // tslint:disable-next-line: only-arrow-function
                    ourRequestTimeToSell.onload = function () {
                      const ourDataTime = JSON.parse(ourRequestTime.responseText);
                      time = ourDataTime.serverTime;
                      const datesell = new Date(time); // alış zamanı
                      console.log(datesell);
                      /****************************************************** */
                      const endPointOrder  =binanceUrl +  'order';

                      const dataQueryStringSell = 'symbol=' + USDTSymbol +
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
                    ourRequestTimeToSell.send();
                  }
                  // %8 Kar satışı
                  /* 
                  else if(isLoss >= 1.075)
                  {
                    MacdSellService.MaSellCoin(USDTSymbol,quantity);
                  }
                  */
                };
                ourRequestTicker.send();


              }

            };
            ourRequestMyTrades.send();




          };
          ourRequestTimeTrade.send();






        });







      };
      ourRequestAccountInfo.send();











    };
    ourRequestTime.send();



  }



}
