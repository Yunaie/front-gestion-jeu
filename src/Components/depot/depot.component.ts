import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../Services/UserService';
import { User } from '../../Models/User';
import { Vendeur } from '../../Models/Vendeur';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GameDeposit } from '../../Models/GameDeposit';
import { AjouterJeuComponent } from '../ajouter-jeu/ajouter-jeu.component';
import { AfficherJeuComponent } from '../afficher-jeu/afficher-jeu.component';
import { AfficherVendeurComponent } from '../afficher-vendeur/afficher-vendeur.component';
import { SessionService } from '../../Services/SessionService';
import { Session } from '../../Models/Session';


@Component({
  selector: 'app-depot',
  standalone: true,
  imports: [RouterOutlet, AfficherVendeurComponent, CommonModule, AfficherJeuComponent, ReactiveFormsModule, RouterLink, RouterLinkActive, AjouterJeuComponent],
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.css']
})
export class DepotComponent implements OnInit {
  vendeurId!: string;
  vendeur: Vendeur | null = null;
  listeJeu: GameDeposit[] = [];
  afficherJeuForm: boolean = false;
  session: Session | null = null;
  fraisVendeur! : number ;
  user: User | null = null;



  constructor(private route: ActivatedRoute, private userService: UserService, private sessionService: SessionService) { }

  ngOnInit(): void {

    this.session = this.sessionService.getCurrentSession();
    this.route.queryParams.subscribe(params => {
      this.vendeurId = params['id'];
      if (this.vendeurId) {
        this.userService.getVendeurById(this.vendeurId).subscribe(userData => {
          this.vendeur = userData || null;
          console.log('Données du vendeur récupérées:', this.vendeur);

          this.userService.getFireBaseUser().subscribe(userData => {
            this.user = userData || null;
            if (this.user) {
              this.userService.getUserById(this.user.id).subscribe(userData => {
                this.user = userData || null;
              });
            }
          });

        });
      }
      
    });
    if (this.vendeurId) {
      this.userService.getVendeurById(this.vendeurId).subscribe(userData => {
        this.vendeur = userData || null;
        console.log('Données du vendeur récupérées:', this.vendeur);
      });
    }
    ;
  }

  afficherForm() {
    this.afficherJeuForm = true;
  }

  payerFrais(){
    this.userService.modifyFraisVendeur(this.vendeurId,0);
  }


  logoutVendeur() {
    this.vendeur = null,
      this.vendeurId = "";
  }




}
