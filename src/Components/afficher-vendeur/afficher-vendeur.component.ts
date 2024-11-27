import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../Services/UserService';
import { Vendeur } from '../../Models/Vendeur';
import { CommonModule } from '@angular/common';
import { User } from '../../Models/User';
import { SessionService } from '../../Services/SessionService';
import { Session } from '../../Models/Session';
import { JeuDeposeService } from '../../Services/JeuDeposeService';

@Component({
  selector: 'app-afficher-vendeur',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './afficher-vendeur.component.html',
  styleUrl: './afficher-vendeur.component.css'
})
export class AfficherVendeurComponent implements OnInit {

  @Input() public VendeurId: string = "";
  vendeur: Vendeur | null = null;
  user: User | null = null;
  sessionChose!: Session | null;
  totalJeux: number = 0;
  totalJeuxVente: number = 0;
  totalJeuxVendu: number = 0;


  constructor(private userService: UserService, private sessionService: SessionService, private JeuDeposeService: JeuDeposeService) {

  }

  ngOnInit(): void {

    this.sessionChose = this.sessionService.getCurrentSession();

    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
        });
      }
    });

    this.userService.getVendeurById(this.VendeurId).subscribe(userData => {
      this.vendeur = userData || null;
      console.log('Données du vendeur récupérées:', this.vendeur);
    });

    this.JeuDeposeService.getNombreTotalJeuxByVendeur(this.VendeurId).subscribe(total => {
      this.totalJeux = total; 
    });

    this.JeuDeposeService.getNombreJeuxEnVenteByVendeur(this.VendeurId).subscribe(totalJeuxVente => {
      this.totalJeuxVente = totalJeuxVente; 
    });

    this.JeuDeposeService.getNombreJeuxVendusByVendeur(this.VendeurId).subscribe(totalJeuxVendu => {
      this.totalJeuxVendu = totalJeuxVendu; 
    });


  }

  payerFrais() {
    this.userService.modifyFraisVendeur(this.VendeurId, 0);

  }

  recupererGain() {
    this.userService.modifyGainVendeur(this.VendeurId, { gain: 0 });
  }


   

}
