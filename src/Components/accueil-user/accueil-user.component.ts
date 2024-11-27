import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../../Models/User';
import { UserService } from '../../Services/UserService';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';

@Component({
  selector: 'app-accueil-user',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './accueil-user.component.html',
  styleUrl: './accueil-user.component.css'
})
export class AccueilUserComponent {

  title = 'front-awi';
  sessionChose!: Session | null;
  user: User | null = null;


  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private route: ActivatedRoute,
    private sessionService: SessionService,
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

    this.sessionChose = this.sessionService.getCurrentSession();
  }

  isAdmin(user: User): boolean {
    return this.userService.IsAdmin(user)
  }

  redirectToLogin() {
    this.router.navigate(['/loginVendeur'], { queryParams: { redirectRoute: '/infosVendeur' } });
  }

  redirectToAchatInfos() {
     this.router.navigate(['/afficherAchat'],);
  }

  redirectToListeJeux() {
    this.router.navigate(['/ListeJeux'],);
 }

  


  redirectToAchat() {
    this.router.navigate(['/achat'],);
  }

  redirectToRegister() {
    this.router.navigate(['/registerVendeur']);
  }

  redirectToAdmin() {
    this.router.navigate(['/admin']);
  }
}
