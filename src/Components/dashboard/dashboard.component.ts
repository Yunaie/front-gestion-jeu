import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../Services/UserService';
import { User } from '../../Models/User';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user!: User | null;
  editUserForm!: FormGroup;
  isEditing: boolean = false; // ✅ Mode édition désactivé par défaut
  successMessage: string = "";
  errorMessage: string = "";

  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
          this.initForm(); // ✅ On initialise le formulaire même si l'utilisateur ne modifie rien
        });
      }
    });
  }

  initForm() {
    this.editUserForm = this.fb.group({
      name: [this.user?.name || '', Validators.required],
      firstname: [this.user?.firstname || '', Validators.required]
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.initForm(); // ✅ Réinitialise le formulaire lorsqu'on active l'édition
    }
  }

  updateUser() {

    if (this.user && this.editUserForm.valid) {
      const updatedUser: User = {
        name: this.editUserForm.value.name,
        firstname: this.editUserForm.value.firstname,
        email: this.user.email,
        role: this.user.role,
        phone: this.user.phone,
        id: this.user.id,
        validateEmail: this.user.validateEmail ?? false, 
        verifierFormatNumero: this.user.verifierFormatNumero ?? false 
      };

      this.userService.modifyUser(this.user.id, updatedUser)
        .then(() => {
          this.successMessage = "Informations mises à jour avec succès !";
          this.errorMessage = "";
          this.user = updatedUser;
          this.isEditing = false; // ✅ Ferme le mode édition après modification
        })
        .catch(error => {
          this.successMessage = "";
          this.errorMessage = "Erreur lors de la mise à jour.";
          console.error(error);
        });
    }
  }
}
