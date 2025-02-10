
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Vendeur } from '../../Models/Vendeur';
import { Observable } from 'rxjs';
import { Session } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';
import { UserService } from '../../Services/UserService';
import { User } from '../../Models/User';
import { JeuDeposeService } from '../../Services/JeuDeposeService';
import { firstValueFrom } from 'rxjs';


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
  gain: number = 0;
  jeuxVendus: number = 0;
  totalJeux: number = 0;
  jeuxEnVente: number = 0;
  wantsAdmin : boolean = false;
  wantsSession : boolean = false;


  constructor(private firestore: AngularFirestore, public sessionService: SessionService, private userService: UserService, private jeuDeposeService: JeuDeposeService) { }

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

    if (this.sessionId) {
      this.sessionService.getSessionById(this.sessionId).subscribe(sessionData => {
        this.session = sessionData || null;
        if (this.session) {
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

  printSession() {
    this.wantsSession = true;
  }

  printAdmin() {
    this.wantsAdmin = true;
  }


async dlPDF(sessionId: string) {
    try {
        const session = await firstValueFrom(this.sessionService.getSessionById(sessionId));

        if (!session) {
            console.error("❌ Session introuvable.");
            return;
        }

        if (!this.sessionService.IsOpen(session)) {
            console.error("❌ La session est fermée, il n'y a donc pas de bilan.");
            return;
        }

        const pdfUrl = await this.sessionService.genererPDFRecu(session);

        await this.sessionService.updatePdfRecu(session.id, pdfUrl);

        this.sessionService.ouvrirRecuPDF(pdfUrl);

    } catch (error) {
        console.error("❌ Erreur lors du téléchargement du PDF :", error);
    }
}




}