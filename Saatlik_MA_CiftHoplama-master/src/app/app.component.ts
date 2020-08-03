import { Component } from '@angular/core';
import { TestBinanceService } from './services/test-binance.service';
import { timer } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Di As Crypto Strategies Demo - MA_Hop';

  // source = timer(1000, 2000);
  // // output: 0,1,2,3,4,5......
  //   subscribe = this.source.subscribe(val => console.log(val));


  constructor(private testBinanceService: TestBinanceService) { }

  GetTest() {

    //this.testBinanceService.GetCurrencyFromApi2();

  }



}
