import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/UserService';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SessionService } from '../../Services/SessionService';
import { Session } from '../../Models/Session';
import { User } from '../../Models/User';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-register-vendeur',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './register-vendeur.component.html',
  styleUrls: ['./register-vendeur.component.css']
})
export class EnregistrerVendeurComponent implements OnInit {
  registerVendeur!: FormGroup;
  session: Session | null = null;
  user: User | null = null;
  errorMessage: string = '';

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {

    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
        });
      }
    });

    this.registerVendeur = new FormBuilder().group({
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required]
    });

    this.session = this.sessionService.getCurrentSession();
  }


  async register() {
    if (this.registerVendeur.valid) {
      const { email, name, firstname, phone } = this.registerVendeur.value;

      if (this.userService.validateEmail(email) && this.userService.verifierFormatNumero(phone)) {

        try {
          console.log("📌 Début de la vérification des vendeurs...");

          this.userService.VendeurExistMail(email).subscribe(emailExists => {
            console.log("📧 Email existe ?", emailExists);

            this.userService.VendeurExistPhone(phone).subscribe(phoneExists => {
              console.log("📞 Téléphone existe ?", phoneExists);

              if (!emailExists && !phoneExists) {
                console.log("✅ Aucun vendeur trouvé, création en cours...");
                this.userService.createVendeur(0, 0, email, firstname, phone, name, 0, 0).then(docRef => {
                  console.log("🎉 Vendeur créé avec succès, ID:", docRef.id);
                  this.router.navigate(['/depot'], { queryParams: { id: docRef.id } });
                }).catch(error => {
                  console.error("❌ Erreur lors de la création du vendeur:", error);
                });
              } else {
                console.log("⚠ Le vendeur existe déjà.");
                if (emailExists && phoneExists) {
                  this.errorMessage = "Un vendeur avec cet email et ce numéro de téléphone existe déjà.";
                } else if (emailExists) {
                  this.errorMessage = "Un vendeur avec cet email existe déjà.";
                } else if (phoneExists) {
                  this.errorMessage = "Un vendeur avec ce numéro de téléphone existe déjà.";
                }
              }
            });
          });

        } catch (error) {
          console.error('❌ Erreur lors de la création du vendeur:', error);
        }
      } else if (!this.userService.validateEmail(email)) {
        console.log("Le format de l'email n'est pas bon");
      } else if (!this.userService.verifierFormatNumero(phone)) {
        console.log("Le format du numero de telephone n'est pas bon");
      }
      else {
        console.error('❌ Le formulaire n\'est pas valide');
      }
    }
  }



  redirectToLogin() {
    this.router.navigate(['/loginVendeur'], { queryParams: { redirectRoute: '/depot' } });
  }


}
