import { Component, OnInit } from '@angular/core';
import { JeuDeposeService } from '../../Services/JeuDeposeService';
import { GameDeposit } from '../../Models/GameDeposit';
import { AfficherJeuComponent } from '../afficher-jeu/afficher-jeu.component'; 
import { FormsModule } from '@angular/forms'; // Ajouter cette ligne

@Component({
  selector: 'app-liste-jeux',
  standalone: true,
  imports: [AfficherJeuComponent,FormsModule],
  templateUrl: './liste-jeux.component.html',
  styleUrls: ['./liste-jeux.component.css']
})
export class ListeJeuxComponent implements OnInit {
  games: GameDeposit[] = []; 
  filteredGames: GameDeposit[] = []; // Liste filtrée des jeux
  statutFilter: string = ''; // Filtre sur le statut (Vendu/Non Vendu)
  minPrice: number = 0; // Filtre sur le prix minimum
  maxPrice: number = 1000; // Filtre sur le prix maximum
  
  constructor(private jeuDeposeService: JeuDeposeService) {}

  ngOnInit(): void {
    // Récupérer tous les jeux au début
    this.jeuDeposeService.getAllGames().subscribe((data: GameDeposit[]) => {
      this.games = data;
      this.applyFilters(); // Appliquer les filtres après avoir récupéré les jeux
    });
  }

  // Applique les filtres sur les jeux
  applyFilters(): void {
    this.filteredGames = this.games.filter(game => {
      // Filtre par statut
      const matchStatut = this.statutFilter ? game.statut === this.statutFilter : true;
      
      // Filtre par prix
      const matchPrice = game.prix >= this.minPrice && game.prix <= this.maxPrice;

      return matchStatut && matchPrice;
    });
  }

  // Cette méthode est appelée à chaque fois qu'un filtre change
  onFilterChange(): void {
    this.applyFilters();
  }
}
