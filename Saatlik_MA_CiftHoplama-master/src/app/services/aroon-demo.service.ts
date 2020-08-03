import { Injectable } from '@angular/core';
import { BinanceUrl } from '../utils/binance-url';
import { BinanceKey } from '../utils/binance-key';
import { sha256 } from 'js-sha256';


@Injectable({
  providedIn: 'root'
})
export class AroonDemoService {

  constructor() {

  }




  AroonCalculateDemo() {
    const coinTradeType = 'BTC';
    let coinIndex = 0;

    const SpeculativeCoins = [
      'DOGEBTC', 'DREPBTC', 'ERPBTC', 'HOTBTC', 'POEBTC',
      'SCBTC', 'TNBBTC', 'VETBTC', 'XVGBTC', 'ONEBTC',
      'ERDBTC', 'CNDBTC', 'YOYOBTC', 'ANKRBTC', 'MTHBTC',
      'FUNBTC', 'CELRBTC', 'MDTBTC', 'DNTBTC', 'IOTXBTC',
      'MBLBTC', 'STMXBTC', 'TROYBTC', 'PHBBTC', 'FUELBTC',
      'CDTBTC', 'MITHBTC', 'XVGBTC', 'IOSTBTC', 'QKCBTC',
      'FTMBTC', 'TFUELBTC', 'DOCKBTC', 'GTOBTC', 'WPRBTC',
      'TCTBTC', 'SNMBTC', 'OSTBTC', 'REQBTC', 'TRXBTC',
      'VTHOBTC'];

    const arrayAroonTest = ['MATIC'];

    arrayAroonTest.forEach(arrayAroonTestItem => {
      coinIndex++;
      console.log('**************************' + new Date() + '**************************');
      console.log('********************************************* START *********************************************');
      console.log('index ==> ' + coinIndex + '  COIN ==> ' + arrayAroonTestItem);



      const ourRequest24hTicker = new XMLHttpRequest();
      const dataQueryString = '&symbol=' + arrayAroonTestItem + coinTradeType;
      const ticker24hrUrl = BinanceUrl.ticker24hrUrl + '?' + dataQueryString;


      ourRequest24hTicker.open('GET', ticker24hrUrl, true);
      ourRequest24hTicker.setRequestHeader('X-MBX-APIKEY', BinanceKey.asilkeys.akey);


      const hourStart = 500;
      const hourEnd = 0;

      // tslint:disable-next-line: only-arrow-functions
      ourRequest24hTicker.onload = function () {

        const ourData24hTicker = JSON.parse(ourRequest24hTicker.responseText);

        console.log('ourData24hTicker');
        console.log(ourData24hTicker);

        const elementTicker24hr = ourData24hTicker;


        // ourData24hTicker.forEach(elementTicker24hr => {

        const btcSymbol = elementTicker24hr.symbol;
        const subSymbol = btcSymbol.replace(coinTradeType, '');

        const isExistSpecCoin = SpeculativeCoins.filter(function (item) {
          return item === btcSymbol;
        });


        if (btcSymbol.endsWith(coinTradeType) && isExistSpecCoin.length < 1) {


          console.log(new Date() + ' -- started --' + btcSymbol
            + ' -- elementTicker24hr.priceChangePercent --' + elementTicker24hr.priceChangePercent);

          // BAKIYE ÇEK

          // klines
          const getFullYear = new Date().getFullYear();
          const getMonth = new Date().getMonth();
          const getDay = new Date().getDate();
          const getHours = new Date().getHours();

          const startTime = new Date(getFullYear, getMonth, getDay, getHours - hourStart, 0, 0, 0).getTime();
          const endTime = new Date(getFullYear, getMonth, getDay, getHours - hourEnd, -1, 0, 0).getTime();

          const dataQueryStringklines = 'symbol=' + btcSymbol
            + '&' + 'interval=' + '1h'
            + '&' + 'startTime=' + startTime
            + '&' + 'endTime=' + endTime;



          const urlklines = BinanceUrl.klinesUrl + '?' + dataQueryStringklines;
          const ourRequestklines = new XMLHttpRequest();

          ourRequestklines.open('GET', urlklines, false);
          ourRequestklines.setRequestHeader('X-MBX-APIKEY', BinanceKey.asilkeys.akey);
          ourRequestklines.onload = function () {

            const ourDataKlineList = JSON.parse(ourRequestklines.responseText);

            /***** Declarations ******/

            const howManyHourLenAroon = 14;
            const TempKlines = [];
            const gainArray = [];

            let GainT = 0;

            const losesArray = [];

            let LosesT = 0;
            let counter = -1;

            let AroonUp = 0;
            let AroonDown = 0;

            ourDataKlineList.forEach(klineElement => {

              counter++;

              // tslint:disable-next-line: max-line-length


              const OpenPrice = Number(klineElement[1]);
              const HighPrice = Number(klineElement[2]);
              const LowPrice = Number(klineElement[3]);
              const ClosePrice = Number(klineElement[4]);
              const Volume = Number(klineElement[5]);

              const itemHigh = {
                index: counter,
                highPrice: HighPrice,

              };


              // gain




              if (gainArray.length < howManyHourLenAroon) {

                gainArray.push(itemHigh);
                // GainT = gainArray.reduce((a, b) => a + b, 0);

                if (gainArray.length === howManyHourLenAroon) {
                  // Aroon-Up = ((14 - Days Since 14-day High)/14) x 100

                  const highPriceItem = gainArray.reduce(function (prev, current) {
                    return (prev.highPrice > current.highPrice) ? prev : current;
                  });

                  const barCount = howManyHourLenAroon - (highPriceItem.index + 1);


                  AroonUp = Number((((howManyHourLenAroon - barCount) / howManyHourLenAroon) * 100).toFixed(10));
                }

              } else {


                gainArray.shift();
                gainArray.push(itemHigh);
                const highPriceItem = gainArray.reduce(function (prev, current) {
                  return (prev.highPrice > current.highPrice) ? prev : current;
                });
                console.log('highPriceItem');
                console.log(highPriceItem);

                const startIndex = gainArray[0].index;

                const endIndex = gainArray[howManyHourLenAroon - 1].index;

                const diffIndex = endIndex - startIndex;
                console.log('startIndex : ' + startIndex);
                console.log('endIndex : ' + endIndex);
                console.log('diffIndex : ' + diffIndex);

                const  diffIndexMax = endIndex - highPriceItem.index ;
                console.log('diffIndexMax : ' + diffIndexMax);

                const barCount = howManyHourLenAroon - diffIndexMax;
                console.log('barCount : ' + barCount);
             

                AroonUp = Number((((howManyHourLenAroon - diffIndexMax) / howManyHourLenAroon) * 100).toFixed(10));
              }



              // // loses
              // if (losesArray.length < howManyHourLenAroon) {

              //   losesArray.push(LowPrice);
              //   LosesT = Number(losesArray.reduce((a, b) => a + b, 0).toFixed(10));

              //   if (losesArray.length === howManyHourLenAroon) {

              //     AroonDown = Number((((howManyHourLenAroon - LosesT) / howManyHourLenAroon) * 100).toFixed(10));
              //   }

              // } else {

              //   losesArray.shift();
              //   LosesT = LosesT - losesArray[0];
              //   losesArray.push(LowPrice);
              //   LosesT = Number(losesArray.reduce((a, b) => a + b, 0).toFixed(10));
              //   AroonDown = Number((((howManyHourLenAroon - LosesT) / howManyHourLenAroon) * 100).toFixed(10));
              // }



              /************************** */
              const itemAroon = {

                openTime: new Date(klineElement[0]).toLocaleString(),
                closeTime: new Date(klineElement[6]).toLocaleString(),
                openPrice: OpenPrice,
                closePrice: ClosePrice,
                highPrice: HighPrice,
                lowPrice: LowPrice,
                volume: Volume,
                gainT: GainT,
                // losesT: LosesT,
                aroonUp: AroonUp,
                // aroonDown: AroonDown
              };

              TempKlines.push(itemAroon);


            });

            console.log('Aroon calculate');

            console.log(TempKlines);
            /************************************************************/





            const separator = ',';
            const keys = Object.keys(TempKlines[0]);
            const csvContent =
              keys.join(separator) +
              '\n' +
              TempKlines
                .map((row) => {
                  return keys
                    .map((k) => {
                      let cell =
                        row[k] === null || row[k] === undefined ? '' : row[k];
                      cell =
                        cell instanceof Date
                          ? cell.toLocaleString()
                          : cell.toString().replace(/"/g, '""');
                      if (cell.search(/("|,|\n)/g) >= 0) {
                        cell = `"${cell}"`;
                      }
                      return cell;
                    })
                    .join(separator);
                })
                .join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) {
              // IE 10+
              navigator.msSaveBlob(blob, btcSymbol);
            } else {
              const link = document.createElement('a');
              if (link.download !== undefined) {
                // Browsers that support HTML5 download attribute
                const url = URL.createObjectURL(blob);
                console.log(url);
                link.setAttribute('href', url);
                link.setAttribute('download', btcSymbol + '_AROON' + '.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }

            /********************************************************* */


          };

          ourRequestklines.send();

        }
        // });
        console.log('******************************************** END ***********************************************************');
      };
      ourRequest24hTicker.send();


    });

    //   }

    // }
  }


}
