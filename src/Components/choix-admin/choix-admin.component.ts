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
  selector: 'app-choix-admin',
  standalone: true,
  imports: [],
  templateUrl: './choix-admin.component.html',
  styleUrl: './choix-admin.component.css'
})
export class ChoixAdminComponent {
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
  
  printSession() {
    this.router.navigate(['/admin-session']);
 
  }

  printAdmin() {
    this.router.navigate(['/admin-admin']);
 
  }
}
