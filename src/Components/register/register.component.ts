import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { CommonModule } from '@angular/common'; 
import { UserService } from '../../Services/UserService';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstname: ['', Validators.required],
      name: ['', Validators.required],
      tel: ['', Validators.required]
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { email, password, firstname, name, tel } = this.registerForm.value;

      this.auth.register(email, password).then((uid) => {
        if (uid) {
          this.userService.createUser(uid, email, firstname, tel, name);
          console.log("Utilisateur créé avec succès");
        } else {
          console.error('Erreur : Impossible de récupérer l\'UID.');
        }
      }).catch((error) => {
        console.error('Erreur lors de l\'enregistrement :', error);
        this.error = 'Erreur lors de l\'enregistrement. Veuillez réessayer.';
      });
      
    } else {
      this.error = 'Veuillez remplir tous les champs requis.';
    }
  }
}
