import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Vendeur } from '../../Models/Vendeur';
import { Observable } from 'rxjs';
import { Session } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';
import { UserService } from '../../Services/UserService';
import { User } from '../../Models/User';

@Component({
  selector: 'app-afficher-bilan',
  standalone: true,
  imports: [],
  templateUrl: './afficher-bilan.component.html',
  styleUrl: './afficher-bilan.component.css'
})


export class BilanVendeurComponent implements OnInit {
  @Input() vendeurId: string = '';  
  vendeur: Vendeur |null = null ;
  session : Session | null = null;
  user : User | null = null;

  constructor(private firestore: AngularFirestore, private sessionService: SessionService, private userService : UserService) { }

  ngOnInit(): void {
    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
          this.userService.getUserById(this.user.id).subscribe(userData => {
              this.user = userData || null;
          });
      }
  });
    this.session = this.sessionService.getCurrentSession();
    this.userService.getVendeurById(this.vendeurId).subscribe(userData => {
      this.vendeur = userData || null;
      console.log('Données du vendeur récupérées:', this.vendeur);
    });
  }

  calculerSoldeFinalVendeur(gain: number, fraisApayer: number): number {
    return gain - fraisApayer;
  }

}