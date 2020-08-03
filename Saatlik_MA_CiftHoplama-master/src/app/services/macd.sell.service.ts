import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { sha256 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})

export class MacdSellService {



    static MaSellCoin(USDTsymbol:string,free:string) {

        const acc = 'asil';

        const binanceUrl = 'https://api.binance.com/api/v3/';

        const asilkeys = {
        akey: 'QDSTj2uPVkXtCIohYvN9EFP7IcHL46YGYzlaKzneb6U3xs3wulGgDPsUoEEfxOcT',
        skey: 'NdWpbzswwCJPDDlx1B99mVst1BFGGTn50ujeW7H1xEUqdvlzuiCVDUMFtx1klHXm'
        };

        const dilberkeys = {
        akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
        skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
        };



        // bakiye çek
        // coinleri gez
        // USDT kontrolü yap // aynı coin olmasın
        // satis kontrolü ma yap
        // al
                                // SATIŞ İŞLEMİ BAŞLANGIÇ
                        /******************************************************************* */

                        const endPointTime = binanceUrl + 'time';
                        const ourRequestTime = new XMLHttpRequest();

                        ourRequestTime.open('GET', endPointTime, false);
                        ourRequestTime.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                        let time = 0;
                        // tslint:disable-next-line: only-arrow-functions
                        ourRequestTime.onload = function () {
                            const ourDataTime = JSON.parse(ourRequestTime.responseText);
                            time = ourDataTime.serverTime;
                            free = Math.floor(Number(free)).toPrecision(8);

                            /****************************************************** */

                            const endPointOrder = binanceUrl + 'order';

                            const dataQueryStringSell = 'symbol=' + USDTsymbol + '&type=market&side=SELL&quantity=' + free
                            + '&timestamp=' + time;

                            const ourRequestSell = new XMLHttpRequest();

                            const signatureStringSell = sha256.hmac(asilkeys.skey, dataQueryStringSell);

                            const urlSell = endPointOrder + '?' + dataQueryStringSell + '&signature=' + signatureStringSell;
                            console.log('USDT = '+USDTsymbol+ ' adlı coinden '+free+' adet satıldı...');
                            
                            ourRequestSell.open('POST', urlSell, false);
                            ourRequestSell.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);

                            ourRequestSell.onload = function () {
                            const ourDataSell = JSON.parse(ourRequestSell.responseText);
                            console.log('1h ourDataSell');

                            console.log(ourDataSell);
                            };
                            
                            ourRequestSell.send();
                        };
                        ourRequestTime.send();
                        // SATIŞ SON

        


    }

    static MacdBuyCoin(USDTsymbol:string,free:Number)
    { 
        let kontrol = 0;
        const BannedCoins = ['DOGEUSDT','DREPUSDT','ERPUSDT','HOTUSDT','POEUSDT','SCUSDT','TNBUSDT','VETUSDT','XVGUSDT','ONEUSDT','ERDUSDT','CNDUSDT','YOYOUSDT','ANKRUSDT','MTHUSDT','FUNUSDT','CELRUSDT','MDTUSDT','DNTUSDT','IOTXUSDT','MBLUSDT','STMXUSDT','TROYUSDT','PHBUSDT','FUELUSDT','CDTUSDT','MITHUSDT','XVGUSDT','IOSTUSDT','QKCUSDT','FTMUSDT','TFUELUSDT','DOCKUSDT','GTOUSDT','WPRUSDT','TCTUSDT','SNMUSDT','OSTUSDT','REQUSDT'];
        for(let index=0;index<BannedCoins.length;index++)
        {
            if(BannedCoins[index] === USDTsymbol)
            {
                kontrol = 1;
                break;
            }
        }
        const binanceUrl = 'https://api.binance.com/api/v3/';

        const asilkeys = {
            akey: 'QDSTj2uPVkXtCIohYvN9EFP7IcHL46YGYzlaKzneb6U3xs3wulGgDPsUoEEfxOcT',
            skey: 'NdWpbzswwCJPDDlx1B99mVst1BFGGTn50ujeW7H1xEUqdvlzuiCVDUMFtx1klHXm'
          };
      
          const dilberkeys = {
            akey: 'wDStajeUKP3Ysak4DxlWkTTwHw2J88NtmuNPdltbhiyKdaNLcoeabUl5ERKXOPb2',
            skey: 'mMFGESXwzpsEannoKKXhJrEaWPicvt573IOKOYOdT20WceGKf9kBgnlugYYa1DOA'
          };
      
      
          /******************************************************************** */
          let time = 0;
          const endPointTime = 'https://api.binance.com/api/v3/time';
          const ourRequestTime = new XMLHttpRequest();
      
          ourRequestTime.open('GET', endPointTime, true);
          ourRequestTime.setRequestHeader('X-MBX-APIKEY', dilberkeys.akey);
      
          if(kontrol == 0)
          {
          // tslint:disable-next-line: only-arrow-functions
          ourRequestTime.onload = function () {
      
            const ourDataTime = JSON.parse(ourRequestTime.responseText);
            time = ourDataTime.serverTime;
      
            const dataQueryStringAccount = 'timestamp=' + time + '&symbol=' + USDTsymbol;
      
            const signatureAccount = sha256.hmac(dilberkeys.skey, dataQueryStringAccount);
                                            // ALIM İŞLEMİ BAŞLANGIÇ
                                /******************************************************************* */

                                // Anlık price listesi

                                const endPointTicker = binanceUrl + 'ticker/price';
                                const ourRequestTicker = new XMLHttpRequest();


                                const dataQueryString = '&symbol=' + USDTsymbol;
                                const urlTicker = endPointTicker + '?' + dataQueryString;

                                ourRequestTicker.open('GET', urlTicker, false);
                                ourRequestTicker.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                // tslint:disable-next-line: only-arrow-functions
                                ourRequestTicker.onload = function () {

                                  let buyQuantity = 0;

                                  const ourDataTicker = JSON.parse(ourRequestTicker.responseText);
                                  console.log('13. ====> ' + 'ourDataTicker : ');
                                  console.log(ourDataTicker);
                                  const coinPrice = ourDataTicker.price;

                                  const tempQuantity = Number(free) / coinPrice;

                                  const quantity = Math.floor(tempQuantity);
                                  console.log('14. ====> ' + 'tempQuantity : ' + tempQuantity
                                    + ' quantity : ' + quantity + ' coinPrice : ' + coinPrice);

                                  /************************************** */


                                  let timeBuy = 0;
                                  const endPointTime = binanceUrl + 'time';
                                  const ourRequestTimeBuy = new XMLHttpRequest();

                                  ourRequestTimeBuy.open('GET', endPointTime, false);
                                  // tslint:disable-next-line: max-line-length
                                  ourRequestTimeBuy.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                  // tslint:disable-next-line: only-arrow-functions
                                  ourRequestTimeBuy.onload = function () {

                                    // let geciciDeger = 100000000;
                                    const ourDataTime = JSON.parse(ourRequestTimeBuy.responseText);
                                    timeBuy = ourDataTime.serverTime;

                                    const endPointBuy = binanceUrl + 'order';
                                    console.log("Free = "+free);
                                    const dataQueryStringBuy = 'symbol=' + USDTsymbol + '&type=market&side=buy&quantity='
                                      + free + '&timestamp=' + timeBuy;

                                    // tslint:disable-next-line: max-line-length
                                    const signatureBuy = sha256.hmac(asilkeys.skey, dataQueryStringBuy);

                                    const ourRequestBuy = new XMLHttpRequest();

                                    const urlBuy = endPointBuy + '?' + dataQueryStringBuy + '&signature=' + signatureBuy;


                                    const tempBuyQuantity = quantity * coinPrice;
                                    buyQuantity = tempBuyQuantity;
                                    console.log('15. ====> ' + '1H BUY Ma, quantity --> ' + quantity + '-***-' + 'coinPrice --> '
                                      + coinPrice + '-***-' + 'tempBuyQuantity --> ' + tempBuyQuantity);

                                    console.log('USDT ='+USDTsymbol+' Quantity = '+free+' Alım kararı başlatıldı...');
                                    
                                    if (free > 0.0001) {

                                      ourRequestBuy.open('post', urlBuy, false);
                                      ourRequestBuy.setRequestHeader('X-MBX-APIKEY', asilkeys.akey);


                                      // // tslint:disable-next-line: only-arrow-functions
                                      ourRequestBuy.onload = function () {
                                        const ourdatabuy = JSON.parse(ourRequestBuy.responseText);
                                        console.log('16. ====> ' + 'ourdatabuy : ');
                                        console.log(ourdatabuy);
                                      };
                                      ourRequestBuy.send();

                                    }

                                  };
                                  ourRequestTimeBuy.send();
                                };
                                ourRequestTicker.send();
      
          };
          ourRequestTime.send();      
        }
    }
}