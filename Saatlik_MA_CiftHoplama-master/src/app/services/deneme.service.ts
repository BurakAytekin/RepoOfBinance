import { Injectable } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { HelperService } from './helper.service';
import { sha256 } from 'js-sha256';
import { ExportService } from './export.service';


@Injectable({
    providedIn: 'root'
  })
  
  
  export class Deneme {

    constructor(private httpClient: HttpClient, private helperService: HelperService) {
    }

    DenemeFonk()
    {
        let sayi= 359;
        let sayi2= 12;
        let sonuc= sayi+sayi2;
        console.log("sonuc="+sonuc);

        if(sonuc >86) {
            console.log("basarılı");
        }
        else if (sonuc<86)
        {
            console.log("karasız");
        }
        else {
            console.log("basarısız");
        }

        for(let index=1;index<sonuc;index++) {
            console.log(index);

            

        }

        let taban= 2;
        let us = 3;
        let toplam = 1;
        console.log("toplam"+sonuc);

        
        for(let index=0; index<us ;index++)
        {
            toplam=toplam*taban;
        }
        console.log(toplam);



        const dizi=[40,60,80];

        
        let ortalama=0;


        for(let i = 0 ; i<dizi.length;i++){
                ortalama+=dizi[i];
        }
            

        
        ortalama=ortalama/3

        let sd = 0;
        for(let i=0 ; i<dizi.length; i++)
        {
            let hlf = dizi[i]-ortalama;
            
            sd+=Math.pow(hlf,2);

        }   
        sd=sd/dizi.length;
        sd=Math.sqrt(sd);


        let sma = [];
        let matoplam=0;
        for(let i=0; i<dizi.length ;i++)
        {
            if ( i<5 ) {

            sma[i]=0;
            matoplam+=dizi[i];
            }

            else

            {
                matoplam+=dizi[i];
                
                sma[i] = matoplam/5;

                matoplam-=dizi[i-5];
            }
    




    }
}
  }

