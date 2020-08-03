import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { sha256 } from 'js-sha256';
import { CommonService } from './common.service';
import { iif } from 'rxjs';
import { createSign } from 'crypto';

@Injectable({
    providedIn: 'root'
  })

export class PriceForKline
{
    FiyatService()
    {
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
          const algorithmtype = 'MADongu';
          const endPointklines = binanceUrl + 'klines';
          let btcSymbol = "CTSIBTC";
          const getFullYear = new Date().getFullYear();
        const getMonth = new Date().getMonth();
        const getDay = new Date().getDate();
        const getHours = new Date().getHours();
                                                        if(btcSymbol === "CTSIBTC")
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

                                                                    console.log("CTSI Open time = "+modelklinesMA.openTime + " Avg price = "+modelklinesMA.avgPrice);
                                                                    tempklinesMA.push(modelklinesMA);
                                                                    //console.log("Symbol = "+btcSymbol+" Ma7 = "+modelklinesMA.ma7 + " Ma25 = "+modelklinesMA.ma25 +  " Ma99 = "+modelklinesMA.ma99 + "Open time ="+modelklinesMA.openTime + " Kontrol Denklemi sağlanan "+ kontrol_denklemi[7]);
                                                                })
                                                            };ourRequestklines.send()
                                                        }                                                                
                                        
    }
}
