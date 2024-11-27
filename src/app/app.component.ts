import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../Services/authService';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../Models/User';
import { UserService } from '../Services/UserService';
import { ActivatedRoute, Router } from '@angular/router'; 
import { Session } from '../Models/Session';
import { SessionService } from '../Services/SessionService';
import { StatutRole } from '../Models/Session';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front-awi';

  Sessions: Session[] = [];
   user: User | null = null;
   sessionId : string = "";

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private sessionService : SessionService
  ) { }

  

  ngOnInit() {
    this.sessionService.getAllSessions().subscribe(Sessions => {
      this.Sessions = Sessions;
    });
    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
          this.userService.getUserById(this.user.id).subscribe(userData => {
              this.user = userData || null;
              console.log('Données utilisateur récupérées11:', this.user);
          });
      }
  });

  
  }

  redirectToAccueil(session: Session) {
   if(session.statut == StatutRole.ouvert ) {
    this.sessionService.setCurrentSession(session);
    this.router.navigate(['/accueilGestionnaire']);
   }
   else {
    alert("Cette session est fermer vous ne pouvez pas la choisir");
   }
  }
  
}
