import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private router: Router) { }

  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(res => {
      localStorage.setItem('token', 'true');
      this.router.navigate(['/app']);
    }, err => {
      alert(err.message);
      this.router.navigate(['/login']);
    })
  }


  async register(email: string, password: string): Promise<string | null> {
    try {
      const userCredential = await this.fireauth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid || null;
      this.router.navigate(['/login']);
      return uid;
    } catch (error) {
      alert(error)
      return null;
    }
  }



  verifyEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  verifyPassword(password: string): boolean {
    return password.length >= 6;
  }

  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      window.location.reload();
      this.router.navigate(['/login']);
    }, err => {
    })
  }

  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/varify-email']);
    }, err => {
      alert('Something went wrong');
    })
  }



}