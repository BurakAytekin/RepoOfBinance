import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sha256, sha224 } from 'js-sha256';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

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


  GetBalance(): any {

    let askeys = {
      akey: 'QDSTj2uPVkXtCIohYvN9EFP7IcHL46YGYzlaKzneb6U3xs3wulGgDPsUoEEfxOcT',
      skey: 'NdWpbzswwCJPDDlx1B99mVst1BFGGTn50ujeW7H1xEUqdvlzuiCVDUMFtx1klHXm'
    }



    let time = 0;
    
    const endPoint = 'https://api.binance.com/api/v3/time';
    const ourRequest = new XMLHttpRequest();

    const url = endPoint;
    console.log('url' + url);

    ourRequest.open('GET', url, true);
    ourRequest.setRequestHeader('X-MBX-APIKEY', askeys.akey);


    // tslint:disable-next-line: only-arrow-functions
    ourRequest.onload = function () {
      const ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
      time = ourData['serverTime'];
      const TestTime = new Date(ourData['serverTime']);
      console.log(TestTime);

      /*** */
      time = ourData.serverTime;

      const dataQueryStringAccount = 'timestamp=' + time;

      // tslint:disable-next-line: max-line-length
      const signatureAccount = sha256.hmac(askeys.skey, dataQueryStringAccount);

      const endPointAccountInfo = 'https://api.binance.com/api/v3/account';
      const urlAccountInfo = endPointAccountInfo + '?' + dataQueryStringAccount + '&signature=' + signatureAccount;
      const ourRequestAccountInfo = new XMLHttpRequest();

      ourRequestAccountInfo.open('GET', urlAccountInfo, false);
      ourRequestAccountInfo.setRequestHeader('X-MBX-APIKEY', askeys.akey);
     

      // tslint:disable-next-line: only-arrow-functions
      ourRequestAccountInfo.onload = function () {

        const accountInfo = JSON.parse(ourRequestAccountInfo.responseText);
        console.log('accountInfo : ');
        console.log(accountInfo);

        const accountBalance = [];

        accountInfo.balances.forEach(element => {

          if (element.free > 0) {

            // Anlık price listesi


            if (element.asset !== 'BTC') {
              const endPointTicker = 'https://api.binance.com/api/v3/' + 'ticker/price';
              const ourRequestTicker = new XMLHttpRequest();


              const dataQueryString = '&symbol=' + element.asset + 'BTC';
              const urlTicker = endPointTicker + '?' + dataQueryString;

              ourRequestTicker.open('GET', urlTicker, false);
              ourRequestTicker.setRequestHeader('X-MBX-APIKEY', askeys.akey);


              // tslint:disable-next-line: only-arrow-functions
              ourRequestTicker.onload = function () {


                const ourDataTicker = JSON.parse(ourRequestTicker.responseText);

                const coinPrice = ourDataTicker.price;
                const elementTotalBtc = element.free * coinPrice;

                let countBigCoin = 0;

                if (elementTotalBtc > 0.0001)
                  countBigCoin++;


                const modelBalance = {

                  symbol: element.asset,
                  count: element.free,
                  totalBtcAmout: elementTotalBtc

                };
                accountBalance.push(modelBalance);

              };
              ourRequestTicker.send();
            }
            else {
              const modelBalance = {

                symbol: element.asset,
                count: element.free,
                totalBtcAmout: 0

              };
              accountBalance.push(modelBalance);

            }


          }

        });
        console.log('accountInfo : ');
        console.log(accountBalance);

        // ourData.forEach(element => {
        //   if (element.balances.free > 0)
        //     console.log('accountInfo : ');

        // });

      }

      ourRequestAccountInfo.send();




      /** */





    };
    ourRequest.send();
   
    return time;
  }




  GetAllCoins() {

    const coinListEndPoint = '/api/v3/ticker/price';


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


}
