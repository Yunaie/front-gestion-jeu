import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private fireauth: AngularFireAuth) {
    console.log(this.fireauth); 
   }
  
  login(email:string,password:string) {
    console.log("hello")
  }
}