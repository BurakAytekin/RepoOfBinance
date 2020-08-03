import { Injectable } from '@angular/core';
import { BinanceUrl } from '../utils/binance-url';
import { BinanceKey } from '../utils/binance-key';
import { sha256 } from 'js-sha256';

@Injectable({
    providedIn: 'root'
  })
export class RsiMacdService {
  
    constructor() {
  
    }

    RsiMacdCalculate()
    {
        const SpeculativeCoins = [
            'DOGEBTC', 'DREPBTC', 'ERPBTC', 'HOTBTC', 'POEBTC',
            'SCBTC', 'TNBBTC', 'VETBTC', 'XVGBTC', 'ONEBTC',
            'ERDBTC', 'CNDBTC', 'YOYOBTC', 'ANKRBTC', 'MTHBTC',
            'FUNBTC', 'CELRBTC', 'MDTBTC', 'DNTBTC', 'IOTXBTC',
            'MBLBTC', 'STMXBTC', 'TROYBTC', 'PHBBTC', 'FUELBTC',
            'CDTBTC', 'MITHBTC', 'XVGBTC', 'IOSTBTC', 'QKCBTC',
            'FTMBTC', 'TFUELBTC', 'DOCKBTC', 'GTOBTC', 'WPRBTC',
            'TCTBTC', 'SNMBTC', 'OSTBTC', 'REQBTC', 'VTHOBTC'];
      
          const ourRequest24hTicker = new XMLHttpRequest();
          ourRequest24hTicker.open('GET', BinanceUrl.ticker24hrUrl, true);
          ourRequest24hTicker.setRequestHeader('X-MBX-APIKEY', BinanceKey.asilkeys.akey);
      
          const hourStart = 500;
          const hourEnd = 0;
          let coinIndex = 0;
      
          ourRequest24hTicker.onload = function () {
      
      
      
            const ourData24hTicker = JSON.parse(ourRequest24hTicker.responseText);
      
            const commissionCoinType = 'BNBBTC';
            const coinTradeType = 'BTC';
            let countBigCoin = 0;
            let countofbuyable = 0;
            let coinPrice = 0;
            const constRisingCoinCount = 50;
            const canBuyableCoinCount = 3;
      
            // const allCoinCount = ourData24hTicker.filter(value => value.priceChangePercent > 0).length;
           /* const risingCoinCount = ourData24hTicker.filter(value => value.priceChangePercent > 0 && value.symbol.endsWith(coinTradeType)).length;
      
      
            let canBuyableCoinCount = 8;
      
      
            if (risingCoinCount > constRisingCoinCount) {
              canBuyableCoinCount = 6;
      
            }
            */
      
      
            ourData24hTicker.forEach(elementTicker24hr => {
              coinIndex++;
              const btcSymbol = elementTicker24hr.symbol;
              const subSymbol = btcSymbol.replace(coinTradeType, '');
      
              const isExistSpecCoin = SpeculativeCoins.filter(function (item) {
                return item === btcSymbol;
              });
      
      
              if (btcSymbol.endsWith(coinTradeType) && isExistSpecCoin.length < 1) {
      
                console.log('**************************' + new Date() + '**************************');
                console.log('********************************************* START *********************************************');
                console.log('index ==> ' + coinIndex + '  COIN ==> ' + btcSymbol
                  + ' ==> priceChangePercent ==> ' + elementTicker24hr.priceChangePercent);
      
                // klines
                const getFullYear = new Date().getFullYear();
                const getMonth = new Date().getMonth();
                const getDay = new Date().getDate();
                const getHours = new Date().getHours();
                const getMinutes = new Date().getMinutes();
                let tempMin = 0;
            
                if (getMinutes < 15) {
                  tempMin = 0;
                } else if (getMinutes < 30) {
                  tempMin = 15;
                } else if (getMinutes < 45) {
                  tempMin = 30;
                } else {
                  tempMin = 45;
                }
            
      
                //const startTime = new Date(getFullYear, getMonth, getDay, getHours - hourStart, 0, 0, 0).getTime();
                const endTime = new Date(getFullYear, getMonth, getDay, getHours - hourEnd, -1, 0, 0).getTime();
      
                const dataQueryStringklines = 'symbol=' + btcSymbol
                  + '&' + 'interval=' + '30m'
                 // + '&' + 'startTime=' + startTime
                  + '&' + 'endTime=' + endTime;
      
      
                const urlklines = BinanceUrl.klinesUrl + '?' + dataQueryStringklines;
                const ourRequestklines = new XMLHttpRequest();
      
                ourRequestklines.open('GET', urlklines, false);
                ourRequestklines.setRequestHeader('X-MBX-APIKEY', BinanceKey.asilkeys.akey);
                ourRequestklines.onload = function () {
      
                  const ourDataKlineList = JSON.parse(ourRequestklines.responseText);
      
                  /***** Declarations ******/
                  const howManyHourLen = 20;
                  const howManyHourLenRsi = 19;
                  const constRsi45 = 45;
                  const constRsi60 = 60;
      
                  let closeDifOpen = 0;
                  let highDifLow = 0;
                  let StandardDeviation = 0;
                  let total = 0;
                  let myBalance = 0;
      
      
      
                  let buyCondition = false;
                  let sellCondition1 = false;
                  let sellCondition2 = false;
                  let sellCondition3 = false;
                  let sellCondition4 = false;
                  let sellCondition5 = false;
      
      
                  const TempKlines = [];
                  const MaSpBolingerMovement = [];
                  const MaSpBolingerMovementRsi = [];
      
                  const avgClosePricehArray = [];
                  let AvgClosePriceH = 0;
                  let avgClosePricehT = 0;
                  const avgClosePricehLen = howManyHourLen;
      
      
                  const AvgUpperMovementArray = [];
                  let AvgUpperMovement = 0;
                  let AvgUpperMovementT = 0;
                  const AvgUpperMovementLen = howManyHourLenRsi;
      
      
                  const AvgLowerMovementArray = [];
                  let AvgLowerMovement = 0;
                  let AvgLowerMovementT = 0;
                  const AvgLowerMovementLen = howManyHourLenRsi;
      
      
                  ourDataKlineList.forEach(klineElement => {
      
                    closeDifOpen = Math.abs(klineElement[4] - klineElement[1]);
                    highDifLow = Math.abs(klineElement[2] - klineElement[3]);
      
                    const ClosePrice = Number(klineElement[4]) * 100000000;
                    const OpenPrice = Number(klineElement[1]) * 100000000;
      
                    let upperBolingerBandCalculate = 0;
                    let lowerBolingerBandCalculate = 0;

                    
      
      
                    // avgClosePriceh
                    if (avgClosePricehArray.length < avgClosePricehLen) {
      
                      avgClosePricehArray.push(ClosePrice);
                      AvgClosePriceH = 0;
                      avgClosePricehT = avgClosePricehArray.reduce((a, b) => a + b, 0);
      
                      if (avgClosePricehArray.length === avgClosePricehLen) {
      
                        AvgClosePriceH = Number(parseFloat(String(avgClosePricehT / avgClosePricehLen)).toFixed(10));
      
                        for (let index = avgClosePricehLen - 1; index >= 0; index--) {
                          const element = avgClosePricehArray[index];
                          total += Math.pow(element - AvgClosePriceH, 2);
                        }
      
                        total = total / avgClosePricehLen;
                        StandardDeviation = Math.sqrt(total);
      
                        upperBolingerBandCalculate = AvgClosePriceH + (2 * StandardDeviation);
                        lowerBolingerBandCalculate = AvgClosePriceH - (2 * StandardDeviation);
      
                      }
      
                    } else {
      
                      avgClosePricehArray.shift();
                      avgClosePricehT = avgClosePricehT - avgClosePricehArray[0];
                      avgClosePricehArray.push(ClosePrice);
                      avgClosePricehT = avgClosePricehArray.reduce((a, b) => a + b, 0);
                      AvgClosePriceH = Number(parseFloat(String(avgClosePricehT / avgClosePricehLen)).toFixed(10));
      
                      for (let index = avgClosePricehLen - 1; index >= 0; index--) {
                        const elementClosePrice = avgClosePricehArray[index];
                        total += Math.pow(elementClosePrice - AvgClosePriceH, 2);
                      }
      
      
                      total = total / avgClosePricehLen;
                      StandardDeviation = Math.sqrt(total);
      
                      upperBolingerBandCalculate = AvgClosePriceH + (2 * StandardDeviation);
                      lowerBolingerBandCalculate = AvgClosePriceH - (2 * StandardDeviation);
      
                    }
      
                    /************************** */
      
                    const itemAvgClosePrice = {
                      isSpec: Number(closeDifOpen - highDifLow),
                      openTime: new Date(klineElement[0]).toLocaleString(),
                      closeTime: new Date(klineElement[6]).toLocaleString(),
                      openPrice: OpenPrice,
                      closePrice: ClosePrice,
                      avgClosePriceh: AvgClosePriceH,
                      standardDeviation: StandardDeviation,
                      upperBolingerBand: upperBolingerBandCalculate,
                      lowerBolingerBand: lowerBolingerBandCalculate
      
                    };
      
                    TempKlines.push(itemAvgClosePrice);
      
      
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

      
                  for (let j = 0; j < TempKlines.length; j++) {
      
                    // const notSpecReally = (TempKlines[j].isSpec !== 0) && (TempKlines[j + 1].isSpec !== 0); 
                    // if (notSpecReally) {
      

                      let closeprice = Number(TempKlines[j].closePrice); 
                      if(j<11)
                      {
                          item_ema_12 += closeprice
                          Ema_12[j] = 0; 
                      }
                      else if(j === 11)
                      {
                          item_ema_12 += closeprice
                          item_ema_12 /= 12;
                          Ema_12[j] = item_ema_12;
                          item_ema_12_of_ema += Ema_12[j];
                      }
                      else if(j>11 && j<22){
                          Ema_12[j] = (closeprice * (2/(12+1)) + Ema_12[j-1] * (1-(2/(12+1))));
                          item_ema_12_of_ema += Ema_12[j];
                      }   
                      else if(j === 22){
                          Ema_12[j] = (closeprice * (2/(12+1)) + Ema_12[j-1] * (1-(2/(12+1))));
                          item_ema_12_of_ema += Ema_12[j];
                          Ema_12_of_Ema[j] = item_ema_12_of_ema / 12;
                          Dema_12[j] = (2*Ema_12[j]) - Ema_12_of_Ema[j];
                      }
                      else
                      {
                          Ema_12[j] = (closeprice * (2/(12+1)) + Ema_12[j-1] * (1-(2/(12+1))));
                          Ema_12_of_Ema[j] = (closeprice * (2/(12+1)) + Ema_12_of_Ema[j-1] * (1-(2/(12+1))));
                          Dema_12[j] = (2*Ema_12[j]) - Ema_12_of_Ema[j];
                      }                  
                    let ClosePriceisInc = 0;
                    let UpperMovement = 0;
                    let LowerMovement = 0;
      
                    if (j > 0) {
                      ClosePriceisInc = TempKlines[j].closePrice - TempKlines[j - 1].closePrice;
                      UpperMovement = (ClosePriceisInc) > 0 ? ClosePriceisInc : 0;
                      LowerMovement = (ClosePriceisInc) > 0 ? 0 : Math.abs(ClosePriceisInc);
                    }
      
                    const itemMovement = {
                      isSpec: TempKlines[j].isSpec,
                      openTime: TempKlines[j].openTime,
                      closeTime: TempKlines[j].closeTime,
                      openPrice: TempKlines[j].openPrice,
                      closePrice: TempKlines[j].closePrice,
                      avgClosePriceh: TempKlines[j].avgClosePriceh,
                      StandardDeviation: TempKlines[j].standardDeviation,
                      upperBolingerBand: TempKlines[j].upperBolingerBand,
                      lowerBolingerBand: TempKlines[j].lowerBolingerBand,
                      closePriceisInc: ClosePriceisInc,
                      upperMovement: UpperMovement,
                      lowerMovement: LowerMovement
      
                    };
      
                    MaSpBolingerMovement.push(itemMovement);
      
      
                  }
                  for(let j = 0;j<TempKlines.length;j++)
                  {

                      let closeprice = Number(TempKlines[j].closePrice); 
                      if(j < 25)
                      {
                          item_ema_26 += closeprice;
                          Ema_26[j] = 0;
                      }
                      else if(j === 25)
                      {
                          item_ema_26 += closeprice;
                          item_ema_26 /= 26;
                          Ema_26[j] = item_ema_26;
                          item_ema_26_of_ema += Ema_26[j];
                      }
                      else if(j>25 && j<50)
                      {
                          Ema_26[j] = (closeprice * (2/(26+1)) + Ema_26[j-1] * (1-(2/(26+1))));
                          item_ema_26_of_ema += Ema_26[j];
                      }
                      else if(j===50)
                      {
                          Ema_26[j] = (closeprice * (2/(26+1)) + Ema_26[j-1] * (1-(2/(26+1))));
                          item_ema_26_of_ema += Ema_26[j];
                          Ema_26_of_Ema[j] = item_ema_26_of_ema / 26;
                          Dema_26[j] = (2*Ema_26[j]) - Ema_26_of_Ema[j];
                          Macd_Dema[j] = Dema_12[j] - Dema_26[j];
                          item_signal_macd_dema += Macd_Dema[j];
                      }
                      else if(j>50 && j<58)
                      {
                        Ema_26[j] = (closeprice * (2/(26+1)) + Ema_26[j-1] * (1-(2/(26+1))));
                        Ema_26_of_Ema[j] = (closeprice * (2/(26+1)) + Ema_26_of_Ema[j-1] * (1-(2/(26+1))));
                        Dema_26[j] = (2*Ema_26[j]) - Ema_26_of_Ema[j];
                        Macd_Dema[j] = Dema_12[j] - Dema_26[j];
                        item_signal_macd_dema += Macd_Dema[j];
                      }
                      else if(j===58)
                      {
                        Ema_26[j] = (closeprice * (2/(26+1)) + Ema_26[j-1] * (1-(2/(26+1))));
                        Ema_26_of_Ema[j] = (closeprice * (2/(26+1)) + Ema_26_of_Ema[j-1] * (1-(2/(26+1))));
                        Dema_26[j] = (2*Ema_26[j]) - Ema_26_of_Ema[j];
                        Macd_Dema[j] = Dema_12[j] - Dema_26[j];
                        item_signal_macd_dema += Macd_Dema[j];
                        Signal_Macd_Dema[j] = item_signal_macd_dema/9;
                        Histogram_Dema[j] = Macd_Dema[j] - Signal_Macd_Dema[j];
                      }
                      else
                      {
                        Ema_26[j] = (closeprice * (2/(26+1)) + Ema_26[j-1] * (1-(2/(26+1))));
                        Ema_26_of_Ema[j] = (closeprice * (2/(26+1)) + Ema_26_of_Ema[j-1] * (1-(2/(26+1))));
                        Dema_26[j] = (2*Ema_26[j]) - Ema_26_of_Ema[j];
                        Macd_Dema[j] = Dema_12[j] - Dema_26[j];
                        item_signal_macd_dema -= Macd_Dema[j-8];
                        item_signal_macd_dema += Macd_Dema[j];
                        Signal_Macd_Dema[j] = item_signal_macd_dema / 9;
                        Histogram_Dema[j] = Macd_Dema[j] - Signal_Macd_Dema[j];
                      }
                  }

      
                  MaSpBolingerMovement.forEach(element => {
      
                    let notionalCalculate = 0;
                    let rsiCalculate = 0;
      
      
                    // AvgUpperMovement
                    if (AvgUpperMovementArray.length < AvgUpperMovementLen) {
      
                      AvgUpperMovementArray.push(element.upperMovement);
                      AvgUpperMovement = 0;
                      AvgUpperMovementT = AvgUpperMovementArray.reduce((a, b) => a + b, 0);
                      if (AvgUpperMovementArray.length === AvgUpperMovementLen) {
      
                        AvgUpperMovement =
                          Number(parseFloat(String(AvgUpperMovementT / AvgUpperMovementLen)).toFixed(10));
                      }
      
                    } else {
      
                      AvgUpperMovementArray.shift();
                      AvgUpperMovementT = AvgUpperMovementT - AvgUpperMovementArray[0];
                      AvgUpperMovementArray.push(element.upperMovement);
      
                      // AvgUpperMovementT = AvgUpperMovementArray.reduce((a, b) => a + b, 0); 
                      AvgUpperMovementT = (AvgUpperMovement * (AvgUpperMovementLen-1)) + element.upperMovement;
                      AvgUpperMovement =
                        Number(parseFloat(String(AvgUpperMovementT / AvgUpperMovementLen)).toFixed(10));
      
      
                    }
      
      
                    // AvgLowerMovement
                    if (AvgLowerMovementArray.length < AvgLowerMovementLen) {
      
                      AvgLowerMovementArray.push(element.lowerMovement);
                      AvgLowerMovement = 0;
                      AvgLowerMovementT = AvgLowerMovementArray.reduce((a, b) => a + b, 0);
                      if (AvgLowerMovementArray.length === AvgLowerMovementLen) {
      
                        AvgLowerMovement = Number(parseFloat(String(AvgLowerMovementT / AvgLowerMovementLen)).toFixed(10));
                        notionalCalculate = Number(parseFloat(String(AvgUpperMovement / AvgLowerMovement)).toFixed(10));
                        rsiCalculate = 100 - (100 / (notionalCalculate + 1));
      
      
                      }
      
                    } else {
      
                      AvgLowerMovementArray.shift();
                      AvgLowerMovementT = AvgLowerMovementT - AvgLowerMovementArray[0];
                      AvgLowerMovementArray.push(element.lowerMovement);
      
                      // AvgLowerMovementT = AvgLowerMovementArray.reduce((a, b) => a + b, 0);
                      AvgLowerMovementT = (AvgLowerMovement * (AvgUpperMovementLen-1)) + element.lowerMovement;
      
                      AvgLowerMovement =
                        Number(parseFloat(String(AvgLowerMovementT / AvgLowerMovementLen)).toFixed(10));
      
      
                      /*** */
                      notionalCalculate = Number(parseFloat(String(AvgUpperMovement / AvgLowerMovement)).toFixed(10));
                      rsiCalculate = 100 - (100 / (notionalCalculate + 1));
      
                      /****** */
                    }
      
      
                    /************************** */
                    const item = {
                      isSpec: element.isSpec,
                      openTime: element.openTime,
                      closeTime: element.closeTime,
                      openPrice: element.openPrice,
                      closePrice: element.closePrice,
                      avgClosePriceh: element.avgClosePriceh,
                      upperBolingerBand: element.upperBolingerBand,
                      lowerBolingerBand: element.lowerBolingerBand,
                      closePriceisInc: element.closePriceisInc,
                      upperMovement: element.upperMovement,
                      lowerMovement: element.lowerMovement,
                      avgUpperMovement: AvgUpperMovement,
                      avgLowerMovement: AvgLowerMovement,
                      notional: notionalCalculate,
                      rsi: rsiCalculate,
                      btc_Symbol: btcSymbol
      
                    };
      
                    MaSpBolingerMovementRsi.push(item);
      
      
                  });
      
                  console.log('1. ====> ' + '   -- c' + 'COIN : ' + btcSymbol + ' percentage : '
                    + 'endTime : ' + new Date(endTime));
                  //console.log('MaSpBolingerMovementRsi');
                  //console.log(MaSpBolingerMovementRsi);
                  /*
                  if(Histogram_Dema[index]>0 && Histogram_Dema[index-1]<0)
                  {
                    if(Macd_Dema[index]<0) 
                    {
                   */
                  const lastArrayLength = MaSpBolingerMovementRsi.length - 1;
                  let gecis = 0;
                  if (lastArrayLength > 0) {
                    const lastRsiValue = Math.ceil(MaSpBolingerMovementRsi[lastArrayLength].rsi);
                    const secondLastRsiValue = MaSpBolingerMovementRsi[lastArrayLength - 1].rsi;
                    const lastMacd = Histogram_Dema[Histogram_Dema.length-1];
                    const secondLastMacd = Histogram_Dema[Histogram_Dema.length-2];
                    for (let index = Histogram_Dema.length - 1; index > Histogram_Dema.length - 5; index--) {
                      if (Histogram_Dema[index] > 0 && Histogram_Dema[index - 1] < 0) {
                         if (Macd_Dema[index] < 0) {
                          gecis = 1;
                        }
      
                      }
      
                      if (gecis === 1) {
      
                        if (Histogram_Dema[index] < 0 && Histogram_Dema[index - 1] > 0) {
                          gecis = 0;
      
                        }
                      }
      
      
                    }
      
                    let macdEgim = lastMacd - secondLastMacd;
      
                    /*********************************************************** */
                    buyCondition = ((secondLastRsiValue < constRsi45)
                    && (lastRsiValue >= constRsi45)
                    && (lastRsiValue < constRsi60)
                    && gecis === 1);
                    console.log('secondLastRsiValue : ' + secondLastRsiValue);
                    console.log('lastRsiValue : ' + MaSpBolingerMovementRsi[lastArrayLength].rsi);
                    console.log('buyCondition : ' + buyCondition);
                    console.log('lastMacd : ' + lastMacd);
                    console.log('secondLastMacd : ' + secondLastMacd);

                    sellCondition1 = secondLastRsiValue >= constRsi60 && lastRsiValue < secondLastRsiValue;

                    sellCondition2 = macdEgim < 0; 
                    




                    /*
                    sellCondition1 = lastRsiValue >= constRsi60;
      
                    sellCondition2 = MaSpBolingerMovementRsi[lastArrayLength].openPrice >
                      MaSpBolingerMovementRsi[lastArrayLength].upperBolingerBand;
      
                    sellCondition3 = MaSpBolingerMovementRsi[lastArrayLength].closePrice >
                      MaSpBolingerMovementRsi[lastArrayLength].upperBolingerBand;
      
                    sellCondition4 = MaSpBolingerMovementRsi[lastArrayLength].openPrice <
                      MaSpBolingerMovementRsi[lastArrayLength].lowerBolingerBand;
      
                    sellCondition5 = MaSpBolingerMovementRsi[lastArrayLength].closePrice <
                      MaSpBolingerMovementRsi[lastArrayLength].lowerBolingerBand;
      
      
                    console.log('sellCondition1 : ' + sellCondition1);
                    console.log('sellCondition2 : ' + sellCondition2);
                    console.log('sellCondition3 : ' + sellCondition3);
                    console.log('sellCondition4 : ' + sellCondition4);
                    console.log('sellCondition5 : ' + sellCondition5);
      
      
                    /************************************************************/
      
                    // BAKIYE ÇEK
      
                    let time = 0;
      
                    const ourRequestTime = new XMLHttpRequest();
      
                    ourRequestTime.open('GET', BinanceUrl.timeUrl, false);
                    ourRequestTime.setRequestHeader('X-MBX-APIKEY', BinanceKey.asilkeys.akey);
      
                    ourRequestTime.onload = function () {
      
                      const ourDataTime = JSON.parse(ourRequestTime.responseText);
                      time = ourDataTime.serverTime;
      
                      const dataQueryStringAccount = 'timestamp=' + time;
      
                      const signatureAccount = sha256.hmac(BinanceKey.asilkeys.skey, dataQueryStringAccount);
      
                      const urlAccountInfo = BinanceUrl.accountUrl + '?' + dataQueryStringAccount + '&signature=' + signatureAccount;
                      const ourRequestAccountInfo = new XMLHttpRequest();
      
                      ourRequestAccountInfo.open('GET', urlAccountInfo, false);
                      ourRequestAccountInfo.setRequestHeader('X-MBX-APIKEY', BinanceKey.asilkeys.akey);
      
                      // tslint:disable-next-line: only-arrow-functions
                      ourRequestAccountInfo.onload = function () {
      
                        countBigCoin = 0;
                        const accountBalance = [];
                        const tempAccountBalance = [];
                        const accountInfo = JSON.parse(ourRequestAccountInfo.responseText);
      
                        accountInfo.balances.forEach(element => {
                          if (element.free > 0) {
      
                            accountBalance.push(element);
      
                            if (element.asset !== coinTradeType) {
      
                              if (element.asset !== 'VTHO') { // Daha sonra kaldırılacak trade e kapalı
      
                                const ourRequestTicker = new XMLHttpRequest();
      
                                const dataQueryString = '&symbol=' + element.asset + coinTradeType;
                                const urlTicker = BinanceUrl.tickerPriceUrl + '?' + dataQueryString;
      
                                ourRequestTicker.open('GET', urlTicker, false);
                                ourRequestTicker.setRequestHeader('X-MBX-APIKEY', BinanceKey.asilkeys.akey);
      
                                ourRequestTicker.onload = function () {
      
                                  const ourDataTicker = JSON.parse(ourRequestTicker.responseText);
      
                                  coinPrice = Number(ourDataTicker.price);
                                  const elementTotalBtc = element.free * coinPrice;
      
                                  if (elementTotalBtc > 0.0001) {
      
                                    countBigCoin++;
                                    tempAccountBalance.push(element);
      
                                  }
      
                                };
                                ourRequestTicker.send();
                              }
      
      
                            } else {
                              myBalance = element.free;
                            }
      
                          }
      
                        });
      
                        console.log('tempAccountBalance');
                        console.log(tempAccountBalance);
      
      
                        countofbuyable = myBalance / (canBuyableCoinCount - countBigCoin);
      
                        console.log('myBalance');
                        console.log(myBalance);
                        console.log('countBigCoin');
                        console.log(countBigCoin);
                        console.log('countofbuyable');
                        console.log(countofbuyable);
      
                        /*********************************************************** */
      
                        let buySellQuantity = 0;
                        let dataQueryStringOrder = '';
                        let orderType = '';
      
                        /******************************************************************* */
      
                        const ourRequestTimeOrder = new XMLHttpRequest();
      
                        ourRequestTimeOrder.open('GET', BinanceUrl.timeUrl, false);
                        ourRequestTimeOrder.setRequestHeader('X-MBX-APIKEY', BinanceKey.asilkeys.akey);
      
                        let timeOrder = 0;
                        // tslint:disable-next-line: only-arrow-functions
                        ourRequestTimeOrder.onload = function () {
                          const ourDataTimeOrder = JSON.parse(ourRequestTimeOrder.responseText);
                          timeOrder = ourDataTimeOrder.serverTime;
                          const isExistCoin = accountBalance.filter(function (item) {
                            return item.asset === subSymbol;
                          });
      
      
                          if (buyCondition) {
      
                            // Buy
      
                            if (isExistCoin.length < 1) {
      
                              coinPrice = Number(elementTicker24hr.lastPrice);
      
                              buySellQuantity = Math.floor(countofbuyable / coinPrice);
                              orderType = 'buy';
      
                              console.log('elementTicker24hr');
                              console.log(elementTicker24hr);
                              console.log('buy buySellQuantity ' + buySellQuantity);
                              console.log('buy coinPrice ' + coinPrice);
      
                            }
      
                          }
                          /*********************************************************** */
                          if (sellCondition1 || sellCondition2) {
      
                            // Sell
      
                            if (isExistCoin.length > 0) {
      
                              buySellQuantity = Math.floor(isExistCoin[0].free);
                              orderType = 'SELL';
      
                              console.log('sell buySellQuantity ' + buySellQuantity);
                              console.log('buy coinPrice ' + isExistCoin[0].free);
      
                            }
      
                          }
      
                          /****************************************************** */
                          dataQueryStringOrder = 'symbol=' + btcSymbol + '&type=market&side=' + orderType + '&quantity=' + buySellQuantity
                            + '&timestamp=' + time;
      
                          console.log('dataQueryStringOrder');
                          console.log(dataQueryStringOrder);
      
                          if (buySellQuantity > 0) {
      
      
                            const ourRequestOrder = new XMLHttpRequest();
                            const signatureStringOrder = sha256.hmac(BinanceKey.asilkeys.skey, dataQueryStringOrder);
      
                            const urlSell = BinanceUrl.orderUrl + '?' + dataQueryStringOrder + '&signature=' + signatureStringOrder;
      
                            console.log('Date = ' + new Date(timeOrder) + '------------COIN = ' + btcSymbol + '------ quantity = '
                              + buySellQuantity + '------ order type = ' + orderType);
      
                            ourRequestOrder.open('POST', urlSell, false);
                            ourRequestOrder.setRequestHeader('X-MBX-APIKEY', BinanceKey.asilkeys.akey);
      
                            if (btcSymbol !== commissionCoinType) {
                              
                              ourRequestOrder.onload = function () {
                                const ourDataSell = JSON.parse(ourRequestOrder.responseText);
                                console.log(' -1h- ' + orderType + ' is OK');
                                console.log(ourDataSell);
      
                              };
                              ourRequestOrder.send();
                            }
      
      
                          } else {
      
                            console.log(' -1h- ' + orderType + ' is NOK  -- quantity : ' + buySellQuantity);
      
                          }
      
      
                        };
                        ourRequestTimeOrder.send();
                        // SON
      
                        /*********************************************************** */
      
      
                      };
                      ourRequestAccountInfo.send();
                    };
                    ourRequestTime.send();
                    /************************************* */
      
                  } else {
      
                    console.log(btcSymbol + ' coin RSI hesaplanamadı');
                  }
      
                };
      
                ourRequestklines.send();
      
              }
            });
      
            console.log('**************************' + new Date() + '**************************');
            console.log('********************************************* END *********************************************');
          };
          ourRequest24hTicker.send();
      
    }

}