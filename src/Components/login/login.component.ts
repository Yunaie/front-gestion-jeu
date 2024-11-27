import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/UserService';
import { User } from '../../Models/User';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: string = '';
  currentUser: User | null = null;

  constructor(private auth: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  login() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.auth.login(email, password);
    this.userService.getFireBaseUser().subscribe((firebaseUser: User | null) => {
      if (firebaseUser) {
        this.userService.getUserById(firebaseUser.id).subscribe(userData => {
          this.currentUser = userData || null;
          if(this.currentUser){
          }
        });
      } else {
        console.error('Aucun utilisateur connecté.');
      }
    });

  }
}
