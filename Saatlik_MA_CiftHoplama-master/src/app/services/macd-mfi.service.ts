import { Injectable } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { HelperService } from './helper.service';
import { sha256 } from 'js-sha256';
import { ExportService } from './export.service';
import { count } from 'console';
import { isBuffer } from 'util';
//import { ConsoleReporter } from 'jasmine';

@Injectable({
  providedIn: 'root'
})

export class MacdMfiService extends ExportService {
  constructor(private httpClient: HttpClient, private helperService: HelperService) {
    super();
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

  MacdMfiCalculate() {
    const binanceUrl = 'https://api.binance.com/api/v3/';

    const asilkeys = {
      akey: 'QDSTj2uPVkXtCIohYvN9EFP7IcHL46YGYzlaKzneb6U3xs3wulGgDPsUoEEfxOcT',
      skey: 'NdWpbzswwCJPDDlx1B99mVst1BFGGTn50ujeW7H1xEUqdvlzuiCVDUMFtx1klHXm'
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


        accountBalance.forEach(element => {
          if (element.asset.includes('BTC')) {
            myBalance = Number(parseFloat(String(element.free)).toFixed(10));
          }
        });


        /*** For döngüsü  bitiş */
        /***************************ourRequest24hr START********************/

        const BannedCoins = ['DOGEBTC','DREPBTC','ERPBTC','HOTBTC','POEBTC','SCBTC','TNBBTC','VETBTC','XVGBTC','ONEBTC','ERDBTC','CNDBTC','YOYOBTC','ANKRBTC','MTHBTC','FUNBTC','CELRBTC','MDTBTC','DNTBTC','IOTXBTC','MBLBTC','STMXBTC','TROYBTC','PHBBTC','FUELBTC','CDTBTC','MITHBTC','XVGBTC','IOSTBTC','QKCBTC','FTMBTC','TFUELBTC','DOCKBTC','GTOBTC','WPRBTC','TCTBTC','SNMBTC','OSTBTC','REQBTC'];
        const endPoint24hr = binanceUrl + 'ticker/price';
        const ourRequest24hr = new XMLHttpRequest();

        ourRequest24hr.open('GET', endPoint24hr, false);
        ourRequest24hr.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


        // tslint:disable-next-line: only-arrow-functions
        ourRequest24hr.onload = function () {
          const ourData24hr = JSON.parse(ourRequest24hr.responseText);


          let ii = 0;


          ourData24hr.forEach(element24hr => {

            const USDTSymbol = element24hr.symbol;
            if (USDTSymbol.endsWith('BTC')
            ) {

              let subSymbol = USDTSymbol;
              subSymbol = subSymbol.replace('BTC', '');

              ii++;

              // Alış For döngüsü başlangıç

              let kontrol = 0;
              for(let index=0;index<BannedCoins.length;index++)
              {
                  if(BannedCoins[index] === USDTSymbol)
                  {
                      kontrol = 1;
                      break;
                  }
              }
              // klines

              if(kontrol == 0)
              {
              // klines
              const endPointklines = binanceUrl + 'klines';
              const getFullYear = new Date().getFullYear();
              const getMonth = new Date().getMonth();
              const getDay = new Date().getDate();
              const getHours = new Date().getHours();

              const startTime = new Date(getFullYear, getMonth, getDay, getHours - 500, 0, 0, 0).getTime();
              const endTime = new Date(getFullYear, getMonth, getDay, getHours, -1, 0, 0).getTime();

              const dataQueryStringklines = 'symbol=' + USDTSymbol + '&' + 'interval=' + '1h'
                + '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime;

              // const dataQueryStringklines = 'symbol=' + USDTSymbol + '&' + 'interval=' + '1h'
              //   + '&' + 'endTime=' + endTime;

              const urlklines = endPointklines + '?' + dataQueryStringklines;
              const ourRequestklines = new XMLHttpRequest();

              ourRequestklines.open('GET', urlklines, false);
              ourRequestklines.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);
              ourRequestklines.onload = function () {
                const ourDataKlineList = JSON.parse(ourRequestklines.responseText);
                console.log(ourDataKlineList);

                const tempklinesMA = [];


                const efi = [];
                const efiLen = 13;
                let _efi = 0;
                let efiT = 0;
                let realefi = 0;
                let kontrol = 0;
                let temptoefi = 0;
                const ma18Array = [];
                const ma7Array = [];
                const ma25Array = [];
                let efiMultiplier = (2 / (efiLen + 1));
                let _ma7 = 0;
                let _ma18 = 0;
                let ma18T = 0;
                let _ma25 = 0;
                let _ma99 = 0;
                let ma7T = 0;
                let ma25T = 0;
                const ma18Len = 18;
                const ma7Len = 5;
                const ma25Len = 34;

                const gainArray = [];
                let Gain = 0;
                let GainT = 0;

                
                let AroonUp = 0;
                let AroonDown = 0;
                const howManyHourLenAroon = 14;
                const gainAroonArray = [];

                const losesArray = [];
                let Loses = 0;
                let LosesT = 0;
                const rawMoneyFlowArray = [];
                const typicalPriceArray = [];
                let MoneyFlowIndex = 0;
                let Period14MoneyFlowRate = 0;
                let counter = -1;
                let howManyHourLenMfi = 14;

                console.log("Btc Symbol = " + USDTSymbol);

              
                ourDataKlineList.forEach(klineElement => {
                  const _avgPrice = Number(parseFloat(String((Number(klineElement[1]) + Number(klineElement[4])) / 2)).toFixed(10));
                  

                  counter++;

                  const ClosePrice = Number(klineElement[4]);
                  const OpenPrice = Number(klineElement[1]);
                  const HighPrice = Number(klineElement[2]);
                  const LowPrice = Number(klineElement[3]);
                  let median = (HighPrice + LowPrice)/2;
                  let tempEfi = 0;
                  const Volume = Number(klineElement[5]);
                  const TypicalPrice = (ClosePrice + LowPrice + HighPrice) / 3;
                  typicalPriceArray.push(TypicalPrice);
                  const RawMoneyFlow = TypicalPrice * Volume;
                  rawMoneyFlowArray.push(RawMoneyFlow);
                  
                  if(counter >= 1)
                  {
                    tempEfi = (ClosePrice - tempklinesMA[counter - 1].closePrice) * Volume;

                    if (efi.length < efiLen) {

                      efi.push(tempEfi);
                      _efi = 0;
                      //  ma7T = ma7T + _avgPrice;
                      efiT = efi.reduce((a, b) => a + b, 0);
                      if (efi.length === efiLen) {
                        _efi = Number(parseFloat(String(efiT / efiLen)).toFixed(10));
                        temptoefi = _efi;
                      }

                    } else {

                      realefi = ((tempEfi * efiMultiplier)) + (temptoefi * (1-efiMultiplier));
                      temptoefi = realefi;
                    }
                                      
                  }


                  if (ma7Array.length < ma7Len) {

                    ma7Array.push(median);
                    _ma7 = 0;
                    //  ma7T = ma7T + _avgPrice;
                    ma7T = ma7Array.reduce((a, b) => a + b, 0);
                    if (ma7Array.length === ma7Len) {
                      _ma7 = Number(parseFloat(String(ma7T / ma7Len)).toFixed(10));
                    }

                  } else {

                    ma7Array.shift();
                    ma7T = ma7T - ma7Array[0];
                    ma7Array.push(median);
                    //  ma7T = ma7T + _avgPrice;
                    ma7T = ma7Array.reduce((a, b) => a + b, 0);

                    _ma7 = Number(parseFloat(String(ma7T / ma7Len)).toFixed(10));


                  }


                  // MA25
                  if (ma25Array.length < ma25Len) {

                    ma25Array.push(median);
                    _ma25 = 0;

                    //        ma25T = ma25T + _avgPrice;
                    ma25T = ma25Array.reduce((a, b) => a + b, 0);

                    if (ma25Array.length === ma25Len) {
                      _ma25 = Number(parseFloat(String(ma25T / ma25Len)).toFixed(10));
                    }

                  } else {

                    ma25Array.shift();
                    ma25T = ma25T - ma25Array[0];
                    ma25Array.push(median);
                    //        ma25T = ma25T + _avgPrice;
                    ma25T = ma25Array.reduce((a, b) => a + b, 0);
                    _ma25 = Number(parseFloat(String(ma25T / ma25Len)).toFixed(10));

                  }


                  if (ma18Array.length < ma18Len) {

                    ma18Array.push(_avgPrice);
                    _ma18 = 0;
                    //  ma18T = ma18T + _avgPrice;
                    ma18T = ma18Array.reduce((a, b) => a + b, 0);
                    if (ma18Array.length === ma18Len) {
                      _ma18 = Number(parseFloat(String(ma18T / ma18Len)).toFixed(10));
                    }

                  } else {

                    ma18Array.shift();
                    ma18T = ma18T - ma18Array[0];
                    ma18Array.push(_avgPrice);
                    //  ma18T = ma18T + _avgPrice;
                    ma18T = ma18Array.reduce((a, b) => a + b, 0);

                    _ma18 = Number(parseFloat(String(ma18T / ma18Len)).toFixed(10));


                  }

                  const itemHigh = {
                    index: counter,
                    highPrice: HighPrice,
    
                  };
    
    
                  // gain
    
    
    
    
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



                  /************************** */







                  let _ao = _ma7 - _ma25;
                  const modelklinesMA = {
                    openTime: new Date(klineElement[0]).toUTCString(),
                    closeTime: new Date(klineElement[6]).toUTCString(),
                    openPrice: OpenPrice,
                    highPrice: HighPrice,
                    lowPrice: LowPrice,
                    closePrice: ClosePrice,
                    _ma18: _ma18,
                    efi: realefi,
                    ao: _ao,
                    AroonUp: AroonUp,
                    avgPrice: _avgPrice,
                    mfi: MoneyFlowIndex,
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
                const Ema_18 = [];
                const Ema_18_of_Ema = [];
                const Ema_18_of_Ema_of_Ema = [];
                const Trix = [];
                let item_ema_18 = 0;
                let item_ema_18_of_ema = 0;
                let item_ema_18_of_ema_of_ema = 0;
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
                const yenitrix = [];
                let multip = (2 / (18 + 1));

                // Trix: SiraliAlimSatim[dolas].Trix,
                for (let i = 0; i < tempklinesMA.length; i++) {
                  let closeprice = Number(tempklinesMA[i].closePrice);
                  if (i < 17) {
                    item_ema_18 += closeprice;
                    Ema_18[i] = 0;
                  }
                  else if (i === 17) {
                    item_ema_18 += closeprice;
                    item_ema_18 /= 18;
                    Ema_18[i] = item_ema_18;
                    item_ema_18_of_ema += Ema_18[i];
                  }
                  else if (i > 17 && i < 34) {
                    // Ema i-1 + Multip * (close - Ema i-1 )
                    Ema_18[i] = Ema_18[i - 1] * (1-multip) + closeprice * multip;
                    item_ema_18_of_ema += Ema_18[i];
                    yenitrix[i] = Math.log10(Ema_18[i]);
                  }
                  else if (i === 34) {
                    Ema_18[i] = Ema_18[i - 1] * (1-multip) + closeprice * multip;
                    yenitrix[i] = Math.log10(Ema_18[i]);
                    item_ema_18_of_ema += Ema_18[i];
                    Ema_18_of_Ema[i] = item_ema_18_of_ema / 18;
                    item_ema_18_of_ema_of_ema+=Ema_18_of_Ema[i];

                  }
                  else if(i>34 && i<51)
                  {
                    Ema_18[i] =  Ema_18[i - 1] * (1-multip) + closeprice * multip;
                    yenitrix[i] = Math.log10(Ema_18[i]);
                    Ema_18_of_Ema[i] = Ema_18_of_Ema[i - 1] * (1-multip)  + Ema_18[i] * multip ;
                    item_ema_18_of_ema_of_ema += Ema_18_of_Ema[i];
                  }
                  else if(i === 51)
                  {
                    Ema_18[i] =  Ema_18[i - 1] * (1-multip) + closeprice * multip;
                    yenitrix[i] = Math.log10(Ema_18[i]);
                    Ema_18_of_Ema[i] = Ema_18_of_Ema[i - 1] * (1-multip)  + Ema_18[i] * multip ;
                    item_ema_18_of_ema_of_ema += Ema_18_of_Ema[i];
                    Ema_18_of_Ema_of_Ema[i]=item_ema_18_of_ema_of_ema/18;
                  }
                  else {
                    // Ema3[i-1] + multip * (Ema2[i] - EMa3[i-1])
                    Ema_18[i] =  Ema_18[i - 1] * (1-multip) + closeprice * multip;
                    yenitrix[i] = Math.log10(Ema_18[i]);
                    Ema_18_of_Ema[i] = Ema_18_of_Ema[i - 1] * (1-multip)  + Ema_18[i] * multip ;
                    Ema_18_of_Ema_of_Ema[i] = Ema_18_of_Ema_of_Ema[i - 1] * (1-multip)  + Ema_18_of_Ema[i] * multip ;
                    Trix[i] = (Ema_18_of_Ema_of_Ema[i] - Ema_18_of_Ema_of_Ema[i-1])/Ema_18_of_Ema_of_Ema[i-1];
                  }
                }
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
                  else if (j > 50 && j < 58) {
                    Ema_26[j] = (closeprice * (2 / (26 + 1)) + Ema_26[j - 1] * (1 - (2 / (26 + 1))));
                    Ema_26_of_Ema[j] = (closeprice * (2 / (26 + 1)) + Ema_26_of_Ema[j - 1] * (1 - (2 / (26 + 1))));
                    Dema_26[j] = (2 * Ema_26[j]) - Ema_26_of_Ema[j];
                    Macd_Dema[j] = Dema_12[j] - Dema_26[j];
                    item_signal_macd_dema += Macd_Dema[j];
                  }
                  else if (j === 58) {
                    Ema_26[j] = (closeprice * (2 / (26 + 1)) + Ema_26[j - 1] * (1 - (2 / (26 + 1))));
                    Ema_26_of_Ema[j] = (closeprice * (2 / (26 + 1)) + Ema_26_of_Ema[j - 1] * (1 - (2 / (26 + 1))));
                    Dema_26[j] = (2 * Ema_26[j]) - Ema_26_of_Ema[j];
                    Macd_Dema[j] = Dema_12[j] - Dema_26[j];
                    item_signal_macd_dema += Macd_Dema[j];
                    Signal_Macd_Dema[j] = item_signal_macd_dema / 9;
                    Histogram_Dema[j] = Macd_Dema[j] - Signal_Macd_Dema[j];
                  }
                  else {
                    Ema_26[j] = (closeprice * (2 / (26 + 1)) + Ema_26[j - 1] * (1 - (2 / (26 + 1))));
                    Ema_26_of_Ema[j] = (closeprice * (2 / (26 + 1)) + Ema_26_of_Ema[j - 1] * (1 - (2 / (26 + 1))));
                    Dema_26[j] = (2 * Ema_26[j]) - Ema_26_of_Ema[j];
                    Macd_Dema[j] = Dema_12[j] - Dema_26[j];
                    item_signal_macd_dema -= Macd_Dema[j - 9];
                    item_signal_macd_dema += Macd_Dema[j];
                    Signal_Macd_Dema[j] = item_signal_macd_dema / 9;
                    Histogram_Dema[j] = Macd_Dema[j] - Signal_Macd_Dema[j];
                  }
                  const model = {
                    time: tempklinesMA[j].openTime,
                    Dema: Histogram_Dema[j],
                  }
                }


                let buydecision = false;
                let selldecision = false;
                let Bakiye = 100;

                let AlimSaati = 0;

                for (let sataldongu = 100; sataldongu < tempklinesMA.length; sataldongu++) {
                  let Macd_Dema_Egim = 0;
                  let Mfi_Egim = 0;
                  let macdartismiktar = 0;
                  let mfiartismiktar = 0;

                  let mfiControlAlim = false;
                  let mfiControlSatis = false;
                  let MaKontrol18 = false;
                  let macdcontrol = false;
                  let aoControl = false;
                  let arooncontrol = false;
                  let AoNegativeCheck = false;
                  let lag_aroon = false;
                  let check_aroon = 0;
                  let efi_sum = 0;
                  let efi_check = false;
                  let trix_check = false;
                  let close_open_rate = false;
                  let toplam_close = 0;
                  let toplam_rate_check = false;
                  let hour_24_check = false;
                  let geri_check = false;
                  /*let spec_control = 0;
                  let spec = true;
                  */
                  for (let macdart = sataldongu; macdart > sataldongu - 4; macdart--) {

                    if(tempklinesMA[macdart].ao < 0)
                    {
                      AoNegativeCheck = true;
                    }
                   /* if(tempklinesMA[macdart].AroonUp >= 85)
                    {
                      lag_aroon = true;
                    }
                    else if(tempklinesMA[macdart].AroonUp < 85)
                    {
                      check_aroon = 1;
                    }
                    */
                    /*if(Math.abs(tempklinesMA[macdart].openPrice-tempklinesMA[macdart].closePrice) == Math.abs(tempklinesMA[macdart - 1].openPrice-tempklinesMA[macdart - 1].closePrice))
                    {
                      spec_control++;
                    }
                    */
                    if (tempklinesMA[macdart].mfi < 20) {  // son 5 saat içinde 20 den küçük bir değeri varsa : true
                      mfiControlAlim = true;
                    }


                    if (tempklinesMA[macdart].mfi > 80) {  // son 5 saat içinde 20 den küçük bir değeri varsa : true
                      mfiControlSatis = true;
                    }
                    
                    
                  }
                  /*if(check_aroon === 1)
                  {
                    lag_aroon = false;
                    check_aroon = 0;
                  }
                  */
                 /*if(spec_control > 2)
                 {
                   spec_control = 0;
                   spec = false;
                 }
                 */
                let avg_2 = 0;
                let avg_3 = 0;
                let hr24 = tempklinesMA[sataldongu].closePrice/tempklinesMA[sataldongu-24].closePrice;
                for(let index = sataldongu;index > sataldongu - 5;index--)
                {
                  if(index > sataldongu - 2)
                  {
                    avg_2+=tempklinesMA[index].avgPrice;
                  }
                  else
                  {
                    avg_3+=tempklinesMA[index].avgPrice;
                  }
                }
                avg_2/=2;
                avg_3/=3;
                let geritoplam = 0;
                let geritoplam100 = 0;
                for(let gerisay = sataldongu-1;gerisay >= sataldongu-10;gerisay--)
                {
                  geritoplam+=tempklinesMA[gerisay].avgPrice;
                }
                geritoplam/=10;
                for(let geri=sataldongu-11;geri>=sataldongu-20;geri--)
                {
                  geritoplam100 += tempklinesMA[geri].avgPrice;
                }
                geritoplam100/=10;
                  aoControl = (tempklinesMA[sataldongu].ao > 0) ? true:false;
                  mfiControlAlim = tempklinesMA[sataldongu].mfi > 63 ? true:false;
                  efi_sum = tempklinesMA[sataldongu].efi + tempklinesMA[sataldongu-1].efi;
                  efi_check = (efi_sum > 0.05) ? true:false;
                  trix_check = (Trix[sataldongu] > 0) ? true:false;
                  // Coin Alımı ve Satımı İçin Ağırlıklandır 
                  // SATIŞ ALIŞ YÖNLENDİRMESİ YAP
                  // %2 KAYIP FONKSİYONU DEVAM ETTİRİLECEK
                  macdcontrol = (Histogram_Dema[sataldongu] > 0 && (Histogram_Dema[sataldongu] > Histogram_Dema[sataldongu - 1])) ? true:false;
                  MaKontrol18 = (tempklinesMA[sataldongu]._ma18 > tempklinesMA[sataldongu - 1]._ma18) ? true:false;
                  arooncontrol = (tempklinesMA[sataldongu].AroonUp > 90  && tempklinesMA[sataldongu].AroonUp < 101) ? true:false;
                  close_open_rate = ((tempklinesMA[sataldongu].closePrice/tempklinesMA[sataldongu].openPrice) >= 1.1) ? false:true;
                  toplam_rate_check = ((avg_2 >= avg_3)) ? true:false;
                  hour_24_check = (hr24 >= 1.03) ? true:false;
                  geri_check = (geritoplam < geritoplam100) ? true:false;
                  

                  
                  
                  if (mfiControlAlim && macdcontrol && MaKontrol18 && efi_check && arooncontrol && aoControl && trix_check && close_open_rate && toplam_rate_check ) {
                    if (buydecision === false) {

                      // 0,1,2,3,4

                      // for (let index = tempklinesMA.length - 5; index < tempklinesMA.length; index++) {

                      //   const element = tempklinesMA[index].mfi;

                      //   console.log('mfi');
                      //   console.log(element);

                      //   if (element > 20) {
                      //     buydecision = true;
                      //     console.log(element);
                      //   }

                      // }

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
                        Bakiye: Bakiye,
                        mfial: tempklinesMA[sataldongu].mfi,
                        ao: tempklinesMA[sataldongu].ao,
                        aroon: tempklinesMA[sataldongu].AroonUp,
                        efi:tempklinesMA[sataldongu].efi,
                        Trix: Trix[sataldongu],
                        yenitrix: yenitrix[sataldongu],
                        ema_18:Ema_18[sataldongu],
                        geri: geri_check,
                        Ema_18_of_Ema: Ema_18_of_Ema[sataldongu],
                        ema_18_of_ema_of_ema : Ema_18_of_Ema_of_Ema[sataldongu],
                        // _ao: tempklinesMA[sataldongu].ao,
                        // _ao_1: tempklinesMA[sataldongu - 1].ao
                      };

                      AlimSatim.push(AlimMa);
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
                        openTime: tempklinesMA[sataldongu + 1 ].openTime,
                        avgPrice: tempklinesMA[sataldongu + 1].avgPrice,
                        Onceliklendirme: Onceliklendirme[sataldongu + 1],
                        kar: kar,
                        buydecision: buydecision,
                        selldecision: selldecision,
                        Bakiye: Bakiye,
                        efi:tempklinesMA[sataldongu].efi,
                        mfial: tempklinesMA[sataldongu].mfi,
                        ao: tempklinesMA[sataldongu].ao,
                        aroon: tempklinesMA[sataldongu].AroonUp,
                        Trix: Trix[sataldongu],
                        geri: geri_check,
                        yenitrix: yenitrix[sataldongu],
                        ema_18:Ema_18[sataldongu],
                        Ema_18_of_Ema: Ema_18_of_Ema[sataldongu],
                        ema_18_of_ema_of_ema : Ema_18_of_Ema_of_Ema[sataldongu],
                      }
                      AlimSatim.push(SatisMa);
                    }
                  }
                }

                console.log("AlimSatim  = ");

                console.log(AlimSatim);

              };
              ourRequestklines.send();


            }
          }
          });
          console.log(AlimSatim[0].openTime + AlimSatim[1].openTime);
          console.log((new Date(AlimSatim[0].openTime).getTime()) + " " + (new Date(AlimSatim[1].openTime).getTime()));
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
            let satisdagez = dolas+1;
            let alinacak = dolas;
            while(SiraliAlimSatim[dolas].openTime === SiraliAlimSatim[satisdagez].openTime)
            {
              if(SiraliAlimSatim[dolas].geri_check === false && SiraliAlimSatim[satisdagez].geri_check === true)
              {
                alinacak = satisdagez;
                break;
              }
              else
              {
                alinacak = dolas;
              }
              satisdagez++;
              if(satisdagez>=SiraliAlimSatim.length)
              {
                break;
              }
            }
            dolas=alinacak;
            if (countofcoin < 2) {

              AlimSatimCoinAd[countofcoin] = SiraliAlimSatim[dolas].symbol;
              countofcoin++;
              console.log("Count of coin buy = " + countofcoin);
              const SiraliModel = {
                symbol: SiraliAlimSatim[dolas].symbol,
                openTime: SiraliAlimSatim[dolas].openTime,
                avgPrice: SiraliAlimSatim[dolas].avgPrice,
                buydecision: SiraliAlimSatim[dolas].buydecision,
                selldecision: SiraliAlimSatim[dolas].selldecision,
                mfial:  SiraliAlimSatim[dolas].mfi,
                ao:  SiraliAlimSatim[dolas].ao,
                kar: SiraliAlimSatim[dolas].kar,
                aroon:  SiraliAlimSatim[dolas].AroonUp,
                efi:SiraliAlimSatim[dolas].efi,
                AlinanCoinSayi: countofcoin,
                Toplam_Bakiye: ToplamBakiye,
                Trix: SiraliAlimSatim[dolas].Trix,
                yenitrix: SiraliAlimSatim[dolas].yenitrix,
                ema_18: SiraliAlimSatim[dolas].ema_18,
                Ema_18_of_Ema: SiraliAlimSatim[dolas].Ema_18_of_Ema,
                ema_18_of_ema_of_ema : SiraliAlimSatim[dolas].ema_18_of_ema_of_ema,
              }
              SonCikti.push(SiraliModel);
            }
          }
          if (SiraliAlimSatim[dolas].selldecision === true && SiraliAlimSatim[dolas].buydecision === false) {
            if (countofcoin > 0) {
              var tut = AlimSatimCoinAd.filter(function (number) {
                return number == SiraliAlimSatim[dolas].symbol;
              });

              if (tut.length >= 1) {
                for (let go = 0; go < AlimSatimCoinAd.length; go++) {
                  if (AlimSatimCoinAd[go] === SiraliAlimSatim[dolas].symbol) {
                    AlimSatimCoinAd[go] = "";
                  }
                }
                console.log("Toplam Bakiye = " + ToplamBakiye);
                ToplamBakiye *= SiraliAlimSatim[dolas].kar;
                countofcoin--;
                sat = 0;
                console.log("Count of coin sell = " + countofcoin);
                const SiraliModel = {
                  symbol: SiraliAlimSatim[dolas].symbol,
                  openTime: SiraliAlimSatim[dolas].openTime,
                  avgPrice: SiraliAlimSatim[dolas].avgPrice,
                  buydecision: SiraliAlimSatim[dolas].buydecision,
                  selldecision: SiraliAlimSatim[dolas].selldecision,
                  mfial:  SiraliAlimSatim[dolas].mfi,
                  ao:  SiraliAlimSatim[dolas].ao,
                  kar: SiraliAlimSatim[dolas].kar,
                  aroon:  SiraliAlimSatim[dolas].AroonUp,
                  efi:SiraliAlimSatim[dolas].efi,
                  AlinanCoinSayi: countofcoin,
                  Toplam_Bakiye: ToplamBakiye,
                  Trix: SiraliAlimSatim[dolas].Trix,
                  yenitrix: SiraliAlimSatim[dolas].yenitrix,
                  ema_18: SiraliAlimSatim[dolas].ema_18,
                  Ema_18_of_Ema: SiraliAlimSatim[dolas].Ema_18_of_Ema,
                  ema_18_of_ema_of_ema : SiraliAlimSatim[dolas].ema_18_of_ema_of_ema,
                }
                SonCikti.push(SiraliModel);
              }

            }
          }
        }
        
        

        console.log(SonCikti);
        console.log("Kümülatif Kazanç = " + ToplamBakiye);
        ExportService.exportToCsv("CoinBazli.csv", SonCikti);
        ExportService.exportToCsv("Macd9All.csv", SiraliAlimSatim);
        let pozitif = 100;
        const PozitifSatim = [];

        for(let index = 0;index < SonCikti.length;index++)
        {
          if(SonCikti[index].kar != 0 && SonCikti[index].kar > 1)
          {
            pozitif *= SonCikti[index].kar;
            PozitifSatim.push(SonCikti[index]);
          }
          
        }
        console.log("Pozitif Bakiye = " + pozitif);
        console.log(PozitifSatim);





      };
      ourRequestAccountInfo.send();

    };
    ourRequestTime.send();
  }

}