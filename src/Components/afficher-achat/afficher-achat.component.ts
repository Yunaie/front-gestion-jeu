import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JeuDeposeService } from '../../Services/JeuDeposeService';
import { AchatService } from '../../Services/AchatService';
import { SessionService } from '../../Services/SessionService';
import { Session } from '../../Models/Session';
import { Achat } from '../../Models/Achat';
import { CommonModule } from '@angular/common';
import { AfficherJeuComponent } from '../afficher-jeu/afficher-jeu.component';
import { Timestamp } from '@angular/fire/firestore';
import { User } from '../../Models/User';
import { UserService } from '../../Services/UserService';

@Component({
  selector: 'app-afficher-achat',
  standalone: true,
  imports: [CommonModule, AfficherJeuComponent],
  templateUrl: './afficher-achat.component.html',
  styleUrl: './afficher-achat.component.css'
})
export class AfficherAchatComponent {
  session: Session | null = null;
  listeAchats: Achat[] = [];
  user: User | null = null;

  constructor(private sessionService: SessionService,
    private router: Router,
    private gameService: JeuDeposeService,
    private achatService: AchatService,
    private userService: UserService) { }


  ngOnInit() {
    this.session = this.sessionService.getCurrentSession();
    if (this.session) {
      this.getAllAchatBySessionId(this.session.id);
    }

    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
        });
      }
    });
  }

  getAllAchatBySessionId(idSession: string) {
    this.achatService.getAchatsBySessionId(idSession).subscribe(
      (achats) => {
        this.listeAchats = achats.map((achat) => {
          if (achat.createdAt instanceof Timestamp) {
            achat.createdAt = achat.createdAt.toDate();
          }
          return achat;
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des achats : ', error);
      }
    );
  }

}
