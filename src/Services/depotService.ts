import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Vendeur } from '../Models/Vendeur';

@Injectable({
  providedIn: 'root'
})
export class depotService {

  constructor(private fireauth: AngularFireAuth, private router: Router) { }

}