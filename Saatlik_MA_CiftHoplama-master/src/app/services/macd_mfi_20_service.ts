import { Injectable } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { HelperService } from './helper.service';
import { sha256 } from 'js-sha256';
import { ExportService } from './export.service';

@Injectable({
  providedIn: 'root'
})

export class MacdMfi20 extends ExportService {
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

        const BannedCoins = ['DOGEBTC','DREPBTC','ERPBTC','HOTBTC','POEBTC','SCBTC','TNBBTC','VETBTC','XVGBTC','ONEBTC','ERDBTC','CNDBTC','YOYOBTC','ANKRBTC','MTHBTC','FUNBTC','CELRBTC','MDTBTC','DNTBTC','IOTXBTC','MBLBTC','STMXBTC','TROYBTC','PHBBTC','FUELBTC','CDTBTC','MITHBTC','XVGBTC','IOSTBTC','QKCBTC','FTMBTC','TFUELBTC','DOCKBTC','GTOBTC','WPRBTC','TCTBTC','SNMBTC','OSTBTC','REQBTC'];


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

        const macd_kaydet = [];
        let carp = 0;


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

                let kontrol = 0;


                const gainArray = [];
                let Gain = 0;
                let GainT = 0;

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

                  counter++;

                  const ClosePrice = Number(klineElement[4]);
                  const OpenPrice = Number(klineElement[1]);
                  const HighPrice = Number(klineElement[2]);
                  const LowPrice = Number(klineElement[3]);

                  const Volume = Number(klineElement[5]);
                  const TypicalPrice = (ClosePrice + LowPrice + HighPrice) / 3;
                  typicalPriceArray.push(TypicalPrice);
                  const RawMoneyFlow = TypicalPrice * Volume;
                  rawMoneyFlowArray.push(RawMoneyFlow);



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




                  const _avgPrice = Number(parseFloat(String((Number(klineElement[1]) + Number(klineElement[4])) / 2)).toFixed(10));



                  const modelklinesMA = {
                    symbol: USDTSymbol,
                    openTime: new Date(klineElement[0]).toUTCString(),
                    closeTime: new Date(klineElement[6]).toUTCString(),
                    openPrice: OpenPrice,
                    highPrice: HighPrice,
                    lowPrice: LowPrice,
                    closePrice: ClosePrice,
                    avgPrice: _avgPrice,
                    mfi: MoneyFlowIndex,
                    ma_kontrol: kontrol,
                  };
                  tempklinesMA.push(modelklinesMA);

                });

                console.log("TempKlines");
                console.log(tempklinesMA);

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

                const Onceliklendirme = [];
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

                  for (let macdart = sataldongu; macdart > sataldongu - 4; macdart--) {



                    if (tempklinesMA[macdart].mfi < 20) {  // son 5 saat içinde 20 den küçük bir değeri varsa : true
                      mfiControlAlim = true;

                    }


                    if (tempklinesMA[macdart].mfi > 80) {  // son 5 saat içinde 20 den küçük bir değeri varsa : true
                      mfiControlSatis = true;
                    }


                  }

                  // Coin Alımı ve Satımı İçin Ağırlıklandır 
                  // SATIŞ ALIŞ YÖNLENDİRMESİ YAP
                  // %2 KAYIP FONKSİYONU DEVAM ETTİRİLECEK


                  if (mfiControlAlim && Histogram_Dema[sataldongu] > 0) {
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
                        // _ao: tempklinesMA[sataldongu].ao,
                        // _ao_1: tempklinesMA[sataldongu - 1].ao
                      };

                      AlimSatim.push(AlimMa);
                    }


                  }



                  if (Histogram_Dema[sataldongu] < 0 && Histogram_Dema[sataldongu - 1] > 0 && mfiControlSatis) {




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
                        Bakiye: Bakiye,
                        mfial: tempklinesMA[sataldongu].mfi,
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
        let AlimSatimCoinSaat = [];
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
            if (countofcoin < 2) {
              AlimSatimCoinAd[countofcoin] = SiraliAlimSatim[dolas].symbol;
              AlimSatimCoinSaat[countofcoin] = SiraliAlimSatim[dolas].openTime;
              countofcoin++;
              console.log("Count of coin buy = " + countofcoin);
              SonCikti.push(SiraliAlimSatim[dolas]);
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
                SonCikti.push(SiraliAlimSatim[dolas]);
              }

            }
          }
        }
        console.log(SonCikti);
        console.log("Kümülatif Kazanç = " + ToplamBakiye);
        ExportService.exportToCsv("Macd3Gercek.csv", SonCikti);
        ExportService.exportToCsv("TumAlimMacd3.csv",SiraliAlimSatim)





      };
      ourRequestAccountInfo.send();

    };
    ourRequestTime.send();
  }

}