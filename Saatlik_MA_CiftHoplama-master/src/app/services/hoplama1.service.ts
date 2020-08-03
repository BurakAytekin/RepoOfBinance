import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { sha256 } from 'js-sha256';


@Injectable({
  providedIn: 'root'
})
export class HoplamaService1 {

  constructor() { }
  keys = {
    akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
    skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
  };

  askeys = {
    akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
    skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
  };

  burl = 'https://api.binance.com';


  HoplamaSellCoin() {
    const binanceUrl = 'https://api.binance.com/api/v3/';

    const asilkeys = {
      akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
      skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
    };

    const dilberkeys = {
      akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
      skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
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


      //let - var (değişebilir değerler) -const (değişmeyen değerler için)
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

          if (!element.asset.includes('BTC') && element.free > 0) {
            accountBalance.push(element);
          }

        });

        // accountBalance.forEach(element => {

        // klines start
        const btcSymbol = 'BTC' + 'USDT';  // element.asset + 'BTC';
        const endPointklines = binanceUrl + 'klines';

        const getFullYear = new Date().getFullYear();
        const getMonth = new Date().getMonth();
        const getDay = new Date().getDate();
        const getHours = new Date().getHours();


        const startTime = new Date(getFullYear, getMonth, getDay, getHours - 24, 0, 0, 0).getTime();
        const endTime = new Date(getFullYear, getMonth, getDay, getHours, -1, 0, 0).getTime();
        const dataQueryStringklines = 'symbol=' + btcSymbol + '&' + 'interval=' + '1h'
          + '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime;

        console.log(dataQueryStringklines); // account balance

        const urlklines = endPointklines + '?' + dataQueryStringklines;
        const ourRequestklines = new XMLHttpRequest();

        ourRequestklines.open('GET', urlklines, false);
        ourRequestklines.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);
        ourRequestklines.onload = function () {

          const ourDataKlineList = JSON.parse(ourRequestklines.responseText);

          const tempklines24h = [];
          const tempklines5h = [];
          let index = 0;
          ourDataKlineList.forEach(klineElement => {



            const AvgPrice = Number(parseFloat(String((Number(klineElement[2]) + Number(klineElement[3])) / 2)).toFixed(10));

            const Cdr = Number(parseFloat(String((Number(klineElement[2]) - Number(klineElement[3])) * 100
              / Number(klineElement[3]))).toFixed(10));


            const modelklines24h = {
              timeIndex24h: index,
              hour: new Date(klineElement[0]).getHours(),
              openTime: new Date(klineElement[0]).toLocaleString(),
              closeTime: new Date(klineElement[6]).toLocaleString(),
              highPrice: klineElement[2],
              lowPrice: klineElement[3],
              avgPrice: AvgPrice,
              cdr: Cdr,
            };

            tempklines24h.push(modelklines24h);

            if (index >= 19) {

              const modelklines5h = {
                timeIndex24h: index,
                timeIndex5h: index - 19,
                hour: new Date(klineElement[0]).getHours(),
                openTime: new Date(klineElement[0]).toLocaleString(),
                closeTime: new Date(klineElement[6]).toLocaleString(),
                highPrice: klineElement[2],
                lowPrice: klineElement[3],
                avgPrice: AvgPrice,
                cdr: Cdr,
              };
              tempklines5h.push(modelklines5h);

            }

            index = index + 1;

          });
          console.log(' ******************************************************** ');
          console.log(' tempklines24h ==> ');
          console.log(tempklines24h); // tempklines24h
          console.log(' ******************************************************** ');
          console.log(' tempklines5h ==> ');
          console.log(tempklines5h); // tempklines5h
          console.log(' ******************************************************** ');


          /*************** sabit başlangıç noktası hesaplama *****************************************/
          //max cdr  Item
          const cdrItem = tempklines24h.reduce(function (prev, current) {
            return (prev.cdr > current.cdr) ? prev : current;
          });
          console.log(' cdrItem ==> ');
          console.log(cdrItem);
          console.log(' ******************************************************** ');
          const sbnIndex24h = cdrItem.timeIndex24h - 1;
          var sbnItem = tempklines24h.filter(function (item) { return item.timeIndex24h === sbnIndex24h; });


          // Son 5 saatlik değişim hesaplama

          let s5sd = 0;
          let highPriceItem = 0;
          let lowPriceItem = 0;
          let tempArrayForS5sd = [];


          if (sbnItem["timeIndex24h"] < 5) {

            // önceki 5 saati çek mum grafiklerinden s5sd hesapla
            console.log('önceki 5 saati çek mum grafiklerinden s5sd hesaplanacak ');
            console.log(' ******************************************************** ');



            console.log(' ******************************************************** ');

          } else {



            for (let xx = sbnIndex24h - 1; xx >= 0; xx--) {
              const element = tempklines24h[xx];
              tempArrayForS5sd.push(element);

            }

            // get min low item
            lowPriceItem = tempArrayForS5sd.reduce(function (prev, current) {
              return (prev.lowPrice < current.lowPrice) ? prev : current;
            });

            // get max high item
            highPriceItem = tempArrayForS5sd.reduce(function (prev, current) {
              return (prev.highPrice > current.highPrice) ? prev : current;
            });


            // get last 5 hours s5sd
            s5sd = Number(parseFloat(String((Number(highPriceItem["highPrice"]) - Number(lowPriceItem["lowPrice"])) * 100
              / Number(lowPriceItem["lowPrice"]))).toFixed(10));


          }

          console.log(' lowPriceItem 5h ==> ');
          console.log(lowPriceItem);
          console.log(' ******************************************************** ');
          console.log(' highPriceItem 5h ==> ');
          console.log(highPriceItem);
          console.log(' ******************************************************** ');
          console.log(' s5sd 5h ==> ');
          console.log(s5sd);
          console.log(' ******************************************************** ');

          let runCiftHoplama = false;

          // s5sd 1 den küçük veya 4 ten büyükse
          if (s5sd < 1 || s5sd > 4) {


            // Buraya bakılacak
            console.log('s5sd < 1 || s5sd > 4 ');
            console.log(' ******************************************************** ');

            // get min low item 24h
            const lowPriceItem24h = tempklines24h.reduce(function (prev, current) {
              return (prev.lowPrice < current.lowPrice) ? prev : current;
            });

            // get max high item 24h
            const highPriceItem24h = tempklines24h.reduce(function (prev, current) {
              return (prev.highPrice > current.highPrice) ? prev : current;
            });


            // get last 24 hours s24sd
            const s24sd = Number(parseFloat(String((Number(highPriceItem24h.highPrice) - Number(lowPriceItem24h.lowPrice)) * 100
              / Number(lowPriceItem24h.lowPrice))).toFixed(10));

            console.log(' lowPriceItem24h 24h ==> ');
            console.log(lowPriceItem24h);
            console.log(' ******************************************************** ');
            console.log(' highPriceItem24h 24h ==> ');
            console.log(highPriceItem24h);
            console.log(' s24sd 24h ==> ');
            console.log(s24sd);
            console.log(' ******************************************************** ');


            if (s24sd > 1 && s24sd < 4) {
              console.log('s24sd > 1 && s24sd < 4 ');
              console.log(' ******************************************************** ');

              runCiftHoplama = true;
            } else {
              runCiftHoplama = false;
              console.log('s24sd<  1 || s24sd > 4 ');
              console.log(' ******************************************************** ');
            }


          } else {
            runCiftHoplama = true;
          }

          runCiftHoplama = true;

          console.log('runCiftHoplama : ' + runCiftHoplama);
          console.log('******************************************************** ');


          if (runCiftHoplama) {

            let isLowPriceRising = false;
            // tanımlanacak olan hesaplama dizisinde işlemler yapılmalı dizi güncellenecek


            // son 3 saatteki low price artışta mı?   - cdr mum dahil   cdr > sbn > sbn-1
            if ((tempklines24h[sbnIndex24h - 1].lowPrice < tempklines24h[sbnIndex24h].lowPrice)
              && (tempklines24h[sbnIndex24h].lowPrice < tempklines24h[sbnIndex24h + 1].lowPrice)) {

              isLowPriceRising = true;
              console.log(' isLowPriceRising ==> true');
              console.log(' ******************************************************** ');


            } else {

              isLowPriceRising = false;
              console.log(' isLowPriceRising ==> false');
              console.log(' ******************************************************** ');

            }


            if (isLowPriceRising) {

              // get max Cdr 24h
              const maxCrdItem24h = tempklines24h.reduce(function (prev, current) {
                return (prev.cdr > current.cdr) ? prev : current;
              });

              // bunun bir öncesi olması gerekir
              let sbnItem24h = maxCrdItem24h; // 24h içinde sbn noktasını aldım.

              console.log(' sbnItem24h ==> ');
              console.log(sbnItem24h);
              console.log(' ******************************************************** ');

              const sbnItem24hIndexHour = sbnItem24h.timeIndex24h; // get sbn 24h hour

              if (sbnItem24hIndexHour < 19) { // en az 4 tan hesaplamalı
                const tempklines24hLength = tempklines24h.length;

                const startPrice = sbnItem24h.lowPrice;   // sbn Price
                const finalPrice = tempklines24h[tempklines24hLength - 1].highPrice; // finalPrice

                console.log('startPrice : ' + startPrice);
                console.log('finalPrice : ' + finalPrice);

                console.log('******************************************************** ');

                const tanArray = [];


                for (let j = sbnItem24hIndexHour + 1; j < tempklines24hLength; j++) {

                  const tanElement = Number(parseFloat(String((tempklines24h[j].highPrice - startPrice) /
                    (tempklines24h[j].timeIndex24h - sbnItem24hIndexHour))).toFixed(10));

                  const modeltanElement = {

                    timeIndex24h: index,
                    tan: tanElement

                  };
                  tanArray.push(modeltanElement);

                }

                console.log('tanArray : ');
                console.log(tanArray);
                console.log('******************************************************** ');

                // tan(4) >  tan(3) sağlaması gereken tek koşul


                let sellModeOn = false;


                for (let k = 0; k < tanArray.length - 1; k++) {
                  if (tanArray[k].tan > tanArray[k + 1].tan &&  // tan(1) > tan(2) > tan(3)  and  tan(4) >  tan(3)
                    tanArray[k + 1].tan > tanArray[k + 2].tan &&
                    tanArray[k + 3].tan > tanArray[k + 2].tan) {

                    sellModeOn = true;

                  } else {
                    sellModeOn = false;
                  }

                }

                console.log('sellModeOn : ' + sellModeOn);


                if (sellModeOn) {

                  // Gauss
                  // gauss hesaplama kare matris olmalı

                  // const A = [
                  //   [1, tempklines5h[0].hour, tempklines5h[0].hour * tempklines5h[0].hour],
                  //   [1, tempklines5h[1].hour, tempklines5h[1].hour * tempklines5h[1].hour],
                  //   [1, tempklines5h[2].hour, tempklines5h[2].hour * tempklines5h[2].hour],
                  // ];



                  // const b = [
                  //   tempklines5h[0].avgPrice,
                  //   tempklines5h[1].avgPrice,
                  //   tempklines5h[2].avgPrice,

                  // ];

                  // print(A, ' A ');
                  // print(b, ' b ');

                  // const x = solve(A, b);

                  // print(x, ' x ');
                  // /***************************************************************** */

                  // function print(M, msg) {
                  //   console.log('======' + msg + '=========')
                  //   // tslint:disable-next-line: prefer-for-of
                  //   for (let k = 0; k < M.length; ++k) {
                  //     console.log(M[k]);
                  //   }
                  //   console.log('==========================')
                  // }

                  // // köşegenleştirme
                  // function diagonalize(M) {
                  //   const m = M.length;
                  //   const n = M[0].length;
                  //   for (let k = 0; k < Math.min(m, n); ++k) {
                  //     // Find the k-th pivot
                  //     const i_max = findPivot(M, k);
                  //     // if (A[i_max, k] === 0) {
                  //     //   return 'matrix is singular';

                  //     // }

                  //     swap_rows(M, k, i_max);
                  //     // Do for all rows below pivot
                  //     for (let i = k + 1; i < m; ++i) {
                  //       // Do for all remaining elements in current row:
                  //       const c = A[i][k] / A[k][k];
                  //       for (let j = k + 1; j < n; ++j) {
                  //         A[i][j] = A[i][j] - A[k][j] * c;
                  //       }
                  //       // Fill lower triangular matrix with zeros
                  //       A[i][k] = 0;
                  //     }
                  //   }
                  // }

                  // //
                  // function findPivot(M, k) {
                  //   let i_max = k;
                  //   for (let i = k + 1; i < M.length; ++i) {
                  //     if (Math.abs(M[i][k]) > Math.abs(M[i_max][k])) {
                  //       i_max = i;
                  //     }
                  //   }
                  //   return i_max;
                  // }

                  // function swap_rows(M, i_max, k) {
                  //   if (i_max !== k) {
                  //     const temp = A[i_max];
                  //     A[i_max] = A[k];
                  //     A[k] = temp;
                  //   }
                  // }

                  // function makeM(A, b) {
                  //   for (let i = 0; i < A.length; ++i) {
                  //     A[i].push(b[i]);
                  //   }
                  // }

                  // function substitute(M) {
                  //   const m = M.length;
                  //   for (let i = m - 1; i >= 0; --i) {
                  //     const sx = M[i][m] / M[i][i];
                  //     for (let j = i - 1; j >= 0; --j) {
                  //       M[j][m] -= sx * M[j][i];
                  //       M[j][i] = 0;
                  //     }
                  //     M[i][m] = sx;
                  //     M[i][i] = 1;
                  //   }
                  // }

                  // function extractX(M) {
                  //   const ex = [];
                  //   const m = A.length;
                  //   const n = A[0].length;
                  //   for (let i = 0; i < m; ++i) {
                  //     ex.push(A[i][n - 1]);
                  //   }
                  //   return ex;
                  // }

                  // function solve(A, b) {
                  //   // print(A, "A");
                  //   makeM(A, b);
                  //   // print(A, "M");
                  //   diagonalize(A);
                  //   // print(A, "diag");
                  //   substitute(A);
                  //   // print(A, "subst");
                  //   const xx = extractX(A);
                  //   // print(x, "x");
                  //   return xx;
                  // }

                  /***************************************************************** */


                }


              }






            }

          }


        };

        ourRequestklines.send();

        //  });

      };
      ourRequestAccountInfo.send();

    };
    ourRequestTime.send();

  }
}
