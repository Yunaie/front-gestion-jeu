import { SessionService } from '../../Services/SessionService';
import { FormControl, FormGroup } from '@angular/forms';
import { Session } from '../../Models/Session';
import { Component, OnInit } from '@angular/core';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameDeposit } from '../../Models/GameDeposit';
import { JeuDeposeService } from '../../Services/JeuDeposeService';
import { AfficherJeuComponent } from '../afficher-jeu/afficher-jeu.component';
import { Observable } from 'rxjs';
import { AchatService } from '../../Services/AchatService';
import { Achat } from '../../Models/Achat';
import { StatutRoleGame } from '../../Models/GameDeposit';
import { User } from '../../Models/User';
import { UserService } from '../../Services/UserService';
import { Vendeur } from '../../Models/Vendeur';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-achat',
  standalone: true,
  imports: [ReactiveFormsModule, AfficherJeuComponent],
  templateUrl: './ajouter-achat.component.html',
  styleUrls: ['./ajouter-achat.component.css']
})
export class AchatComponent implements OnInit {
  JeuForm!: FormGroup;
  session: Session | null = null;
  listeJeuAacheter: GameDeposit[] = [];
  total: number = 0;
  error: string = "";
  user: User | null = null;
  vendeursGains: { vendeurId: string; gain: number }[] = [];


  constructor(
    private sessionService: SessionService,
    private router: Router,
    private gameService: JeuDeposeService,
    private achatService: AchatService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.session = this.sessionService.getCurrentSession();
    this.JeuForm = new FormGroup({
      id: new FormControl('', Validators.required),
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

  private vendeurExiste(vendeurId: string): { vendeurId: string; gain: number } | undefined {
    return this.vendeursGains.find(vendeur => vendeur.vendeurId === vendeurId);
  }


  AjouterJeuAacheterListe() {
    if (this.JeuForm.valid && this.session) {
      const idJeu = this.JeuForm.get('id')?.value;
      this.gameService.getJeuById(idJeu).subscribe(game => {
        if (game) {
          if (this.gameService.IsOnSale(game)) {
            this.total += Number(game.prix);
            this.listeJeuAacheter.push(game);

            const gain = game.prix - (this.session!.commissionsPourcentages * game.prix) / 100;
            const index = this.vendeursGains.findIndex(vendeur => vendeur.vendeurId === game.vendeurId);

            if (index !== -1) {
              this.vendeursGains[index].gain += gain;
            } else {
              this.vendeursGains.push({ vendeurId: game.vendeurId, gain });
            }
          } else {
            this.showErrorMessage("Ce jeu n'est pas en vente : ce jeu est " + game.statut);
          }
        } else {
          console.error(`Jeu avec l'ID ${idJeu} introuvable.`);
        }
      });
    }
  }


  showErrorMessage(message: string, duration: number = 3000): void {
    this.error = message;
    setTimeout(() => {
      this.error = "";
    }, duration);
  }

  changerTotalCommission() {
    if (this.session) {

      const nouvelleCommission = this.total * this.session.commissionsPourcentages / 100;

      const sessionData: Session = {
        ...this.session,
        TotalSommeComissions: this.session.TotalSommeComissions + nouvelleCommission
      };

      this.sessionService.modifySession(this.session.id, sessionData)
        .then(() => {
          console.log('Session modifiée avec succès');
          this.session!.TotalSommeComissions = sessionData.TotalSommeComissions;
          alert('Modifications sauvegardées avec succès !');
        })
        .catch(error => {
          console.error('Erreur lors de la modification de la session:', error);
          alert('Erreur lors de la sauvegarde des modifications.');
        });

    }
  }



  finaliserAchat() {
    if (this.session) {
      this.achatService.createAchat(this.total, this.listeJeuAacheter, this.session!.id).then(docRef => {
        const id = docRef.id;

        this.changerStatutGame(this.listeJeuAacheter);

        this.changerTotalCommission();

        const updatePromises = this.vendeursGains.map(async vendeur => {
          try {
            const existingVendeur = await firstValueFrom(this.userService.getVendeurById(vendeur.vendeurId));
            if (existingVendeur) {
              const updatedGain = existingVendeur.gain + vendeur.gain;
              const updatedTotalGain = existingVendeur.totalGain + vendeur.gain;

              await this.userService.modifyGainVendeur(vendeur.vendeurId, { gain: updatedGain });

              await this.userService.modifyTotalGainsVendeur(vendeur.vendeurId, { totalGain: updatedTotalGain });

              console.log(`Gain mis à jour pour le vendeur ${vendeur.vendeurId}: ${updatedGain}`);
            } else {
              console.error(`Vendeur avec l'ID ${vendeur.vendeurId} introuvable.`);
            }
          } catch (error) {
            console.error(`Erreur lors de la mise à jour des gains pour le vendeur ${vendeur.vendeurId}:`, error);
          }
        });

        Promise.all(updatePromises)
          .then(() => {
            console.log('Tous les gains des vendeurs ont été mis à jour.');
          })
          .catch(error => {
            console.error('Erreur lors de la mise à jour des gains des vendeurs :', error);
          });
      }).catch(error => {
        console.error('Erreur lors de la création de l\'achat:', error);
      });
    }
    this.router.navigate(['/accueilGestionnaire']);
  }



  changerStatutGame(listeJeuAcheter: GameDeposit[]) {
    if (listeJeuAcheter && listeJeuAcheter.length > 0) {
      listeJeuAcheter.forEach(jeu => {
        this.gameService.changerStatut(jeu.id, StatutRoleGame.vendu)
          .then(() => {
            console.log(`Le statut du jeu avec l'ID ${jeu.id} a été changé en ${StatutRoleGame.vendu}.`);
          })
          .catch(error => {
            console.error('Erreur lors de la mise à jour du statut du jeu avec l\'ID', jeu.id, error);
          });
      });
    } else {
      console.error('La liste des jeux achetés est vide ou invalide.');
    }
  }



}
