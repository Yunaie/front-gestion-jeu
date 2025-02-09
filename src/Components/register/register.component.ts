import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/UserService';
import { firstValueFrom } from 'rxjs';

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
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstname: ['', Validators.required],
      name: ['', Validators.required],
      tel: ['', Validators.required]
    });
  }

  async register() {
    if (!this.registerForm.valid) {
        this.error = "❌ Veuillez remplir tous les champs requis.";
        return;
    }

    const { email, password, firstname, name, tel } = this.registerForm.value;
    console.log("📌 Début de la vérification des données");

    try {
        if (!this.userService.validateEmail(email)) {
            this.error = "❌ L'email n'est pas au bon format.";
            return;
        }

        if (!this.userService.verifierFormatNumero(tel)) {
            this.error = "❌ Le numéro de téléphone n'est pas au bon format.";
            return;
        }

        console.log("🔍 Vérification en base des doublons...");
        const [emailExists,phoneExists ] = await Promise.all([
          firstValueFrom(this.userService.userExistMail(email)),
          firstValueFrom(this.userService.UserExistPhone(tel))
        ]);
        console.log(emailExists);
        console.log(phoneExists);

        
        if (emailExists) {
            this.error = "❌ Cet email est déjà utilisé.";
            return;
        }

        if (phoneExists) {
            this.error = "❌ Ce numéro de téléphone est déjà utilisé.";
            return;
        }


        const response = await this.auth.register(email, password);

        console.log("📌 Retour de register() :", response);

        const uid = response;
        if (!uid) {
            this.error = "❌ Erreur : Impossible de récupérer l'UID.";
            return;
        }


        await this.userService.createUser(uid, email, firstname, tel, name);

        console.log("✅ Utilisateur créé avec succès !");
        this.error = "🎉 Inscription réussie !";

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        this.error = "❌ Une erreur s'est produite. Veuillez réessayer.";
    }
}




}
