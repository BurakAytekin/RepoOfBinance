import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/http';
import { sha256, sha224 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})
export class BuyService {

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




  GetServerTimeAndNewOrderBuy(): any {

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

      var dataQueryString2 = 'symbol=BNBBTC&type=market&side=buy&quantity=1&&timestamp=' + time; // 'recvWindow=20000&timestamp=' + Date.now();

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


  GetKlineList() {
    const coinListEndPoint = '/api/v3/ticker/price';

    const url = this.burl + coinListEndPoint;

    const ourRequest = new XMLHttpRequest();

    ourRequest.open('GET', url, true);

    ourRequest.setRequestHeader('X-MBX-APIKEY', this.keys.akey);

    // tslint:disable-next-line: only-arrow-functions
    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      // console.log(ourData);

      ourData.forEach(element => {
        let _symbol = element.symbol;
        if (_symbol.includes('BTC')) {

          const endPoint = 'https://api.binance.com/api/v3/klines';

          let _dataQueryString = 'symbol=' + 'XRPBTC' + '&' + 'interval=' + '1h'; // + '&' + 'LIMIT=' + '1000';
          const ourRequest = new XMLHttpRequest();

          const url = endPoint + '?' + _dataQueryString; // + '&signature=' + signature;

          ourRequest.open('GET', url, true);
          ourRequest.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');

          // tslint:disable-next-line: only-arrow-functions
          ourRequest.onload = function () {
            const ourData = JSON.parse(ourRequest.responseText);
            ourData.forEach(element => {

              console.log(element);
              console.log(element[4]);
              console.log(element[1]);
              console.log(element[4] - element[1]);

            });

          };
          ourRequest.send();



        }
      });

    };
    ourRequest.send();

  }


  GetKlineListXRP() {

    const endPoint = 'https://api.binance.com/api/v3/klines';



    const now = Date.now();
    const endTime = now;



    let _dataQueryString = 'symbol=' + 'XRPBTC' + '&' + 'interval=' + '1h' + '&' + 'endTime=' + endTime; // + '&' + 'LIMIT=' + '1000';
    const ourRequest = new XMLHttpRequest();

    const url = endPoint + '?' + _dataQueryString; // + '&signature=' + signature;

    ourRequest.open('GET', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');

    // tslint:disable-next-line: only-arrow-functions


    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);

      const arrayD = [];
      const arrayT = [];
      ourData.forEach(element => {

        // console.log(element);
        // console.log(element[4]); // a
        // console.log(element[1]); // b
        console.log(element[4] - element[1]); // b-a ==> c

        const diff = (element[4] - element[1]);

        arrayD.push(diff > 0 ? 1 : -1);

        const modelData = {
          deger: diff > 0 ? 1 : -1,
          alisFiyat: element[1],
          alisFiyatXXX: element[1],
        };

        arrayT.push(modelData);


      });

      console.log(arrayT);
      // debugger;
      const resultListAll = [];
      const resultList = [];

      for (let i = 0; i < arrayD.length - 2; i++) {
        const res = arrayT[i].deger + arrayT[i + 1].deger + arrayT[i + 2].deger;

        if (!((i + 3) > (arrayD.length - 2))) {
          const modelData3 = {
            deger: res,
            kar: arrayT[i + 3].alisFiyatXXX - arrayT[i + 2].alisFiyat,
            karorani: ((arrayT[i + 3].alisFiyatXXX - arrayT[i + 2].alisFiyat * arrayT[i + 2].alisFiyat) / 100),
            alisFiyat2: arrayT[i + 2].alisFiyat,
            satisFiyat2: arrayT[i + 2].alisFiyatXXX,
            satisFiyat3: arrayT[i + 3].alisFiyatXXX,
          };

          resultListAll.push(modelData3);
        }

        /**************************/
        if (res === 3) {

          // AL ( % 25)
          if (!((i + 4) > (arrayD.length - 2))) {
            const modelData2 = {
              kar: arrayT[i + 4].alisFiyatXXX - arrayT[i + 2].alisFiyat,
              karorani: ((arrayT[i + 4].alisFiyatXXX / arrayT[i + 2].alisFiyat)),
              alisFiyat2: arrayT[i + 2].alisFiyat,
              satisFiyat2: arrayT[i + 2].alisFiyatXXX,
              satisFiyat3: arrayT[i + 4].alisFiyatXXX,
            };

            resultList.push(modelData2);
          }

        }

        // resultList.push(res);
        //   toplam += res;
      }
      console.log('--------------- Hepsi ----------------');
      console.log(resultListAll);
      console.log('--------------- Oranlarımız ----------------');
      console.log(resultList);

      // console.log(toplam);
    };
    ourRequest.send();

  }




}
