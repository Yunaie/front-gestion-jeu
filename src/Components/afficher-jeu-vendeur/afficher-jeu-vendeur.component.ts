import { Component, Input } from '@angular/core';
import { GameDeposit } from '../../Models/GameDeposit';
import { User } from '../../Models/User';
import { UserService } from '../../Services/UserService';
import { Session } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';
import { Vendeur } from '../../Models/Vendeur';
import { JeuDeposeService } from '../../Services/JeuDeposeService';
import { StatutRoleGame } from '../../Models/GameDeposit';


@Component({
  selector: 'app-afficher-jeu-vendeur',
  standalone: true,
  imports: [],
  templateUrl: './afficher-jeu-vendeur.component.html',
  styleUrl: './afficher-jeu-vendeur.component.css'
})
export class AfficherJeuVendeurComponent {

  user: User | null = null;
  vendeur: Vendeur | null = null;
  sessionChose!: Session | null;
  @Input() public listeJeu: GameDeposit[] = [];
  @Input() public vendeurId!: string;

  constructor(private userService: UserService, private sessionService: SessionService, private jeuService: JeuDeposeService) { }
  ngOnInit() {
    this.sessionChose = this.sessionService.getCurrentSession();

    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
        });
      }     
    });

    this.userService.getVendeurById(this.vendeurId).subscribe(vendeurData => {
      this.vendeur = vendeurData || null;

    })
  }

  EnleverJeuVente(id: string) {

    this.jeuService.changerStatut(id, StatutRoleGame.retirerDelaVente);

  }

}
