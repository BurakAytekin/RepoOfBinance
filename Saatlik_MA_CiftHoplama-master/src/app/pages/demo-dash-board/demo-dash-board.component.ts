import { Component, OnInit } from '@angular/core';
import { TestBinanceService } from 'src/app/services/test-binance.service';
import { timer, from } from 'rxjs';
import { FlowService } from 'src/app/services/flow.service';
import { OrderService } from 'src/app/services/order.service';
import { CommonService } from 'src/app/services/common.service';
import { MaService } from 'src/app/services/ma.service';
import { HoplamaService } from 'src/app/services/hoplama.service';
import { HoplamaService1 } from 'src/app/services/hoplama1.service';
import {MaDonguService} from 'src/app/services/ma_dongu.service'
import { PriceForKline } from 'src/app/services/kline_price.service'
import { macd } from 'src/app/services/macd.service'
import {ControlPriceIsLossService} from 'src/app/services/control-price-is-loss.service'
import { Macd_Simulation } from 'src/app/services/macd_simulation.service';
import { RsiMacdService } from 'src/app/services/rsi_macd_service';
import { AlgorithmTestService } from 'src/app/services/algorithm-test.service';
import {Awesomed} from 'src/app/services/awesome.service';
import {MacdMfiService} from 'src/app/services/macd-mfi.service';
import {MacdMfi20} from 'src/app/services/macd_mfi_20_service';
import {Deneme} from 'src/app/services/deneme.service';



@Component({
  selector: 'app-demo-dash-board',
  templateUrl: './demo-dash-board.component.html',
  styleUrls: ['./demo-dash-board.component.scss']
})
export class DemoDashBoardComponent implements OnInit {

  constructor(private testBinanceService: TestBinanceService, private flowService: FlowService,
    private orderService: OrderService, private commonService: CommonService, private maService: MaService,
    private hopService: HoplamaService, private dongu: MaDonguService, private fiyat: PriceForKline, private macd: macd, private islosss:ControlPriceIsLossService,
    private macd_simulation: Macd_Simulation, private RsiMacd: RsiMacdService, private macd_algorithm : AlgorithmTestService, private awesomed: Awesomed, private MacdMfi : MacdMfiService,
    private macdmfi20: MacdMfi20,private deneme: Deneme
  ) { }

  // source = timer(60000, 86400000);
  // source = timer(5000, 10000);

  MacdMfi20Alt()
  {
    this.macdmfi20.MacdMfiCalculate();
  }
  RsiMacdDirekt()
  {
    this.RsiMacd.RsiMacdCalculate();
  }
  Denemefonk()
  {
    this.deneme.DenemeFonk();
  }
  
  RsiMacdCalculate()
  {
    let isWorked = 0;

    setInterval(() => {

      const date = new Date();
      const minutes = date.getMinutes();
      const hour = date.getHours();


      console.log('minutes : ' + minutes);

      if ((minutes > 0 && minutes < 15 ) || (minutes > 15 && minutes < 30) || (minutes > 30 && minutes < 45) || (minutes > 45)) {

        if (isWorked === 0) {

          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RsiMacd 1H START <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
          console.log('--------------' + new Date() + '---------------------------');
          // this.maService.MaSellCoin();
          this.RsiMacd.RsiMacdCalculate();
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RsiMacd 1H END <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');


          isWorked = isWorked + 1;
          console.log('isWorked try IN: ' + isWorked);

        }

      } else {
        isWorked = 0;
        console.log('isWorked try OUT: ' + isWorked);
      }


    }, 60000
    );
  }

  RsiMacdAlgorithm()
  {
    let isWorked = 0;

    setInterval(() => {

      const date = new Date();
      const minutes = date.getMinutes();
      const hour = date.getHours();


      console.log('minutes : ' + minutes);

      if ((minutes > 0 && minutes < 15 ) || (minutes > 16 && minutes < 30) || (minutes > 31 && minutes < 45) || (minutes > 46)) {

        if (isWorked === 0) {

          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RsiMacd 1H START <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
          console.log('--------------' + new Date() + '---------------------------');
          // this.maService.MaSellCoin();
          this.macd_algorithm.CalculateRsiMacd();
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RsiMacd 1H END <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');


          isWorked = isWorked + 1;
          console.log('isWorked try IN: ' + isWorked);

        }

      } else {
        isWorked = 0;
        console.log('isWorked try OUT: ' + isWorked);
      }


    }, 60000
    );
  }

  GetMfiMacd()
  {
    this.MacdMfi.MacdMfiCalculate();
  }
  GetMacd()
  {
    this.macd.MacdBuyCoinWithBarkin();
  }
  GetAwesome()
  {
    this.awesomed.AwesomeCalculate();
  }
  ControlPriceIsLoss()
  {
    this.islosss.SellIfLoss97();
  }
  FiyatAl()
  {
    this.fiyat.FiyatService();
  }
  MaDongu()
  {
    this.dongu.MaDonguBuyCoin();
  }
  MacdSimulation()
  {
    this.macd_simulation.Macd_Simulation_With_Barkin();
  }
  FlowMacd()
  {
    let isWorked = 0;
    setInterval(() => {

      const date = new Date();
      const minutes = date.getMinutes();
      const hour = date.getHours();


      console.log('minutes : ' + minutes);

      if (minutes > 0 && minutes < 15) {

        if (isWorked === 0) {
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Control Price İs Loss %98 <<<<<<<<<<<<<<<<<<<<<<<<<');
          this.islosss.SellIfLoss97();
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> MACD Service Buy And Sell <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
          console.log('--------------' + new Date() + '---------------------------');
          // this.maService.MaSellCoin();
          this.macd.MacdBuyCoinWithBarkin();
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Together Finish <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');


          isWorked = isWorked + 1;
          console.log('isWorked try IN: ' + isWorked);

        }

      } else {
        isWorked = 0;
        console.log('isWorked try OUT: ' + isWorked);
      }


    }, 60000
    );
  }
  GetAll()
  {
    this.testBinanceService.GetAll();
  }
  ngOnInit() {

    // output: 0,1,2,3,4,5......
    // tslint:disable-next-line: prefer-const
    /*
      let subscribe = this.source.subscribe(val => {
        console.log(val);
        if (val % 3600000 === 0) {
          console.log('-----------------------------------------');
          console.log(val + '- 1h Satış');

          this.flowService.FlowSellCoin1h();

          console.log('-----------------------------------------');

          console.log(val + ' - 1 h Alış');
          this.flowService.FlowBuyCoin();


        }
        console.log('-----------------------------------------');
        console.log(val + ' - 1m Satış');
        this.flowService.FlowSellCoin1m();
        console.log('-----------------------------------------');

      }, error => console.error(error));

  */
    // let hourly = 3600000;
    // let minutely = 60000;

    /*********************************************************** */
    /*
     this.startTimer1HBuy();
     this.startTimer1HSell();
     this.startTimer1MSell();
  */

  }

  TimerFlowAll() {

    //  this.startTimer1HBuy();
    //  this.startTimer1HSell();
    //  this.startTimer1MSell();


    this.startTimerFlow();

  }
  TimerFlowTestAlis() {
    this.startTimer1HBuy();


  }
  TimerFlowTestSatisSaatlik() {

    this.startTimer1HSell();


  }
  TimerFlowTestSatisDakikalik() {

    this.startTimer1MSell();

  }


  TimerMaFlow() {

    //  this.startTimer1HBuy();
    //  this.startTimer1HSell();
    //  this.startTimer1MSell();


    this.startTimerMa();

  }

  startTimerMa() {
    let isWorked = 0;

    setInterval(() => {

      const date = new Date();
      const minutes = date.getMinutes();
      const hour = date.getHours();


      console.log('minutes : ' + minutes);

      if (minutes > 0 && minutes < 5) {

        if (isWorked === 0) {

          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> _SELL_ 1H START <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
          console.log('--------------' + new Date() + '---------------------------');
          // this.maService.MaSellCoin();
          this.hopService.HoplamaSellCoin();
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> _SELL_ 1H END <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');


          console.log('*********************************** _BUY_  1H START  ***********************************');
          this.maService.MaBuyCoin();
          console.log('*********************************** _BUY_  1H END  *************************************');


          isWorked = isWorked + 1;
          console.log('isWorked try IN: ' + isWorked);

        }

      } else {
        isWorked = 0;
        console.log('isWorked try OUT: ' + isWorked);
      }


    }, 60000
    );
  }


  MaSatis() {

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> _SELL_ 1H START <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    console.log('--------------start : ' + new Date() + '---------------------------');
    this.maService.MaSellCoin();
    console.log('--------------end   :  ' + new Date() + '---------------------------');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> _SELL_ 1H END <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');


  }

  MaAlis() {

    console.log('*********************************** _BUY_  1H START  ***********************************');
    console.log('--------------start : ' + new Date() + '---------------------------');
    this.maService.MaBuyCoin();
    console.log('--------------end   : ' + new Date() + '---------------------------');
    console.log('*********************************** _BUY_  1H END  *************************************');

  }
  HoplamaSatis() {

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> _SELL_ 1H START <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    console.log('--------------start : ' + new Date() + '---------------------------');
    this.hopService.HoplamaSellCoin();
    console.log('--------------end   :  ' + new Date() + '---------------------------');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> _SELL_ 1H END <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');


  }


  startTimer1MSell() {
    setInterval(() => {
      console.log('------------FlowSellCoin1m starts------------');
      console.log('--------------' + new Date() + '---------------------------');

      this.flowService.FlowSellCoin1m();
      console.log('------------FlowSellCoin1m ends------------');

    }, 60000);

    console.log(' ************ FlowSellCoin1m  ************  ');
  }

  startTimer1HSell() {

    /*

      console.log('------------FlowSellCoin1h starts------------');
      setInterval(() => {
        console.log('--------------' + new Date() + '---------------------------');
        this.flowService.FlowSellCoin1h();
        console.log('------------FlowSellCoin1h ends------------');

      }, 3600005
      );
      console.log('------------FlowSellCoin1h ends------------');

    */

    setInterval(() => {

      const date = new Date();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const hour = date.getHours();

      console.log('minutes : ' + minutes + 'seconds : ' + seconds);
      if (minutes === 17) {
        console.log('------------FlowSellCoin1h starts------------');
        console.log('--------------' + new Date() + '---------------------------');
        this.flowService.FlowSellCoin1h();
        console.log('------------FlowSellCoin1h ends------------');

      }



    }, 62000
    );
    console.log(' ************ FlowSellCoin1hBuy  ************  ');

  }

  startTimer1HBuy() {

    setInterval(() => {

      const date = new Date();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      // nconst hour = date.getHours();

      console.log('minutes : ' + minutes + 'seconds : ' + seconds);
      if (minutes === 16) {
        console.log('------------FlowSellCoin1hBuy starts------------');
        console.log('--------------' + new Date() + '---------------------------');
        this.flowService.FlowBuyCoin();
        console.log('------------FlowSellCoin1hBuy ends------------');

      }

    }, 60000
    );

    console.log(' ************ FlowSellCoin1hBuy  ************  ');
  }


  startTimerFlow() {

    setInterval(() => {

      const date = new Date();
      const minutes = date.getMinutes();
      const hour = date.getHours();
      let isWorked = 0;

      console.log('minutes : ' + minutes);

      if (minutes > 15 && minutes < 25) {

        if (isWorked === 0) {
          console.log('*********************************** _BUY_  1H START  ***********************************');

          this.flowService.FlowBuyCoin();
          console.log('*********************************** _BUY_  1H END  *************************************');

          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> _SELL_ 1H START <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
          console.log('--------------' + new Date() + '---------------------------');
          this.flowService.FlowSellCoin1h();
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> _SELL_ 1H END <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
          isWorked = isWorked + 1;
          console.log('isWorked try IN: ' + isWorked);

        }

      } else {
        isWorked = 0;
        // console.log('isWorked try OUT: ' + isWorked);
      }


      console.log('##################################### SELL 1M START #####################################');
      console.log('--------------' + new Date() + '---------------------------');

      this.flowService.FlowSellCoin1m();
      console.log('##################################### SELL 1M END #####################################');



    }, 60000
    );

  }

  GetCurrencyFromApi() {

    this.testBinanceService.GetCurrencyFromApi();

  }

  GetKlineList24hCoin(){
    this.testBinanceService.GetKlineList24hCoin();
  }


  Test15MKline() {
    this.testBinanceService.Test15MKline();
  }
  TestHline() {
    this.testBinanceService.TestHline();
  }

  MyBalanceList() {
    this.commonService.GetBalance();

  }
  GetCoinPrice() {

    this.testBinanceService.GetCurrencyFromApi2();

  }


  GetCoinList() {

    this.testBinanceService.GetAllCoins();

  }

  SaveCoinList() {
    this.testBinanceService.SaveCoinList();

  }

  GetKlineList() {
    this.testBinanceService.GetKlineList();

  }


  GetKlineListXRP() {
    this.testBinanceService.GetKlineListXRP();

  }

  Get24hTicker() {
    this.testBinanceService.Get24hTicker();
  }
  GetPrice() {

    this.testBinanceService.GetPrice();
  }

  TestSigned() {
    this.testBinanceService.TestSigned();
  }


  NewOrderBuy() {
    this.testBinanceService.GetServerTimeAndNewOrderBuy();
  }


  NewOrderSell() {
    this.testBinanceService.GetServerTimeAndNewOrderSell();
  }

  GetServerTime2() {
    this.testBinanceService.GetServerTime();
  }
  GetServerTime() {
    this.commonService.GetServerTime();
  }

  GetPriceXRP() {
    this.testBinanceService.GetPriceXRP();
  }
  GetKlineListXRP24h() {

    this.testBinanceService.GetKlineListXRP24h();
  }

  FlowTestAlis() {

    this.flowService.FlowBuyCoin();
  }

  FlowTestSatisSaatlik() {

    this.flowService.FlowSellCoin1h();
  }

  FlowTestSatisDakikalik() {

    this.flowService.FlowSellCoin1m();
  }


  MyTradeList() {
    this.orderService.MyTradeList();

  }

  LocalService() {

    this.testBinanceService.LocalService();
  }

  GetCurrencyTimePast() {
    this.testBinanceService.GetCurrencyTimePast();

  }
}
