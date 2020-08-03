import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { sha256 } from 'js-sha256';
import { CommonService } from './common.service';
import { iif } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })

  export class MaDonguService {

    keys = {
        akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
        skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
      };
    
      askeys = {
        akey: 'rUzweZSf7gB8D4idYJiT1iM1MlB1srHFCnNB3EJEihvrhtJuijJTF9BeYQFwACrx',
        skey: 'xiJ3yGuFYQgLhaqYFe18YEvijfZyUrtnjv3CHVXO85Gw59PZLTGRh1mD1HrnqCCb'
      };
      burl = 'https://api.binance.com';

      MaDonguBuyCoin()
      {
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
          const algorithmtype = 'MADongu';
          let time = 0;
          let gecicibalance = 0;
          const endPointTime = binanceUrl + 'time';
          const ourRequestTime = new XMLHttpRequest();
          ourRequestTime.open('GET', endPointTime, false);
          ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);
          ourRequestTime.onload = function () {
            
            const ourDataTime = JSON.parse(ourRequestTime.responseText);
            time = ourDataTime.serverTime;
            console.log("Time interval = "+time);    

            const dataQueryStringAccount = 'timestamp=' + time;

            const signatureAccount = sha256.hmac(asilkeys.skey, dataQueryStringAccount);

            const endPointAccountInfo = binanceUrl + 'account';
            const urlAccountInfo = endPointAccountInfo + '?' + dataQueryStringAccount + '&signature=' + signatureAccount;
            const ourRequestAccountInfo = new XMLHttpRequest();

            ourRequestAccountInfo.open('GET', urlAccountInfo, false);
            ourRequestAccountInfo.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

            // tslint:disable-next-line: only-arrow-functions
            ourRequestAccountInfo.onload = function () {
                let myBalance = 0.00000001;
                const accountBalance = [];
                const tempAccountBalance = [];
                const accountInfo = JSON.parse(ourRequestAccountInfo.responseText);
                let countBigCoin = 0;
                accountInfo.balances.forEach(element => {
                if (element.free > 0) {
                    accountBalance.push(element);
                    console.log(element);
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
                          const elementTotalBtc = element.free * coinPrice;
                          console.log("Toplam BTC = " +elementTotalBtc);
                          if(elementTotalBtc > 0)
                            gecicibalance += elementTotalBtc;
          
          
          
                          if (elementTotalBtc > 0.0001) {
                            countBigCoin++;
          
                            tempAccountBalance.push(element);

                            const canBuyableCoinCount =  10; //(1 btc) - 1 bnb

                            const minBuyTrade = 0.0001; // (  btc)

                            const coinCount = countBigCoin; //accountBalance.length;


                            if (coinCount >= canBuyableCoinCount) {// alma
                            console.log('1. ====> ' + new Date() + ' - coinCount : ' + coinCount + ' - canBuyableCoinCount : ' + canBuyableCoinCount);
                            } else {
                            accountBalance.forEach(element => {
                                if (element.asset.includes('BTC')) {
                                myBalance = Number(parseFloat(String(element.free)).toFixed(10));
                                }
                            });

                            let buyCoinCount = Number(canBuyableCoinCount - coinCount);

                            console.log('2. ====> ' + new Date() + ' - count : ' + coinCount + '  buyCoinCount : '
                                + buyCoinCount + '  - my Btc Total Balance : ' + myBalance);

                            let myDividedBalance = 0;

                            /*** For döngüsü  Alınabileek*/
                            for (let index = buyCoinCount; index > 1; index--) {
                                myDividedBalance = Number(parseFloat(String(myBalance / index)).toFixed(10));
                                console.log('3. ====> ' + new Date() + '  - myDividedBalance : ' + myDividedBalance);
                                let continueToDivide = 1;
                                if (continueToDivide > 0) {
                                if (myDividedBalance >= minBuyTrade) // Alınabilecek sayı AL
                                {
                                    buyCoinCount = index;
                                    console.log('4. ====> ' + new Date() + ' - buyCoinCount : '
                                    + buyCoinCount + '  - myDividedBalance 2 : ' + myDividedBalance);

                                    continueToDivide = 0;
                                    break;

                                }
                                }


                            }
                            const endPoint24hr = binanceUrl + 'ticker/24hr';
                            const ourRequest24hr = new XMLHttpRequest();
                  
                            ourRequest24hr.open('GET', endPoint24hr, false);
                            ourRequest24hr.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);
                  
                            // tslint:disable-next-line: only-arrow-functions
                            ourRequest24hr.onload = function () {
                              const ourData24hr = JSON.parse(ourRequest24hr.responseText);
                  
                              // const orderedList24hr =
                              const orderedList24hr =
                                ourData24hr.slice().sort((a, b) => Number(a.priceChangePercent) - Number(b.priceChangePercent));
                            
                                let ii = 0;
                                for (let index = 0; index < buyCoinCount; index++) {


                                    orderedList24hr.forEach(element24hr => {
                    
                                    const btcSymbol = element24hr.symbol;
                                        if (btcSymbol.endsWith('BTC')) {
                  
                                            if (element24hr.priceChangePercent > 0) {
                        
                                            let subSymbol = btcSymbol;
                                            subSymbol = subSymbol.replace('BTC', '');
                  
                                     // if (canBuyableCoinCount >=  accountBalance.length)
                                                if (canBuyableCoinCount >= coinCount  ) {
                                                    if ((!accountBalance.some(e => e.asset === subSymbol))) {
                  
                                          // tslint:disable-next-line: max-line-length
                  
                                                        ii++;
                  
                                          // Alış For döngüsü başlangıç
                  
                  
                                          // klines
                                                        const endPointklines = binanceUrl + 'klines';
                                
                                                        const getFullYear = new Date().getFullYear();
                                                        const getMonth = new Date().getMonth();
                                                        const getDay = new Date().getDate();
                                                        const getHours = new Date().getHours();
                                                        if(btcSymbol === "HCBTC")
                                                        {

                                    
                                                            const startTime = new Date(getFullYear, getMonth, getDay, getHours - 200, 0, 0, 0).getTime();
                                                            const endTime = new Date(getFullYear, getMonth, getDay, getHours, -1, 0, 0).getTime();
                                    
                                                        /* console.log('5. ====> ' + 'buy MA -- c' + ii
                                                                + 'COIN : ' + btcSymbol + ' percentage : ' + element24hr.priceChangePercent
                                                                + '  startTime : ' + new Date(startTime) + 'endTime : ' + new Date(endTime));
                                                            */
                                    
                                                            const dataQueryStringklines = 'symbol=' + btcSymbol + '&' + 'interval=' + '1h'
                                                                + '&' + 'startTime=' + startTime + '&' + 'endTime=' + endTime;
                                    
                                    
                                    
                                                            const urlklines = endPointklines + '?' + dataQueryStringklines;
                                                            const ourRequestklines = new XMLHttpRequest();
                                    
                                                            ourRequestklines.open('GET', urlklines, false);
                                                            ourRequestklines.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);
                                                            ourRequestklines.onload = function () {

                                                            const ourDataKlineList = JSON.parse(ourRequestklines.responseText);
                                                            const tempklinesMA = [];
                                
                                                            const ma7Array = [];
                                                            const ma25Array = [];
                                                            const ma99Array = [];
                                                            const kontrol_denklemi = [10];
                                                            kontrol_denklemi[0] = 0;
                                                            kontrol_denklemi[1] = 0;
                                                            kontrol_denklemi[2] = 0;
                                                            kontrol_denklemi[3] = 0;
                                                            kontrol_denklemi[4] = 0;
                                                            kontrol_denklemi[5] = 0;
                                                            kontrol_denklemi[6] = 0;
                                                            kontrol_denklemi[7] = 0;
                                                            let onceki = 0;
                                                            let kontrol = 0;
                                                            let _ma7 = 0;
                                                            let _ma25 = 0;
                                                            let _ma99 = 0;
                                                            let tursayisi = 0;
                                
                                                            let ma7T = 0;
                                                            let ma25T = 0;
                                                            let ma99T = 0;
                                
                                                            const ma7Len = 7;
                                                            const ma25Len = 25;
                                                            const ma99Len = 99;
                                
                                                            let closeDifOpen = 0;
                                                            let highDifLow = 0;
                    
                    
                                                            ourDataKlineList.forEach(klineElement => {
                    
                                                            closeDifOpen = Math.abs(klineElement[4] - klineElement[1]);
                                                            highDifLow = Math.abs(klineElement[2] - klineElement[3]);
                                
                                                            // tslint:disable-next-line: max-line-length
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
                                                                    
                                                                    if(_ma99 != 0 && _ma25 != 0)
                                                                    {
                                                                        onceki = kontrol;
                                                                        console.log("Onceki değer = "+onceki);
                                                                        if(_ma99 < _ma7  && _ma7<_ma25) // _ma25 > _ma7 > _ma99 13 kez
                                                                        {
                                                                            kontrol = 1;
                                                                        }
                                                                        else if(_ma99 < _ma25 && _ma25 < _ma7) // ma7 > ma25 > ma99
                                                                        {
                                                                            kontrol = 2;
                                                                        }
                                                                        else if(_ma7 < _ma99  && _ma99 < _ma25) // ma25 > ma99 > ma7
                                                                            kontrol = 3;
                                                                        else if(_ma7 < _ma25 && _ma25 < _ma99) // ma99 > ma25 > ma7
                                                                            kontrol = 4;
                                                                        else if(_ma25 < _ma7 && _ma7 < _ma99) // ma99 > ma7 > ma25
                                                                            kontrol = 5;
                                                                        else if(_ma25 < _ma99 && _ma99 < _ma7) // ma7 > ma99 > ma25
                                                                            kontrol = 6;
                                                                        else 
                                                                            kontrol = 7;
                                                                        kontrol_denklemi[kontrol] += 1;
                                                                    }
                                                                    const modelklinesMA = {
                                                                        isSpec: Number(closeDifOpen - highDifLow),
                                                                        openTime: new Date(klineElement[0]).toLocaleString(),
                                                                        closeTime: new Date(klineElement[6]).toLocaleString(),
                                                                        openPrice: klineElement[1],
                                                                        closePrice: klineElement[4],
                                                                        avgPrice: _avgPrice,
                                                                        ma7: _ma7,
                                                                        ma25: _ma25,
                                                                        ma99: _ma99,
                                                                    };
                                                                    if((onceki === 2 && kontrol === 1) || (onceki === 1 && kontrol ===3) || (onceki === 3 && kontrol ===4) || (onceki ===4 && kontrol ===5) || (onceki === 5 && kontrol === 4) || (onceki === 5 &&  kontrol ===6) || (onceki === 6 && kontrol === 2) || (onceki === 1 && kontrol ===2) || (onceki === kontrol))
                                                                    {
                                                                        console.log("true");
                                                                    }
                                                                    else
                                                                        console.log("false");
                                                                    if((onceki === 2 && kontrol === 1))
                                                                    {
                                                                        tursayisi += 1;
                                                                        console.log("Opentime = "+modelklinesMA.openTime + "Tur Sayısı = "+tursayisi);
                                                                    }
                                                                    //console.log("CTSI Open time = "+modelklinesMA.openTime + " Avg price = "+modelklinesMA.avgPrice);
                                                                    tempklinesMA.push(modelklinesMA);
                                                                    console.log("Symbol = "+btcSymbol+" Ma7 = "+modelklinesMA.ma7 + " Ma25 = "+modelklinesMA.ma25 +  " Ma99 = "+modelklinesMA.ma99 + "Open time ="+modelklinesMA.openTime + " Kontrol Denklemi sağlanan "+ kontrol_denklemi[7]);
                                                                    
                                        
                                                                });
                                                            };ourRequestklines.send();
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            };ourRequest24hr.send();
                        }
                    }

          
                 };ourRequestTicker.send();

                }
                console.log("Toplam Bakiye = "+gecicibalance);
            }
            });
        };ourRequestAccountInfo.send()
        
      };ourRequestTime.send();

  }
}

