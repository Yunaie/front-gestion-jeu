import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/UserService';
import { Router } from '@angular/router';
import { JeuDeposeService } from '../../Services/JeuDeposeService';
import { GameDeposit } from '../../Models/GameDeposit';
import { Vendeur } from '../../Models/Vendeur';
import { Session } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';
import { StatutRoleGame } from '../../Models/GameDeposit';
import { StatutRole } from '../../Models/Session';
import { take } from 'rxjs';
import { User } from '../../Models/User';

@Component({
  selector: 'app-ajt-jeu',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ajouter-jeu.component.html',
  styleUrls: ['./ajouter-jeu.component.css']
})
export class AjouterJeuComponent implements OnInit {
  JeuForm!: FormGroup;
  session: Session | null = null;
  @Input() public listeJeu: GameDeposit[] = [];
  @Input() public vendeur: Vendeur | null = null;
  @Output() public jeuxMisAJour = new EventEmitter<GameDeposit[]>();
  errorMessage: string | null = null;
  user: User | null = null;


  constructor(
    private auth: AuthService,
    private userService: UserService,
    private sessionService: SessionService,
    private JeuDeposeService: JeuDeposeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.session = this.sessionService.getCurrentSession();

    this.JeuForm = new FormGroup({
      name: new FormControl('', Validators.required),
      editeur: new FormControl('', Validators.required),
      etat: new FormControl('', Validators.required),
      prix: new FormControl('', Validators.required),
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

  AjouterJeu() {
    if (this.JeuForm.valid) {
      const name = this.JeuForm.get('name')?.value;
      const editeur = this.JeuForm.get('editeur')?.value;
      const etat = this.JeuForm.get('etat')?.value;
      const prix = this.JeuForm.get('prix')?.value;
      const statut = StatutRoleGame.vente;
      const vendeurId = this.vendeur?.id;
      const sessionId = this.session!.id;

      if (this.session && this.vendeur && this.session.statut == StatutRole.ouvert) {
        this.JeuDeposeService.createJeu(name, editeur, etat, prix, statut, vendeurId!, sessionId)
          .then(docRef => {
            const id = docRef.id;
            const nouveauJeu: GameDeposit = {
              id, name, editeur, etat, prix,
              statut,
              vendeurId: vendeurId!,
              sessionId
            };

            this.listeJeu.push(nouveauJeu);
            this.jeuxMisAJour.emit(this.listeJeu);

            const nouveauxFrais = (this.session!.frais * prix) / 100;

            if (vendeurId) {

              const fraisMisAJourSession = this.session!.TotalSommeFrais + nouveauxFrais;

              const sessionData: Session = {
                ...this.session!,
                TotalSommeFrais: fraisMisAJourSession
              };

              this.sessionService.modifySession(this.session!.id, sessionData)
                .then(() => {
                  console.log('Session modifiée avec succès');
                  this.session!.TotalSommeFrais = fraisMisAJourSession;
                })
                .catch(error => {
                  console.error('Erreur lors de la modification de la session:', error);
                });


              this.userService.getVendeurFrais(vendeurId).pipe(take(1)).subscribe(fraisExistants => {
                console.log("les frais actuels du vendeur sont de "+fraisExistants);
                const frais = fraisExistants + nouveauxFrais;
                this.userService.modifyFraisVendeur(vendeurId,frais)
              });

              
              this.userService.getVendeurTotalFrais(vendeurId).pipe(take(1)).subscribe(fraisTotauxExistants => {

                const fraisTotalTotal = fraisTotauxExistants + nouveauxFrais;


                this.userService.modifyTotalFraisVendeur(vendeurId, fraisTotalTotal);
              });

              
            } else {
              console.error('Vendeur non trouvé.');
            }

            this.JeuForm.reset();
          }).catch(error => {
            console.error('Erreur lors de la création du jeu:', error);
          });
      } else {
        console.error('Le formulaire n\'est pas valide');
      }
    }
  }




  private showTemporaryError(message: string, success: boolean = false) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = null, 3000);

    if (success) {
      alert(message); // Affiche le message en cas de succès si demandé
    }
  }
}
