import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/UserService';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';
import { User } from '../../Models/User';

@Component({
  selector: 'app-login-vendeur',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-vendeur.component.html',
  styleUrls: ['./login-vendeur.component.css']
})
export class LoginVendeurComponent implements OnInit {
  loginForm!: FormGroup;
  nomRoute: string = "";
  session: Session | null = null;
  user: User | null = null;


  constructor(private sessionService: SessionService, private auth: AuthService, private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nomRoute = params['redirectRoute'] || null;
    });

    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
        });
      }
    });

    this.session = this.sessionService.getCurrentSession();
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required)
    });
  }



  login() {

    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const phone = this.loginForm.get('phone')?.value;
      this.userService.getVendeur(email, phone).subscribe(vendeur => {
        if (vendeur) {
          console.log("idvendeur"+vendeur.id)
          this.router.navigate([this.nomRoute], { queryParams: { id: vendeur.id } });
        } else {
          console.error('Aucun vendeur trouvé avec cet email et téléphone.');
        }
      }, error => {
        console.error('Erreur lors de la récupération du vendeur:', error);
      });
    } else {
      console.error('Le formulaire n\'est pas valide');
    }
  }
}
