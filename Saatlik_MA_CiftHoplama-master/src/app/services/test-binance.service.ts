import { Injectable, SystemJsNgModuleLoader } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatten } from '@angular/compiler';
import { sha256, sha224 } from 'js-sha256';
import { ExportService } from './export.service';

@Injectable({
  providedIn: 'root'
})
export class TestBinanceService extends ExportService{

  constructor(private httpClient: HttpClient) {
    super();
  }

  keys = {
    akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
    skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
  };

  askeys = {
    akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
    skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
  }

  burl = 'https://api.binance.com';
  dbEndPoint = '' + '/reports/';





  DateToNumberStr(value: any): any {

    const date = new Date(value);

    const month = date.getMonth() + 1; // months from 1-12
    const day = date.getDate();
    //// console.log('day')
    //// console.log(day);

    const year = date.getFullYear();

    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hour = date.getHours();

    const numberDateStr = this.SetStr0(year) + this.SetStr0(month) + this.SetStr0(day)
      + this.SetStr0(hour) + this.SetStr0(minutes) + this.SetStr0(seconds);
    //// console.log('numberDateStr')
    //// console.log(numberDateStr)
    return numberDateStr;
  }
  SetStr0(number: any): string {
    let Str = String(number);
    if (Str.length === 0) {
      Str = '00' + Str;
    }

    if (Str.length === 1) {
      Str = '0' + Str;
    }

    return Str;
  }

  dateAdd(date, interval, units) {
    if (!(date instanceof Date))
      return undefined;
    var ret = new Date(date); //don't change original date
    var checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };
    switch (String(interval).toLowerCase()) {
      case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
      case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
      case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
      case 'week': ret.setDate(ret.getDate() + 7 * units); break;
      case 'day': ret.setDate(ret.getDate() + units); break;
      case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
      case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
      case 'second': ret.setTime(ret.getTime() + units * 1000); break;
      default: ret = undefined; break;
    }
    return ret;
  }

  GetServerTime(): any {

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
    };
    ourRequest.send();
    return time;
  }


  GetCurrencyFromApi(): Observable<any> {

    let headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',

        'X-MBX-APIKEY': 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2'
      });


    const endPoint = '/api/v3/historicalTrades';
    let time = Date.now();
    time = time - (50);
    console.log(time);

    let dataQueryString = 'recvWindow=5000&timestamp=' + time * 1000;
    dataQueryString = 'symbol=LTCBTC';


    const url = this.burl + endPoint + '?' + dataQueryString;

    // const headers = new HttpHeaders();

    let allowedOrigin: string[];
    allowedOrigin = ['*'];
    let params = new HttpParams();
    // params.append('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');
    // headers.
    //  // set('Access-Control-Allow-Headers', 'Content-Type').
    //   set('Content-Type', 'application/json;charset=utf-8').
    //   //set('Access-Control-Allow-Origin', allowedOrigin).
    //   //set('Accept', '*/*').
    //   //set('Accept-Encoding', 'gzip, deflate').
    //   //set('Connection', 'keep-alive').
    //   set('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2')
    //   ;


    const httpOptions = {
      headers: headers

    };


    console.log(httpOptions);

    return this.httpClient.get<any>(url, httpOptions).subscribe(result => {
      console.log(result);
    }, error => console.error(error)) as any;

    // return this.httpClient.get<any>(url, httpOptions)
    //  .catch((error) => {
    //    // console.log(error);
    //    if (error.error === '1001 - Session Expired.') {
    //    } else {
    //      console.log(error)
    //      return Observable.throw('An exception is occured');
    //    }
    //  }) as any;

  }

  GetCurrencyTimePast() {


    const endTime = Date.now();
    const timePast = (endTime - 2700000);
    console.log('endTime' + endTime);
    console.log('timePast' + timePast);
    console.log('timePast' + timePast);



  }


  GetCurrencyFromApi2() {

    let endPoint = '/api/v3/account';
    endPoint = '/api/v3/historicalTrades';
    let time = Date.now();
    const now = new Date();

    time = time;
    console.log('time : ' + time);

    var myDate = new Date();
    var myEpoch = myDate.getTime() - 1000;
    console.log('myEpoch : ' + myEpoch);

    var testDate = new Date(myEpoch);
    console.log('testDate : ' + testDate);


    var today = new Date();
    var yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    console.log('yesterday : ' + yesterday);

    var seconds = (today.getTime() - yesterday.getTime()) / 1000;
    console.log('seconds : ' + seconds);

    console.log('  -------------------  ');

    let a = this.dateAdd(today, 'hour', -1);

    console.log('a' + a);
    console.log('a time :' + a.getTime());



    time = new Date('12/20/2019 11:00 PM').getTime();



    // const timeTest = new Date(Number(time) * 1000);
    // console.log(timeTest);
    // const secondTime = timeTest.toLocaleDateString('tr-TR') + ' ' + timeTest.toLocaleTimeString('tr-TR');
    // console.log(secondTime);
    // const displayDateTime = timeTest.toLocaleString('tr-TR');
    // console.log(displayDateTime);
    // const minus = now.getTimezoneOffset() * 60000;
    // console.log(minus);
    // const test2 = time - minus;
    // const test3 = now.setTime(test2);
    // console.log(test3);
    // const loginDate = new Date(Number(test3) * 1000);
    // console.log(loginDate);


    const d = new Date(time); // The 0 there is the key, which sets the date to the epoch
    console.log('date' + d);

    let dataQueryString = 'recvWindow=5000&timestamp=' + time * 1000;
    dataQueryString = 'symbol=ETHBTC';

    console.log('dataQueryString' + dataQueryString);

    // var signature = CryptoJS.HmacSHA256(dataQueryString ,keys['skey']).toString(CryptoJS.enc.Hex);

    const ourRequest = new XMLHttpRequest();

    const url = this.burl + endPoint + '?' + dataQueryString; // + '&signature=' + signature;

    ourRequest.open('GET', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', this.keys.akey);

    // tslint:disable-next-line: only-arrow-functions
    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
    };
    ourRequest.send();


  }


  GetAllCoins() {

    const coinListEndPoint = '/api/v3/ticker/price';

    // var dataQueryString = 'symbol=LTCBTC';

    const url = this.burl + coinListEndPoint; // + '?' + dataQueryString;

    const ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', this.keys.akey);

    // tslint:disable-next-line: only-arrow-functions
    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
    };
    ourRequest.send();

  }

  SaveCurrency(model): Observable<any> {

    return this.httpClient.post(this.dbEndPoint + 'SaveCurrency', model).subscribe(result => {
      console.log(result);
    }, error => console.error(error)) as any;


  }



  GetCurrencyHistory(dataQueryString) {

    const endPoint = '/api/v3/historicalTrades';
    const time = Date.now() - (50);
    const d = new Date(time); // The 0 there is the key, which sets the date to the epoch
    console.log(d);
    let _dataQueryString = 'symbol=' + dataQueryString;

    console.log(dataQueryString);

    const ourRequest = new XMLHttpRequest();

    const url = this.burl + endPoint + '?' + _dataQueryString; // + '&signature=' + signature;

    ourRequest.open('GET', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', this.keys.akey);

    // tslint:disable-next-line: only-arrow-functions
    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
    };
    ourRequest.send();


  }


  SaveCoinList() {
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

          const endPoint = 'https://api.binance.com/api/v3/historicalTrades';
          const time = Date.now() - (10);
          const d = new Date(time); // The 0 there is the key, which sets the date to the epoch

          let _dataQueryString = 'symbol=' + _symbol;
          const ourRequest = new XMLHttpRequest();

          const url = endPoint + '?' + _dataQueryString; // + '&signature=' + signature;

          ourRequest.open('GET', url, true);
          ourRequest.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');

          // tslint:disable-next-line: only-arrow-functions
          ourRequest.onload = function () {
            const ourData = JSON.parse(ourRequest.responseText);
            console.log(d); console.log(ourData);
          };
          ourRequest.send();




        }
      });

    };
    ourRequest.send();

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

  //Anlık price listesi

  GetPrice() {
    const endPoint = 'https://api.binance.com/api/v3/ticker/price';
    const ourRequest = new XMLHttpRequest();


    var time = new Date('12/20/2019 11:00 PM').getTime();
    console.log('time' + time);
    // const url = endPoint + '&timestamp=' + time * 1000; // + '&signature=' + signature;

    let dataQueryString = '&timestamp=' + time * 1000;
    //  dataQueryString = 'symbol=LTCBTC';


    const url = endPoint + '?' + dataQueryString;
    console.log('url' + url);

    ourRequest.open('GET', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');


    // tslint:disable-next-line: only-arrow-functions
    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
    };
    ourRequest.send();

  }

  GetPriceXRP() {
    const endPoint = 'https://api.binance.com/api/v3/ticker/price';
    const ourRequest = new XMLHttpRequest();

    var tempTime = new Date('12/23/2019 02:00 PM');
    console.log('tempTime' + tempTime);
    var time = tempTime.getTime();
    console.log('time' + time);
    // const url = endPoint + '&timestamp=' + time * 1000; // + '&signature=' + signature;

    let dataQueryString = '&timestamp=' + time * 1000;
    dataQueryString = dataQueryString + '&symbol=XRPBTC';


    const url = endPoint + '?' + dataQueryString;
    console.log('url' + url);

    ourRequest.open('GET', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');


    // tslint:disable-next-line: only-arrow-functions
    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
    };
    ourRequest.send();

  }

  /*
    TestOrder()
    {

      const endPoint = 'https://api.binance.com/api/v3/order/test';
      const ourRequest = new XMLHttpRequest();


      var time = new Date('12/20/2019 11:00 PM').getTime();
      console.log('time' + time);
     // const url = endPoint + '&timestamp=' + time * 1000; // + '&signature=' + signature;

       let dataQueryString = '&symbol=ETHBTC&quantity=1&type=LIMIT&side=SELL&price=0.060154&timeInForce=GTC&test=true&signature=1e72fc9fc943a6e0e872 9a593b982d54431bb1bf0f4572c84eb446093047678b';
       var signature = CryptoJS.HmacSHA256(dataQueryString ,keys['skey']).toString(CryptoJS.enc.Hex);


      const url = endPoint + '&signature=' + signature;;//  + '?' + dataQueryString;
      console.log('url' + url);

      ourRequest.open('POST', url, true);
      ourRequest.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');


      // tslint:disable-next-line: only-arrow-functions
      ourRequest.onload = function () {
        const ourData = JSON.parse(ourRequest.responseText);
        console.log(ourData);
      };
      ourRequest.send();
    }

  */

  TestSigned() {

    var burl = 'https://api.binance.com';
    var endPoint = '/api/v3/order/test';
    var dataQueryString = 'symbol=TRXBTC&type=market&side=buy&quantity=100.00'; // 'recvWindow=20000&timestamp=' + Date.now();

    var keys = this.keys;

    // var signature = CryptoJS.HmacSHA256(dataQueryString ,keys['skey']).toString(CryptoJS.enc.Hex);
    var signature = sha256.hmac(keys['skey'], dataQueryString);


    var ourRequest = new XMLHttpRequest();

    var url = burl + endPoint + '?' + dataQueryString + '&signature=' + signature;

    ourRequest.open('GET', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', keys['akey']);

    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
    }
    ourRequest.send();


  }

  TestOrder(time) {

    console.log('TestOrder(time) : ' + time);
    var burl = 'https://api.binance.com';
    var endPoint = '/api/v3/order';

    // let time = Date.now();
    // time = time - (50);

    //let time =  this.GetServerTime();
    console.log('time : ' + time);

    var dataQueryString = 'symbol=BNBBTC&type=market&side=buy&quantity=1&&timestamp=' + time; // 'recvWindow=20000&timestamp=' + Date.now();

    var keys = this.askeys;

    // var signature = CryptoJS.HmacSHA256(dataQueryString ,keys['skey']).toString(CryptoJS.enc.Hex);
    var signature = sha256.hmac(keys['skey'], dataQueryString);


    var ourRequest = new XMLHttpRequest();

    var url = burl + endPoint + '?' + dataQueryString + '&signature=' + signature;

    ourRequest.open('POST', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', keys['akey']);

    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
    }
    ourRequest.send();


  }

  /**************************** */


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

      var dataQueryString2 = 'symbol=INSBTC&type=market&side=SELL&quantity=5&&timestamp=' + time; // 'recvWindow=20000&timestamp=' + Date.now();

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



  GetKlineListXRP24h() {

    const endPoint = 'https://api.binance.com/api/v3/klines';

    const now = Date.now();

    var d = new Date();
    // d.setDate(25);
    d.setHours(13);

    const startTime = d.getTime();
    const endTime = now;

    console.log('startTime : ' + startTime);
    console.log('endTime : ' + endTime);


    // let _dataQueryString = 'symbol=' + 'XRPBTC' + '&' + 'interval=' + '1h'+ '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime; // + '&' + 'LIMIT=' + '1000';

    let _dataQueryString = 'symbol=' + 'LINKBTC' + '&' + 'interval=' + '1h' + '&' + 'endTime=' + endTime;

    const ourRequest = new XMLHttpRequest();

    const url = endPoint + '?' + _dataQueryString; // + '&signature=' + signature;

    ourRequest.open('GET', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');

    // tslint:disable-next-line: only-arrow-functions

    const sumModelElementList = [];
    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      const modelElementList = [];

      const arrayD = [];
      const arrayT = [];
      console.log('---All Data---');
      console.log(ourData);
      ourData.forEach(element => {


        const modelElement = {
          openTimeEpoch: element[0],
          openTime: new Date(element[0]).toLocaleString(),
          open: element[1],
          high: element[2],
          low: element[3],
          close: element[4],
          volume: element[5],
          closeTimeEpoch: element[6],
          closeTime: new Date(element[6]).toLocaleString(),
          quoteAssetVolume: element[7],
          numberOfTrades: element[8],
          takerBuyBaseAssetVolume: element[9],
          takerBuyQuoteAssetVolume: element[10],
          Ignore: element[11],
        };
        modelElementList.push(modelElement);

        const sumModelElement = {

          openTime: new Date(element[0]).toLocaleString(),
          open: element[1],
          high: element[2],
          low: element[3],
          close: element[4],
          closeTime: new Date(element[6]).toLocaleString(),

        };
        sumModelElementList.push(sumModelElement);



        // console.log(element);
        // console.log(element[4]); // a
        // console.log(element[1]); // b
        //console.log(element[4] - element[1]); // b-a ==> c

        const diff = (element[4] - element[1]);

        arrayD.push(diff > 0 ? 1 : -1);

        const modelData = {
          deger: diff > 0 ? 1 : -1,
          alisFiyat: element[1],
          alisFiyatXXX: element[1],
        };

        arrayT.push(modelData);


      });
      console.log('---All Data modelElementList---');

      console.log(modelElementList);
      console.log(sumModelElementList);
      //alert(sumModelElementList);

      // console.log(arrayT);
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
              alisFiyat: arrayT[i + 2].alisFiyat,
              //satisFiyat2: arrayT[i + 2].alisFiyatXXX,
              satisFiyat: arrayT[i + 4].alisFiyatXXX,
            };

            resultList.push(modelData2);
          }

        }

        // resultList.push(res);
        //   toplam += res;
      }
      console.log('--------------- Hepsi ----------------');
      // console.log(resultListAll);
      console.log('--------------- Oranlarımız ----------------');
      console.log(resultList);


      ExportService.exportToCsv("CoinName.csv",resultList);
      /*
      const separator = ',';
      const keys = Object.keys(modelElementList[0]);
      const csvContent =
        keys.join(separator) +
        '\n' +
        modelElementList.map(row => {
          return keys.map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date
              ? cell.toLocaleString()
              : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          }).join(separator);
        }).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, "CoinName");
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          console.log(url);
          link.setAttribute('href', url);
          link.setAttribute('download', "CoinName");
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      */



      // // -----------------------
      // this.fileReaded = fileInput.target.files[0];

      // let reader: FileReader = new FileReader();
      // reader.readAsText(this.fileReaded);

      // reader.onload = (e) => {
      //   let csv: string = reader.result;
      //   let allTextLines = csv.split(/\r|\n|\r/);
      //   let headers = allTextLines[0].split(',');
      //   let lines = [];

      //   for (let i = 0; i < allTextLines.length; i++) {
      //     // split content based on comma
      //     let data = allTextLines[i].split(',');
      //     if (data.length === headers.length) {
      //       let tarr = [];
      //       for (let j = 0; j < headers.length; j++) {
      //         tarr.push(data[j]);
      //       }

      //       // log each row to see output
      //       console.log(tarr);
      //       lines.push(tarr);
      //     }
      //   }
      //   // all rows in the csv file
      //   console.log(">>>>>>>>>>>>>>>>>", lines);
      // }

      // console.log(toplam);
    };
    ourRequest.send();





  }





  LocalService() {

    const endPointTimeLocal = 'https://localhost:44391/api/orderhistory/' + 'ABC';
    const ourRequestTimeLocal = new XMLHttpRequest();

    ourRequestTimeLocal.open('GET', endPointTimeLocal, true);


    ourRequestTimeLocal.onload = function () {
      console.log('ourRequestTimeLocal');

      const ourDataTimeLocal = JSON.parse(ourRequestTimeLocal.responseText);
      console.log(ourDataTimeLocal);


    };
    ourRequestTimeLocal.send();

  }

  TestHline() {
    /********************* ourRequestklines 15 DK LIK START ************************/
    let symbol = 'MDABTC';

    const endPointklinesM = 'https://api.binance.com/api/v3/klines';

    console.log('year' + new Date().getFullYear());
    console.log('getMonth' + new Date().getMonth());
    console.log('getDay' + new Date().getDate());
    console.log('getHours' + new Date().getHours());

    const getFullYear = new Date().getFullYear();
    const getMonth = new Date().getMonth();
    const getDay = new Date().getDate();
    const getHours = new Date().getHours();

    const startTime = new Date(getFullYear, getMonth, getDay, getHours - 2, 0, 0, 0).getTime();
    const endTime = new Date(getFullYear, getMonth, getDay, getHours, 15, 0, 0).getTime();


    console.log(' - startTimeEpoch : ' + startTime + ' - startTime : ' + new Date(startTime)
      + ' - endTime : ' + new Date(endTime));


    const dataQueryStringklinesM = 'symbol=' + symbol + '&' + 'interval=' + '1h'
      + '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime; //

    const urlklinesM = endPointklinesM + '?' + dataQueryStringklinesM;
    const ourRequestklinesM = new XMLHttpRequest();

    ourRequestklinesM.open('GET', urlklinesM, false);
    ourRequestklinesM.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');


    // tslint:disable-next-line: only-arrow-functions
    ourRequestklinesM.onload = function () {

      const ourDataPipeDiffList = JSON.parse(ourRequestklinesM.responseText);

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

        console.log('openTimeEpoch - ' + modelklines3hr.openTimeEpoch
          + ' -startTimeM- ' + startTime + ' -startTimeAdd1h- ' + startTimeAdd1h);


        if (modelklines3hr.openTimeEpoch === startTime || modelklines3hr.openTimeEpoch === startTimeAdd1h) {
          tempklines3hr.push(modelklines3hr);
        }

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

          }
        }


      });
    };

    ourRequestklinesM.send();
  }


  Test15MKline() {
    /********************* ourRequestklines 15 DK LIK START ************************/


    const endPointklinesM = 'https://api.binance.com/api/v3/klines';
    // console.log('startTimeM' + new Date(2020, 0, 23, 11, 0, 30, 0));
    // const startTimeM =new Date(2020,0, 23, 11, 0, 30, 0).getTime();
    //   const startTimeM = new Date().getTime() + (-15) * 60000; // 15 dakikalık fark

    // console.log('endTimeM' + new Date(2020, 0, 23, 11, 16, 30, 0));
    console.log('year' + new Date().getFullYear());
    console.log('getMonth' + new Date().getMonth());
    console.log('getDay' + new Date().getDate());
    console.log('getHours' + new Date().getHours());

    const getFullYear = new Date().getFullYear();
    const getMonth = new Date().getMonth();
    const getDay = new Date().getDate();
    const getHours = new Date().getHours();
    const startTimeM = new Date(getFullYear, getMonth, getDay, getHours, 0, 0, 0).getTime();
    const endTimeM = new Date(getFullYear, getMonth, getDay, getHours, 15, 0, 0).getTime();



    console.log(' - startTimeEpoch : ' + startTimeM + ' - startTime : ' + new Date(startTimeM)
      + ' - endTime : ' + new Date(endTimeM));


    const dataQueryStringklinesM = 'symbol=' + 'MDABTC' + '&' + 'interval=' + '15m'
      + '&' + 'startTime=' + startTimeM + '&' + 'endTime=' + endTimeM; //

    const urlklinesM = endPointklinesM + '?' + dataQueryStringklinesM;
    const ourRequestklinesM = new XMLHttpRequest();

    ourRequestklinesM.open('GET', urlklinesM, false);
    ourRequestklinesM.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');


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
          isSpec: closeDifOpenM - highDifLowM,
          diff: isIncreasing15,
          openPrice: elementPipeDiffM[1],
          closePrice: elementPipeDiffM[4]
        };

        const modelElement = {
          openTimeEpoch: elementPipeDiffM[0],
          openTime: new Date(elementPipeDiffM[0]).toLocaleString(),
          open: elementPipeDiffM[1],
          high: elementPipeDiffM[2],
          low: elementPipeDiffM[3],
          close: elementPipeDiffM[4],
          volume: elementPipeDiffM[5],
          closeTimeEpoch: elementPipeDiffM[6],
          closeTime: new Date(elementPipeDiffM[6]).toLocaleString(),
          quoteAssetVolume: elementPipeDiffM[7],
          numberOfTrades: elementPipeDiffM[8],
          takerBuyBaseAssetVolume: elementPipeDiffM[9],
          takerBuyQuoteAssetVolume: elementPipeDiffM[10],
          Ignore: elementPipeDiffM[11],
          isSpec: closeDifOpenM - highDifLowM,
          diff: isIncreasing15,
          openPrice: elementPipeDiffM[1],
          closePrice: elementPipeDiffM[4]
        };


        tempklines15M.push(modelElement);


      });

      console.log('tempklines15M - ');

      console.log(tempklines15M);
    };

    ourRequestklinesM.send();

  }



  GetKlineList24hCoin() {

    var array = [,'KNCBTC','BQXBTC','STORJBTC','CTSIBTC','STMXBTC','ERDBTC'];



    let modelElementList = [];
    array.forEach(element => {
      console.log(element);

      let coinExport = element ; //+ 'BTC';

      const endPoint = 'https://api.binance.com/api/v3/klines';

      const now = Date.now();

      var d = new Date();
      d.setHours(13);

      const startTime = d.getTime();
      const endTime = now;

      console.log('startTime : ' + startTime);
      console.log('endTime : ' + endTime);


      // let _dataQueryString = 'symbol=' + 'XRPBTC' + '&' + 'interval=' + '1h'+ '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime; // + '&' + 'LIMIT=' + '1000';

      let _dataQueryString = 'symbol=' + coinExport + '&' + 'interval=' + '1h' + '&' + 'endTime=' + endTime;

      const ourRequest = new XMLHttpRequest();

      const url = endPoint + '?' + _dataQueryString; // + '&signature=' + signature;

      ourRequest.open('GET', url, true);
      ourRequest.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');

      // tslint:disable-next-line: only-arrow-functions

      const sumModelElementList = [];
      ourRequest.onload = function () {
        const ourData = JSON.parse(ourRequest.responseText);
        const modelElementList = [];

        const arrayD = [];
        const arrayT = [];
        console.log('---All Data---');
        console.log(ourData);
        ourData.forEach(element => {


          const modelElement = {
            // openTimeEpoch: element[0],
            openTime: new Date(element[0]).toLocaleString(),
            openPrice: element[1],
            highPrice: element[2],
            lowPrice: element[3],
            closePrice: element[4],
            volume: element[5],
            // closeTimeEpoch: element[6],
            closeTime: new Date(element[6]).toLocaleString(),
            quoteAssetVolume: element[7],
            numberOfTrades: element[8],
            takerBuyBaseAssetVolume: element[9],
            takerBuyQuoteAssetVolume: element[10],
            Ignore: element[11],
          };
          modelElementList.push(modelElement);


        });
        console.log('---All Data modelElementList---');

        console.log(modelElementList);
        let csvName = element + ".csv"
        ExportService.exportToCsv(csvName,modelElementList);



      };
      ourRequest.send();
    });
    


  }

  GetAll()
  {
    var array = [,'KNCBTC','BQXBTC','STORJBTC','CTSIBTC','STMXBTC','ERDBTC'];
    const modelElementList = [];
    const endprice = 'https://api.binance.com/api/v3/ticker/price';
    const ourRequestPrice = new XMLHttpRequest();
    ourRequestPrice.open('GET',endprice);
    ourRequestPrice.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');

    ourRequestPrice.onload = function(){
      const ourDataprice = JSON.parse(ourRequestPrice.responseText);

      ourDataprice.forEach(elementprice => {
                    
        const btcSymbol = elementprice.symbol;
        console.log('btcsymbol ='+btcSymbol);
            if (btcSymbol.endsWith('BTC')) {
                
          
                let coinExport = btcSymbol; //+ 'BTC';
          
                const endPoint = 'https://api.binance.com/api/v3/klines';
          
                const now = new Date().getTime();;
          
                var d = new Date();
                d.setHours(13);
                const getFullYear = new Date().getFullYear();
                const getMonth = new Date().getMonth();
                const getDay = new Date().getDate();
                const getHours = new Date().getHours();
                console.log("Day = "+ getDay);
          
                const startTime = new Date(getFullYear, getMonth, getDay, getHours - 500, 0, 0, 0).getTime();;
                const endTime = now;
          
                console.log('startTime : ' + startTime);
                console.log('endTime : ' + endTime);
          
          
                // let _dataQueryString = 'symbol=' + 'XRPBTC' + '&' + 'interval=' + '1h'+ '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime; // + '&' + 'LIMIT=' + '1000';
          
                let _dataQueryString = 'symbol=' + coinExport + '&' + 'interval=' + '6h' + '&' +'endTime=' + endTime;
          
                const ourRequest = new XMLHttpRequest();
          
                const url = endPoint + '?' + _dataQueryString; // + '&signature=' + signature;
          
                ourRequest.open('GET', url, false);
                ourRequest.setRequestHeader('X-MBX-APIKEY', 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2');
          
                // tslint:disable-next-line: only-arrow-functions
                ourRequest.onload = function () {
                  const ourData = JSON.parse(ourRequest.responseText);

                  const ma7Len = 5;
                  const ma25Len = 34;
                  let _ma25 = 0;
                  let _ma7 = 0;
                  const ma7Array = [];
                  const ma25Array = [];
                  let ma7T = 0;
                  let ma25T = 0;
                  const arrayD = [];
                  const arrayT = [];
                  let counter = -1;
                  const gainArray = [];
                  let Gain = 0;
                  let GainT = 0;
  
                  const rawMoneyFlowArray = [];
                  const typicalPriceArray = [];
                  let MoneyFlowIndex = 0;
                  let Period14MoneyFlowRate = 0;
                  let howManyHourLenMfi = 14;
                  let AroonUp = 0;
                  let AroonDown = 0;
                  const gainAroonArray = [];
                  const howManyHourLenAroon = 14;

                  const losesArray = [];
                  let Loses = 0;
                  let LosesT = 0;
                  console.log('---All Data---');
                  console.log(ourData);
                  ourData.forEach(element => {

                  counter++;
                  const ClosePrice = Number(element[4]);
                  const OpenPrice = Number(element[1]);
                  const HighPrice = Number(element[2]);
                  const LowPrice = Number(element[3]);
                  let median = (HighPrice - LowPrice)/2;
                  const Volume = Number(element[5]);
                  const itemHigh = {
                    index: counter,
                    highPrice: HighPrice,
    
                  };
                  const TypicalPrice = (ClosePrice + LowPrice + HighPrice) / 3;
                  typicalPriceArray.push(TypicalPrice);
                  const RawMoneyFlow = TypicalPrice * Volume;
                  rawMoneyFlowArray.push(RawMoneyFlow);

                  if (gainAroonArray.length < howManyHourLenAroon) {
    
                    gainAroonArray.push(itemHigh);
                    // GainT = gainArray.reduce((a, b) => a + b, 0);
    
                    if (gainAroonArray.length === howManyHourLenAroon) {
                      // Aroon-Up = ((14 - Days Since 14-day High)/14) x 100
    
                      const highPriceItem = gainAroonArray.reduce(function (prev, current) {
                        return (prev.highPrice > current.highPrice) ? prev : current;
                      });
    
                      const barCount = howManyHourLenAroon - (highPriceItem.index + 1);
    
    
                      AroonUp = Number((((howManyHourLenAroon - barCount) / howManyHourLenAroon) * 100).toFixed(10));
                    }
    
                  } else {
    
    
                    gainAroonArray.shift();
                    gainAroonArray.push(itemHigh);
                    const highPriceItem = gainAroonArray.reduce(function (prev, current) {
                      return (prev.highPrice > current.highPrice) ? prev : current;
                    });
    
                    const startIndex = gainAroonArray[0].index;
    
                    const endIndex = gainAroonArray[howManyHourLenAroon - 1].index;
    
                    const diffIndex = endIndex - startIndex;
    
                    const  diffIndexMax = endIndex - highPriceItem.index ;
    
                    const barCount = howManyHourLenAroon - diffIndexMax;
                 
    
                    AroonUp = Number((((howManyHourLenAroon - diffIndexMax) / howManyHourLenAroon) * 100).toFixed(10));
                  }
    


                  /************************** */

                  if (counter > 0) {
                    Gain = typicalPriceArray[counter] >= typicalPriceArray[counter - 1] ? rawMoneyFlowArray[counter] : 0;
                    Loses = typicalPriceArray[counter] < typicalPriceArray[counter - 1] ? rawMoneyFlowArray[counter] : 0;


                    // gain
                    if (gainArray.length < howManyHourLenMfi) {

                      gainArray.push(Gain);
                      GainT = gainArray.reduce((a, b) => a + b, 0);

                      if (gainArray.length === howManyHourLenMfi) {


                      }

                    } else {

                      gainArray.shift();
                      GainT = GainT - gainArray[0];
                      gainArray.push(Gain);
                      GainT = gainArray.reduce((a, b) => a + b, 0);

                    }



                    // loses
                    if (losesArray.length < howManyHourLenMfi) {

                      losesArray.push(Loses);
                      LosesT = losesArray.reduce((a, b) => a + b, 0);

                      if (losesArray.length === howManyHourLenMfi) {
                        Period14MoneyFlowRate = GainT / LosesT;
                        MoneyFlowIndex = 100 - 100 / (1 + Period14MoneyFlowRate);
                      }

                    } else {

                      losesArray.shift();
                      LosesT = LosesT - losesArray[0];
                      losesArray.push(Loses);
                      LosesT = losesArray.reduce((a, b) => a + b, 0);

                      Period14MoneyFlowRate = GainT / LosesT;
                      MoneyFlowIndex = 100 - 100 / (1 + Period14MoneyFlowRate);
                    }





                  }
          
                    const modelElement = {
                      // openTimeEpoch: element[0],
                      symbol: coinExport,
                      openTime: new Date(element[0]).toUTCString(),
                      openPrice: element[1],
                      highPrice: element[2],
                      lowPrice: element[3],
                      closePrice: element[4],
                      volume: element[5],
                      mfi:MoneyFlowIndex,
                      AroonUp: AroonUp,
                      closeTime: new Date(element[6]).toUTCString(),
                    };
                    modelElementList.push(modelElement);
          
                  });

          
                };
                ourRequest.send();


            }
    });
    ExportService.exportToCsv("AllCoins.csv",modelElementList);
  };ourRequestPrice.send();


    
  }



}
