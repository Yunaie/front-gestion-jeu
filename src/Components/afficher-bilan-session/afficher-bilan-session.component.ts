
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Vendeur } from '../../Models/Vendeur';
import { Observable } from 'rxjs';
import { Session } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';
import { UserService } from '../../Services/UserService';
import { User } from '../../Models/User';
import { JeuDeposeService } from '../../Services/JeuDeposeService';

@Component({
  selector: 'app-afficher-bilan-session',
  standalone: true,
  imports: [],
  templateUrl: './afficher-bilan-session.component.html',
  styleUrl: './afficher-bilan-session.component.css'
})


export class AfficherBilanSessionComponent implements OnInit {
  @Input() sessionId: string = '';
  session: Session | null = null;
  Currentsession: Session | null = null;
  user: User | null = null;
  gain : number = 0 ;
  jeuxVendus : number = 0 ;
  totalJeux : number = 0;
  jeuxEnVente : number = 0;
  

  constructor(private firestore: AngularFirestore, private sessionService: SessionService, private userService: UserService, private jeuDeposeService: JeuDeposeService) { }

  ngOnInit(): void {
    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
        });
      }
    });
    this.Currentsession = this.sessionService.getCurrentSession();

    if(this.sessionId) {
      this.sessionService.getSessionById(this.sessionId).subscribe(sessionData => {
        this.session = sessionData || null;
       if(this.session){
        this.gain = this.session.TotalSommeComissions + this.session.TotalSommeFrais;
       }
      })
      this.jeuDeposeService.getNombreTotalJeuxBySession(this.sessionId).subscribe(totalJeux => {
        this.totalJeux = totalJeux;
      });

      this.jeuDeposeService.getNombreJeuxVendusBySession(this.sessionId).subscribe(jeuxVendus => {
        this.jeuxVendus = jeuxVendus;
      });

      this.jeuDeposeService.getNombreJeuxEnVenteBySession(this.sessionId).subscribe(jeuxEnVente => {
        this.jeuxEnVente = jeuxEnVente;
      });
    }

  }



}