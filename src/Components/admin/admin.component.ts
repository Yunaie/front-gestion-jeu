import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AfficherSessionComponent } from '../afficher-session/afficher-session.component';
import { AjouterSessionComponent } from '../ajouter-session/ajouter-session.component';
import { Session } from '../../Models/Session';
import { User } from '../../Models/User';
import { UserService } from '../../Services/UserService';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../Services/SessionService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AfficherSessionComponent, AjouterSessionComponent,CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  Admin: User | null = null;
  listeSession: Session[] = [];
  afficherSessionForm: boolean = false;
  afficherFrom: boolean = false;
  session: Session | null = null;


  constructor(private UserService: UserService, private route: ActivatedRoute, private sessionService: SessionService) { }

  ngOnInit() {
    this.UserService.getFireBaseUser().subscribe(userData => {
      this.Admin = userData || null;
      if (this.Admin) {
        this.UserService.getUserById(this.Admin.id).subscribe(userData => {
          this.Admin = userData || null;
        });
        console.log('Données utilisateur récupérées admin:', this.isAdmin(this.Admin));
      }
    });

    this.session = this.sessionService.getCurrentSession();
  }

  isAdmin(user: User): boolean {
    return this.UserService.IsAdmin(user)
  }
 


  afficherForm() {
    this.afficherFrom = true;
  }


}
