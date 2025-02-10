import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../Services/UserService';
import { User, UserRole } from '../../Models/User';
import { Session } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-admin',
  standalone: true,
  templateUrl: './admin-admin.component.html',
  styleUrl: './admin-admin.component.css',
  imports: [ReactiveFormsModule, CommonModule] // ✅ Ajout de ReactiveFormsModule pour éviter l'erreur
})
export class AdminAdminComponent implements OnInit {
  sessionChose!: Session | null;
  user: User | null = null;
  userForm!: FormGroup;
  message: string = '';

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private fb: FormBuilder // ✅ Ajout du FormBuilder pour initialiser le formulaire
  ) { }

  ngOnInit() {
    // Initialisation du formulaire avec validation
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+?\d{1,3})?[-.\s]?(\d{2,3})[-.\s]?(\d{2})[-.\s]?(\d{2})[-.\s]?(\d{2})$/)]]
    });

    // Récupérer l'utilisateur connecté
    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
        });
      }
    });

    // Récupérer la session actuelle
    this.sessionChose = this.sessionService.getCurrentSession();
  }

  async submitForm() {
    if (this.userForm.invalid) {
      this.message = "⚠️ Veuillez entrer des informations valides.";
      return;
    }

    const email = this.userForm.value.email;
    const phone = this.userForm.value.phone;

    try {
      this.userService.getUserByEmailAndPhone(email, phone).subscribe(data => {
        const user = data;
        if (user) {
          if (user.role === UserRole.Gestionnaire) {
             this.userService.updateUserRole(user.id, UserRole.Admin);
            this.message = `✅ L'utilisateur ${user.name} est maintenant administrateur.`;
          } else {
            this.message = `ℹ️ L'utilisateur ${user.name} est déjà administrateur.`;
          }
        } else {
          this.message = "❌ Aucun utilisateur trouvé avec ces informations.";
          return;
        }
      }
      )

    } catch (error) {
      this.message = "❌ Erreur lors de la vérification de l'utilisateur.";
      console.error(error);
    }
  }
}
