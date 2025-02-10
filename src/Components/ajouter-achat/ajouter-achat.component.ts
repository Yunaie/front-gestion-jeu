import { SessionService } from '../../Services/SessionService';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { jsPDF } from "jspdf";


@Component({
  selector: 'app-achat',
  standalone: true,
  imports: [ReactiveFormsModule, AfficherJeuComponent],
  templateUrl: './ajouter-achat.component.html',
  styleUrls: ['./ajouter-achat.component.css']
})
export class AchatComponent implements OnInit {
  JeuForm!: FormGroup;
  AcheteurForm!: FormGroup;
  session: Session | null = null;
  listeJeuAacheter: GameDeposit[] = [];
  total: number = 0;
  error: string = "";
  user: User | null = null;
  vendeursGains: { vendeurId: string; gain: number }[] = [];
  achatId: string = "";
  achat: Achat | null = null;
  private isPDFvalue: boolean = false;
  errorMessage: string = '';




  constructor(
    private sessionService: SessionService,
    private router: Router,
    private gameService: JeuDeposeService,
    private achatService: AchatService,
    private userService: UserService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.session = this.sessionService.getCurrentSession();


    this.JeuForm = new FormGroup({
      id: new FormControl('', Validators.required),
    });


    this.AcheteurForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^(0[67])\d{8}$/)]]
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
          if (!this.listeJeuAacheter.some(jeu => jeu.id === game.id)) {
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
            this.showErrorMessage("Le jeu a déjà été ajouté à la liste");
          }
        } else {
          console.error(`Jeu avec l'ID ${idJeu} introuvable.`);
          this.showErrorMessage("L'id du jeu n'existe pas");
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

  IsPDF(value: boolean) {
    this.isPDFvalue = value;
    this.finaliserAchat();
  }

  async finaliserAchat() {
    if (this.session && this.user) {
      try {
       
        await this.changerStatutGame(this.listeJeuAacheter);
        await this.changerTotalCommission();
        const docRef = await this.achatService.createAchat(this.total, this.listeJeuAacheter, this.session!.id, this.user.id);


        if (this.isPDFvalue) {
          const achat = await firstValueFrom(this.achatService.getAchatById(docRef.id));

          if (achat) {
            const pdfUrl = await this.achatService.genererPDFRecu(achat);


            const AchatData = {
              total: achat.total,
              jeuAacheter: achat.jeuAacheter,
              sessionId: achat.sessionId,
              createdAt: achat.createdAt,
              pdfRecu: pdfUrl,
              userId: achat.userId,
            };


            const { email, phone, prenom, nom } = this.AcheteurForm.value;

            if (!this.AcheteurForm.valid) {
              this.error = "❌ Veuillez remplir tous les champs requis pour l'acheteur.";
              return;
            }
            await this.creerAcheteur(pdfUrl, email, phone, nom, prenom);






            await this.achatService.updatePdfRecu(achat.id, AchatData);
            console.log("✅ PDF mis à jour dans Firestore");
            console.log("🚀 Ouverture du PDF...");

            await this.achatService.ouvrirRecuPDF(pdfUrl);
            console.log("✅ PDF ouvert");
          } else {
            console.error("❌ Achat non trouvé !");
          }
        }

        const updatePromises = this.vendeursGains.map(async vendeur => {
          try {
            const existingVendeur = await firstValueFrom(this.userService.getVendeurById(vendeur.vendeurId));
            if (existingVendeur) {
              const updatedGain = existingVendeur.gain + vendeur.gain;
              const updatedTotalGain = existingVendeur.totalGain + vendeur.gain;

              await this.userService.modifyGainVendeur(vendeur.vendeurId, { gain: updatedGain });
              await this.userService.modifyTotalGainsVendeur(vendeur.vendeurId, { totalGain: updatedTotalGain });

              console.log(`✅ Gain mis à jour pour le vendeur ${vendeur.vendeurId}: ${updatedGain}`);
            } else {
              console.error(`❌ Vendeur ${vendeur.vendeurId} introuvable.`);
            }
          } catch (error) {
            console.error(`❌ Erreur lors de la mise à jour du vendeur ${vendeur.vendeurId}:`, error);
          }
        });

        await Promise.all(updatePromises);
        console.log('✅ Tous les gains des vendeurs ont été mis à jour.');

        this.router.navigate(['/accueilGestionnaire']);

      } catch (error) {
        console.error('❌ Erreur lors de la finalisation de l\'achat:', error);
      }
    }
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

  async creerAcheteur(pdfUrl: string, email: string, phone: string, nom: string, prenom: string) {
    if (!this.userService.validateEmail(email)) {
      this.error = "❌ L'email n'est pas au bon format.";
      return;
    }

    if (!this.userService.verifierFormatNumero(phone)) {
      this.error = "❌ Le numéro de téléphone n'est pas au bon format.";
      return;
    }

    console.log("📌 Début de la vérification de l'acheteur...");

    try {

      const emailExists = await firstValueFrom(this.userService.AcheteurExistMail(email));

      const phoneExists = await firstValueFrom(this.userService.AcheteurExistPhone(phone));


      if (!emailExists && !phoneExists) {
        console.log("dsfq")

        console.log("🆕 Création d'un nouvel acheteur...");
        const docRef = await this.userService.createAcheteur(nom, prenom, email, phone, pdfUrl);
        const acheteurId = docRef.id;
        console.log("✅ Acheteur créé avec ID :", acheteurId);

      } else if (emailExists && phoneExists) {
        console.log("ℹ️ L'acheteur existe déjà, mise à jour en cours...");

        await this.userService.getAcheteur(email, phone).subscribe(data => {
          const acheteur = data;
          if (acheteur) {
            console.log("id de lacheteur "+acheteur.id)
            this.userService.updateAcheteur(acheteur.id, pdfUrl);
            this.errorMessage = "Un vendeur avec cet email et ce numéro de téléphone existe déjà. Le ticket a été ajouté.";
            console.log("✅ Mise à jour réussie !");
          }
        })
        
      } else {
        console.log("⚠️ Conflit : soit l'email, soit le téléphone existe déjà.");
        this.errorMessage = "Un vendeur avec cet email ou ce numéro de téléphone existe déjà.";
      }
    } catch (error) {
      console.error("❌ Erreur lors de la vérification/ajout de l'acheteur :", error);
      this.errorMessage = "Une erreur est survenue lors de la création de l'acheteur.";
    }
  }


}
