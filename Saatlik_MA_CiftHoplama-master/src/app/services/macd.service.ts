import { Injectable } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { HelperService } from './helper.service';
import { sha256 } from 'js-sha256';
import { ExportService } from './export.service';
import { element } from 'protractor'; 
import { iif } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class macd  {
  constructor(private httpClient: HttpClient, private helperService: HelperService) {
   
  }

  keys = {
    akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
    skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
  };

  askeys = {
    akey: 'QDSTj2uPVkXtCIohYvN9EFP7IcHL46YGYzlaKzneb6U3xs3wulGgDPsUoEEfxOcT',
    skey: 'NdWpbzswwCJPDDlx1B99mVst1BFGGTn50ujeW7H1xEUqdvlzuiCVDUMFtx1klHXm'
  };

  burl = 'https://api.binance.com';

  MacdBuyCoinWithBarkin() {
    const binanceUrl = 'https://api.binance.com/api/v3/';

    const asilkeys = {
      akey: 'QDSTj2uPVkXtCIohYvN9EFP7IcHL46YGYzlaKzneb6U3xs3wulGgDPsUoEEfxOcT',
      skey: 'NdWpbzswwCJPDDlx1B99mVst1BFGGTn50ujeW7H1xEUqdvlzuiCVDUMFtx1klHXm'
    };

    const dilberkeys = {
      akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
      skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
    };
    

    const acc = 'asil';
    const algorithmtype = 'MACD';
    let time = 0;
    const AlimSatim = [];
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
                const elementTotalUSDT = element.free * coinPrice;



                if (elementTotalUSDT > 0.0001) {
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
        let countofelement = tempAccountBalance.length - 1;

        const canBuyableCoinCount = 10; //(1 USDT) - 1 bnb

        const minBuyTrade = 0.0001; // (  USDT)

        const coinCount = countBigCoin; //accountBalance.length;


        accountBalance.forEach(element => {
          if (element.asset.includes('BTC')) {
            myBalance = Number(parseFloat(String(element.free)).toFixed(10));
          }
        });


        /*** For döngüsü  bitiş */
        /***************************ourRequest24hr START********************/


        const endPoint24hr = binanceUrl + 'ticker/price';
        const ourRequest24hr = new XMLHttpRequest();

        ourRequest24hr.open('GET', endPoint24hr, false);
        ourRequest24hr.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


        // tslint:disable-next-line: only-arrow-functions
        ourRequest24hr.onload = function () {
          const ourData24hr = JSON.parse(ourRequest24hr.responseText);


          let ii = 0;

         // ourData24hr.forEach(element24hr => {

            const USDTSymbol = 'TOMOBTC';
            if (USDTSymbol.endsWith('BTC')) {

              let subSymbol = USDTSymbol;
              subSymbol = subSymbol.replace('BTC', '');



              // if (canBuyableCoinCount >=  accountBalance.length)


              // tslint:disable-next-line: max-line-length

              ii++;

              // Alış For döngüsü başlangıç


              // klines
              const endPointklines = binanceUrl + 'klines';
              const getFullYear = new Date().getFullYear();
              const getMonth = new Date().getMonth();
              const getDay = new Date().getDate();
              const getHours = new Date().getHours();

              const startTime = new Date(getFullYear, getMonth, getDay, getHours - 250, 0, 0, 0).getTime();
              const endTime = new Date(getFullYear, getMonth, getDay, getHours, -1, 0, 0).getTime();

              const dataQueryStringklines = 'symbol=' + USDTSymbol + '&' + 'interval=' + '1h'
                + '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime;

              const urlklines = endPointklines + '?' + dataQueryStringklines;
              const ourRequestklines = new XMLHttpRequest();

              ourRequestklines.open('GET', urlklines, false);
              ourRequestklines.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);
              ourRequestklines.onload = function () {
                const ourDataKlineList = JSON.parse(ourRequestklines.responseText);
                console.log(ourDataKlineList);

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
                let onceki = 0;
                let kontrol = 0;

                const ma7Len = 7;
                const ma25Len = 25;
                const ma99Len = 99;
                let closeDifOpen = 0;
                let highDifLow = 0;
                ourDataKlineList.forEach(klineElement => {
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

                  if (_ma99 != 0 && _ma25 != 0) {
                    if (_ma99 < _ma7 && _ma7 < _ma25) // _ma25 > _ma7 > _ma99 13 kez
                    {
                      kontrol = 0.2;
                    }
                    else if (_ma99 < _ma25 && _ma25 < _ma7) // ma7 > ma25 > ma99
                    {
                      kontrol = 0;
                    }
                    else if (_ma7 < _ma99 && _ma99 < _ma25) // ma25 > ma99 > ma7
                      kontrol = 0.4;
                    else if (_ma7 < _ma25 && _ma25 < _ma99) // ma99 > ma25 > ma7
                      kontrol = 0.6;
                    else if (_ma25 < _ma7 && _ma7 < _ma99) // ma99 > ma7 > ma25
                      kontrol = 0.8;
                    else if (_ma25 < _ma99 && _ma99 < _ma7) // ma7 > ma99 > ma25
                      kontrol = 1;
                    else
                      kontrol = 7;
                  }
                  const modelklinesMA = {
                    openTime: new Date(klineElement[0]).toLocaleString(),
                    closeTime: new Date(klineElement[6]).toLocaleString(),
                    highPrice: klineElement[2],
                    lowPrice: klineElement[3],
                    openPrice: klineElement[1],
                    closePrice: klineElement[4],
                    avgPrice: _avgPrice,
                    ma7: _ma7,
                    ma25: _ma25,
                    ma99: _ma99,
                    ma_kontrol: kontrol,
                  };
                  tempklinesMA.push(modelklinesMA);
                });
                const Ema_12 = []; // EMA 12
                const Ema_12_of_Ema = []; // 12 EMA OF 12 EMA
                let item_ema_12_of_ema = 0; // 12 EMA OF 12 EMA'nın ilk 12 satır toplamı
                let item_ema_12 = 0; // İlk 12 EMA TOPLAMI
                const Ema_26 = []; // EMA 26
                const Ema_26_of_Ema = [];
                let item_ema_26 = 0; // İlk 26 EMA TOPLAMI
                let item_ema_26_of_ema = 0;
                let item_signal_macd_dema = 0;
                const Dema_12 = [];
                const Dema_26 = [];
                const Macd_Dema = [];
                const Signal_Macd_Dema = [];
                const Histogram_Dema = [];
                const H_L = [];
                const H_PC = [];
                const L_PC = [];
                const true_range = [];
                const Atr99 = [];
                const Atr99Normalization = [];
                const Onceliklendirme = []; 
                const Atr99maxmin = [];
                const sadeceizle = [];
                for (let i = 0; i < tempklinesMA.length; i++) {
                  let closeprice = Number(tempklinesMA[i].closePrice);
                  if (i < 11) {
                    item_ema_12 += closeprice
                    Ema_12[i] = 0;
                  }
                  else if (i === 11) {
                    item_ema_12 += closeprice
                    item_ema_12 /= 12;
                    Ema_12[i] = item_ema_12;
                    item_ema_12_of_ema += Ema_12[i];
                  }
                  else if (i > 11 && i < 22) {
                    Ema_12[i] = (closeprice * (2 / (12 + 1)) + Ema_12[i - 1] * (1 - (2 / (12 + 1))));
                    item_ema_12_of_ema += Ema_12[i];
                  }
                  else if (i === 22) {
                    Ema_12[i] = (closeprice * (2 / (12 + 1)) + Ema_12[i - 1] * (1 - (2 / (12 + 1))));
                    item_ema_12_of_ema += Ema_12[i];
                    Ema_12_of_Ema[i] = item_ema_12_of_ema / 12;
                    Dema_12[i] = (2 * Ema_12[i]) - Ema_12_of_Ema[i];
                  }
                  else {
                    Ema_12[i] = (closeprice * (2 / (12 + 1)) + Ema_12[i - 1] * (1 - (2 / (12 + 1))));
                    Ema_12_of_Ema[i] = (closeprice * (2 / (12 + 1)) + Ema_12_of_Ema[i - 1] * (1 - (2 / (12 + 1))));
                    Dema_12[i] = (2 * Ema_12[i]) - Ema_12_of_Ema[i];
                  }
                }
                for (let j = 0; j < tempklinesMA.length; j++) {

                  let closeprice = Number(tempklinesMA[j].closePrice);
                  if (j < 25) {
                    item_ema_26 += closeprice;
                    Ema_26[j] = 0;
                  }
                  else if (j === 25) {
                    item_ema_26 += closeprice;
                    item_ema_26 /= 26;
                    Ema_26[j] = item_ema_26;
                    item_ema_26_of_ema += Ema_26[j];
                  }
                  else if (j > 25 && j < 50) {
                    Ema_26[j] = (closeprice * (2 / (26 + 1)) + Ema_26[j - 1] * (1 - (2 / (26 + 1))));
                    item_ema_26_of_ema += Ema_26[j];
                  }
                  else if (j === 50) {
                    Ema_26[j] = (closeprice * (2 / (26 + 1)) + Ema_26[j - 1] * (1 - (2 / (26 + 1))));
                    item_ema_26_of_ema += Ema_26[j];
                    Ema_26_of_Ema[j] = item_ema_26_of_ema / 26;
                    Dema_26[j] = (2 * Ema_26[j]) - Ema_26_of_Ema[j];
                    Macd_Dema[j] = Dema_12[j] - Dema_26[j];
                    item_signal_macd_dema += Macd_Dema[j];
                  }
                  else if (j > 50 && j < 52) {
                    Ema_26[j] = (closeprice * (2 / (26 + 1)) + Ema_26[j - 1] * (1 - (2 / (26 + 1))));
                    Ema_26_of_Ema[j] = (closeprice * (2 / (26 + 1)) + Ema_26_of_Ema[j - 1] * (1 - (2 / (26 + 1))));
                    Dema_26[j] = (2 * Ema_26[j]) - Ema_26_of_Ema[j];
                    Macd_Dema[j] = Dema_12[j] - Dema_26[j];
                    item_signal_macd_dema += Macd_Dema[j];
                  }
                  else if (j === 52) {
                    Ema_26[j] = (closeprice * (2 / (26 + 1)) + Ema_26[j - 1] * (1 - (2 / (26 + 1))));
                    Ema_26_of_Ema[j] = (closeprice * (2 / (26 + 1)) + Ema_26_of_Ema[j - 1] * (1 - (2 / (26 + 1))));
                    Dema_26[j] = (2 * Ema_26[j]) - Ema_26_of_Ema[j];
                    Macd_Dema[j] = Dema_12[j] - Dema_26[j];
                    item_signal_macd_dema += Macd_Dema[j];
                    Signal_Macd_Dema[j] = item_signal_macd_dema / 3;
                    Histogram_Dema[j] = Macd_Dema[j] - Signal_Macd_Dema[j];
                  }
                  else {
                    Ema_26[j] = (closeprice * (2 / (26 + 1)) + Ema_26[j - 1] * (1 - (2 / (26 + 1))));
                    Ema_26_of_Ema[j] = (closeprice * (2 / (26 + 1)) + Ema_26_of_Ema[j - 1] * (1 - (2 / (26 + 1))));
                    Dema_26[j] = (2 * Ema_26[j]) - Ema_26_of_Ema[j];
                    Macd_Dema[j] = Dema_12[j] - Dema_26[j];
                    item_signal_macd_dema -= Macd_Dema[j - 2];
                    item_signal_macd_dema += Macd_Dema[j];
                    Signal_Macd_Dema[j] = item_signal_macd_dema / 3;
                    Histogram_Dema[j] = Macd_Dema[j] - Signal_Macd_Dema[j];
                  }
                  const model = {
                    time: tempklinesMA[j].openTime,
                    Dema: Histogram_Dema[j],
                  }

                  sadeceizle.push(model);
                }
                ExportService.exportToCsv("Goster.csv",sadeceizle);
                let Cumulative_True_Range = 0;
                let maxmin_index = 0;
                for(let g = 1;g<tempklinesMA.length;g++)
                {
                  let High = Number(tempklinesMA[g].highPrice);
                  let Low = Number(tempklinesMA[g].lowPrice);
                  let close = Number(tempklinesMA[g - 1].closePrice);

                  H_L[g] = High - Low;
                  H_PC[g] = High - close;
                  L_PC[g] = Math.abs(Low - close);
                  true_range[g] = Math.max(H_PC[g],H_L[g],L_PC[g]);
                  
                  if(g < 100)
                  {
                    Atr99[g] = 0;
                    Cumulative_True_Range += true_range[g];
                  }
                  else{
                    Cumulative_True_Range += true_range[g];
                    Atr99[g] = Cumulative_True_Range/99;
                    Cumulative_True_Range -= true_range[g-99];
                    Atr99maxmin[maxmin_index] = Atr99[g];
                    maxmin_index++;
                  }
                }
                let maxatr = Math.max(...Atr99maxmin);
                let minatr = Math.min(...Atr99maxmin);
                for(let k = 100;k<tempklinesMA.length;k++)
                {
                  Atr99Normalization[k] = (Atr99[k] - minatr)/(maxatr - minatr);
                  Onceliklendirme[k] = Atr99Normalization[k] - tempklinesMA[k].ma_kontrol;
                }
                let buydecision = false;
                let selldecision = false;
                let Bakiye = 100;
                let countofcoin = 0;
                let AlimSaati = 0;
                for (let sataldongu = 100; sataldongu < Macd_Dema.length; sataldongu++) {
                  let Macd_Dema_Egim = 0;
                  Macd_Dema_Egim = Macd_Dema[sataldongu] - Macd_Dema[sataldongu - 1];
                  let index = tempklinesMA.length - 1;
                  // Coin Alımı ve Satımı İçin Ağırlıklandır 
                  // SATIŞ ALIŞ YÖNLENDİRMESİ YAP
                  // %2 KAYIP FONKSİYONU DEVAM ETTİRİLECEK 
                  let tempMacdModel = [];
                  //let countofbuyable = myBalance / (7 - countofelement);
                  //var isExistCoin = accountBalance.filter(function (item) {
                  //return item.asset == subSymbol;
                  // });
                  //console.log(isExistCoin);
                  //let quantity = Math.floor(countofbuyable / element24hr.price);
                  if (Histogram_Dema[sataldongu] > 0 && Histogram_Dema[sataldongu - 1] < 0) {
                    if(Macd_Dema[sataldongu] < 0)
                    {
                      if (buydecision === false) {
                        console.log("BTC Sembolu = " + USDTSymbol);
                        AlimSaati = sataldongu;
                        buydecision = true;
                        selldecision = false;
                        console.log("********************** Buy Point ***************************");
                        console.log("Alım Saati = " + tempklinesMA[sataldongu].openTime);
                        const AlimMa = {
                          symbol: USDTSymbol,
                          openTime: tempklinesMA[sataldongu + 1].openTime,
                          avgPrice: tempklinesMA[sataldongu + 1].avgPrice,
                          Onceliklendirme: Onceliklendirme[sataldongu + 1],
                          kar: 0,
                          buydecision: buydecision,
                          selldecision: selldecision,
                          Bakiye: Bakiye
                        }
                        
                        AlimSatim.push(AlimMa);
                      }
                      }
                    
                  }
                    if (Histogram_Dema[sataldongu] < 0 && Histogram_Dema[sataldongu - 1] > 0) {
                      if (buydecision === true) {
                        buydecision = false;
                        selldecision = true;
                        console.log("************************ Sell Point *********************");
                        console.log("Satım Saati = " + tempklinesMA[sataldongu].openTime);
                        let kar = (tempklinesMA[sataldongu + 1].avgPrice / tempklinesMA[AlimSaati + 1].avgPrice);
                        console.log("Kar oranı  = " + kar);
                        Bakiye *= kar;
                        console.log("Coin Bazlı Bakiye = " + Bakiye);
                        const SatisMa = {
                          symbol: USDTSymbol,
                          openTime: tempklinesMA[sataldongu + 1].openTime,
                          avgPrice: tempklinesMA[sataldongu + 1].avgPrice,
                          Onceliklendirme: Onceliklendirme[sataldongu + 1],
                          kar: kar,
                          buydecision: buydecision,
                          selldecision: selldecision,
                          Bakiye: Bakiye
                        }
                        AlimSatim.push(SatisMa);
                      }
                    } 
                }
              };
              ourRequestklines.send();


            }
          /*});
          */
          console.log(AlimSatim[0].openTime + AlimSatim[1].openTime);
          console.log((new Date(AlimSatim[0].openTime).getTime()) + " "+ (new Date(AlimSatim[1].openTime).getTime()));
          let Sirali1 = AlimSatim.slice().sort((a, b) => Number(new Date(a.openTime).getTime()) - Number(new Date(b.openTime).getTime()));
          console.log("Sirali1xxxx");
          console.log(Sirali1);
        };
        ourRequest24hr.send();
        let AlimSatimCoinAd = [];
        let countofcoin = 0;
        const SonCikti = [];
        let sat = 0;
        let ToplamBakiye = 100;

        //let SiraliAlimSatim = AlimSatim.slice().sort((a,b) => (new Date(b.openTime).getTime()) - (new Date(a.openTime).getTime()) );
        let SiraliAlimSatim = AlimSatim.slice().sort((a, b) => Number(new Date(a.openTime).getTime()) - Number(new Date(b.openTime).getTime()));

        console.log("Sirali Alım Satım");
        console.log(SiraliAlimSatim);
        for (let dolas = 0; dolas < SiraliAlimSatim.length - 2; dolas++) {
          let silindex = 0;
          if (SiraliAlimSatim[dolas].buydecision === true && SiraliAlimSatim[dolas].selldecision === false) {
            let maxindis = dolas;
            let max = SiraliAlimSatim[dolas].Onceliklendirme;
            let tekrar;
            for(tekrar = dolas + 1;(tekrar < SiraliAlimSatim.length )&& (SiraliAlimSatim[tekrar].openTime) === SiraliAlimSatim[dolas].openTime;tekrar++)
            {
              if (SiraliAlimSatim[tekrar].buydecision === true && SiraliAlimSatim[tekrar].selldecision === false)
              {
                maxindis = (SiraliAlimSatim[tekrar].Onceliklendirme > max) ? tekrar: maxindis;
                max = SiraliAlimSatim[tekrar].Onceliklendirme;
              }
              dolas=tekrar;
            }
            
            if (countofcoin < 2) {
              
              AlimSatimCoinAd[countofcoin] = SiraliAlimSatim[maxindis].symbol;
              countofcoin++;
              console.log("Count of coin buy = "+ countofcoin);
              SonCikti.push(SiraliAlimSatim[maxindis]);
            }
          }
          if (SiraliAlimSatim[dolas].selldecision === true && SiraliAlimSatim[dolas].buydecision === false) {
            if (countofcoin > 0) {
                var tut = AlimSatimCoinAd.filter(function(number) {
                  return number == SiraliAlimSatim[dolas].symbol;
                });

                if(tut.length >= 1)
                {
                  for(let go = 0;go<AlimSatimCoinAd.length;go++)
                  {
                    if(AlimSatimCoinAd[go] === SiraliAlimSatim[dolas].symbol)
                      AlimSatimCoinAd[go] = "";
                  }
                  console.log("Toplam Bakiye = "+ToplamBakiye);
                  ToplamBakiye *= SiraliAlimSatim[dolas].kar;
                  countofcoin--;
                  sat = 0;
                  console.log("Count of coin sell = "+ countofcoin);
                  SonCikti.push(SiraliAlimSatim[dolas]);
                }

            }
          }
        }
        console.log(SonCikti);
        console.log("Kümülatif Kazanç = "+ToplamBakiye);





      };
      ourRequestAccountInfo.send();

    };
    ourRequestTime.send();
  }

}