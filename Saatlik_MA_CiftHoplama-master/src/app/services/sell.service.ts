import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sha256, sha224 } from 'js-sha256';



@Injectable({
  providedIn: 'root'
})
export class SellService {

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


  GetServerTimeAndNewOrderSell(): any {

    let time = 0;
    const endPoint = 'https://api.binance.com/api/v3/time';
    const ourRequest = new XMLHttpRequest();

    const url = endPoint;
    console.log('url' + url);

    ourRequest.open('GET', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');


    // tslint:disable-next-line: only-arrow-functions
    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
      time = ourData['serverTime'];
      const TestTime = new Date(ourData['serverTime']);
      console.log(TestTime);

      /****************************************************** */


      console.log('TestOrder(time) : ' + time);
      var burl2 = 'https://api.binance.com';
      var endPoint2 = '/api/v3/order';

      console.log('time : ' + time);

      var dataQueryString2 = 'symbol=INSBTC&type=market&side=SELL&quantity=1&&timestamp=' + time; // 'recvWindow=20000&timestamp=' + Date.now();

      var signature2 = sha256.hmac('xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb', dataQueryString2);


      var ourRequest2 = new XMLHttpRequest();

      var url2 = burl2 + endPoint2 + '?' + dataQueryString2 + '&signature=' + signature2;

      ourRequest2.open('POST', url2, true);
      ourRequest2.setRequestHeader('X-MBX-APIKEY', 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx');

      ourRequest2.onload = function () {
        const ourData2 = JSON.parse(ourRequest2.responseText);
        console.log(ourData2);
      }
      ourRequest2.send();

      /****************************************************** */



    };
    ourRequest.send();
    return time;
  }



}
