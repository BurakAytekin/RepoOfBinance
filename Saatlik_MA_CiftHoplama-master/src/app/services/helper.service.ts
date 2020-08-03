import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }


    sortByProperty = function (property) {
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
    };
};



  DateToNumberStr(value: any): any {

    const date = new Date(value);

    const month = date.getMonth() + 1; // months from 1-12
    const day = date.getDate();
    //// console.log('day')
    //// console.log(day);

    const year = date.getFullYear();

    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hour = date.getHours();

    const numberDateStr = this.SetStr0(year) + this.SetStr0(month) + this.SetStr0(day)
      + this.SetStr0(hour) + this.SetStr0(minutes) + this.SetStr0(seconds);
    //// console.log('numberDateStr')
    //// console.log(numberDateStr)
    return numberDateStr;



  }


  SetStr0(number: any): string {
    let Str = String(number);
    if (Str.length === 0) {
      Str = '00' + Str;
    }

    if (Str.length === 1) {
      Str = '0' + Str;
    }

    return Str;
  }

  dateAdd(date, interval, units) {
    if (!(date instanceof Date))
      return undefined;
    var ret = new Date(date); //don't change original date
    var checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };
    switch (String(interval).toLowerCase()) {
      case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
      case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
      case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
      case 'week': ret.setDate(ret.getDate() + 7 * units); break;
      case 'day': ret.setDate(ret.getDate() + units); break;
      case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
      case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
      case 'second': ret.setTime(ret.getTime() + units * 1000); break;
      default: ret = undefined; break;
    }
    return ret;
  }



}
