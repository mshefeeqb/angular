import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient,HttpClientModule, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http:HttpClient){}
  title = 'angular-payment-gateway';
  errorMessage="";
  response=null;

  sendPayment() {
      this.http.post<any>(
        'https://reqres.in/api/posts',
        { title: 'Angular POST Request Example' }
      )
      .pipe(catchError((error:any,caught:Observable<any>):Observable<any> =>{
        this.errorMessage = error.message;
        console.log("error caught",error)
        return of()
      }))
      .subscribe(data =>{
        this.response = data
      })

  }
  checkout(){
    const currentTimestamp = new Date().getTime();
    const data = {
      payfortactlink : 'https://sbcheckout.payfort.com/FortAPI/paymentPage',
      payfortcommand : 'AUTHORIZATION',
      payfortaccesscode : 'SHOJgjA8Uofa0R1JtjZP',
      payfortmerchantidentifier : 'uBtRIcqH',
      totpayamount : "2000",
      payfortcurrency : 'AED',
      payfortlanguage : 'en',
      customeremail : 'test@gmail.com',
      bookrefnum : currentTimestamp,
      customer_ip : "103.178.205.183",
      signature:""
    }

    var text = `G$ewan_Mazaya@2023access_code=${data.payfortaccesscode}amount=${data.totpayamount}command=${data.payfortcommand}currency=${data.payfortcurrency}customer_email=${data.customeremail}customer_ip=${data.customer_ip}language=${data.payfortlanguage}merchant_identifier=${data.payfortmerchantidentifier}merchant_reference=${data.bookrefnum}G$ewan_Mazaya@2023`
    console.log(text)
    const sha256Hash = this.calculateSHA256(text);
    console.log(sha256Hash)
    data.signature = sha256Hash

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Referer':'http://customdomain.baz',
      'Origin': 'http://customdomain.baz'
    });
    let options = { headers: headers };

    this.http.post<any>(
      'https://sbpaymentservices.payfort.com/FortAPI/paymentApi',
      data,
      options
    )
    .pipe(catchError((error:any,caught:Observable<any>):Observable<any> =>{
      this.errorMessage = error.message;
      console.log("error caught",error)
      return of()
    }))
    .subscribe(data =>{
      this.response = data
    })
  }

  calculateSHA256(input:string){
    const hash = CryptoJS.SHA256(input);
    return hash.toString(CryptoJS.enc.Hex);
  }
}
