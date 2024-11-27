import { Component } from '@angular/core';
import { AfficherVendeurComponent } from '../afficher-vendeur/afficher-vendeur.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../Services/UserService';
import { Vendeur } from '../../Models/Vendeur';
import { GameDeposit } from '../../Models/GameDeposit';
import { JeuDeposeService } from '../../Services/JeuDeposeService';
import { AfficherJeuComponent } from '../afficher-jeu/afficher-jeu.component';
import { Session } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';
import { User } from '../../Models/User';
import { BilanVendeurComponent } from '../afficher-bilan/afficher-bilan.component';

@Component({
  selector: 'app-info-vendeur',
  standalone: true,
  imports: [AfficherVendeurComponent,AfficherJeuComponent,BilanVendeurComponent],
  templateUrl: './info-vendeur.component.html',
  styleUrl: './info-vendeur.component.css'
})
export class InfoVendeurComponent {

  vendeurId!: string;
  vendeur: Vendeur | null = null;
  listeJeu: GameDeposit[] = [];
  session : Session | null = null;
  user: User | null = null;


  constructor(private route: ActivatedRoute,private sessionService : SessionService, private userService: UserService, private gameService: JeuDeposeService) { }


  ngOnInit(): void {

    this.session = this.sessionService.getCurrentSession();

    this.route.queryParams.subscribe(params => {
      this.vendeurId = params['id'];
      if (this.vendeurId) {
        this.userService.getVendeurById(this.vendeurId).subscribe(userData => {
          this.vendeur = userData || null;
          console.log('Données du vendeur récupérées:', this.vendeur);
        });
      }
      
    });
    this.gameService.getJeuByVendeurId(this.vendeurId).subscribe(games => {
      this.listeJeu = games;
      console.log('Jeux récupérés:', this.listeJeu);
    });

    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
        });
      }
    });
  }

  payerFrais(){
    this.userService.modifyFraisVendeur(this.vendeurId,0);
  }
}
