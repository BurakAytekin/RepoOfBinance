import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sha256, sha224 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }

  keys = {
    akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
    skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
  };

  askeys = {
    akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
    skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
  }

  burl = 'https://api.binance.com';


  ///api/v3/ticker/24hr


  Get24hTicker() {
    const endPoint = 'https://api.binance.com/api/v3/ticker/24hr';
    const ourRequest = new XMLHttpRequest();

    const url = endPoint; // + '&signature=' + signature;

    ourRequest.open('GET', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');


    // tslint:disable-next-line: only-arrow-functions
    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
    };
    ourRequest.send();

  }

  MyTradeList() {

    const asilkeys = {
      akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
      skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
    };

    const dilberkeys = {
      akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
      skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
    };


    /******************************************************************** */
    let time = 0;
    const endPointTime = 'https://api.binance.com/api/v3/time';
    const ourRequestTime = new XMLHttpRequest();

    ourRequestTime.open('GET', endPointTime, true);
    ourRequestTime.setRequestHeader('X-MBX-APIKEY', dilberkeys.akey);


    // tslint:disable-next-line: only-arrow-functions
    ourRequestTime.onload = function () {

      const ourDataTime = JSON.parse(ourRequestTime.responseText);
      time = ourDataTime.serverTime;

      const dataQueryStringAccount = 'timestamp=' + time + '&symbol=' + 'WTCBTC';

      const signatureAccount = sha256.hmac(dilberkeys.skey, dataQueryStringAccount);

      const endPointMyTrades = 'https://api.binance.com/api/v3/myTrades';
      const urlMyTrades = endPointMyTrades + '?' + dataQueryStringAccount  + '&signature=' + signatureAccount;
      const ourRequestMyTrades = new XMLHttpRequest();

      ourRequestMyTrades.open('GET', urlMyTrades, true);
      ourRequestMyTrades.setRequestHeader('X-MBX-APIKEY', dilberkeys.akey);

      ourRequestMyTrades.onload = function () {

        const myTrades = JSON.parse(ourRequestMyTrades.responseText);
        console.log(myTrades);


        let orderedMyTrades = myTrades;

        if (myTrades.length > 1) {

          orderedMyTrades = myTrades.sort(function (a, b) { return a.time < b.time; });
        }



        console.log(orderedMyTrades);
        // orderedMyTrades.balances.forEach(element => {

        // ış Fiyatı

        const buyPrice = orderedMyTrades[0].price;
        const btcSymbol = orderedMyTrades[0].symbol;

        console.log('buyPrice' + buyPrice);
        console.log('btcSymbol' + btcSymbol);

      };
      ourRequestMyTrades.send();


    };
    ourRequestTime.send();

  }
}
