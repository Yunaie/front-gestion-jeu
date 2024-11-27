import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/UserService';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SessionService } from '../../Services/SessionService';
import { Session } from '../../Models/Session';
import { User } from '../../Models/User';

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

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

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

      try {
        const docRef = await this.userService.createVendeur(0,0,email, firstname, phone, name, 0,0);
        const id = docRef.id;
      console.log(id);

        this.router.navigate(['/depot'], { queryParams: { id } });

      } catch (error) {
        console.error('Erreur lors de la création du vendeur:', error);
      }
    } else {
      console.error('Le formulaire n\'est pas valide');
    }
  }

  redirectToLogin() {
    this.router.navigate(['/loginVendeur'], { queryParams: { redirectRoute: '/depot' } });
  }

 
}
