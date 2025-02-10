import { Component, OnInit } from '@angular/core';
import { JeuDeposeService } from '../../Services/JeuDeposeService';
import { GameDeposit } from '../../Models/GameDeposit';
import { AfficherJeuComponent } from '../afficher-jeu/afficher-jeu.component'; 
import { FormsModule } from '@angular/forms'; 
import { User } from '../../Models/User';
import { Session } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';
import { UserService } from '../../Services/UserService';

@Component({
  selector: 'app-liste-jeux',
  standalone: true,
  imports: [AfficherJeuComponent, FormsModule],
  templateUrl: './liste-jeux.component.html',
  styleUrls: ['./liste-jeux.component.css']
})
export class ListeJeuxComponent implements OnInit {
  games: GameDeposit[] = []; 
  filteredGames: GameDeposit[] = []; 
  statutFilter: string = ''; 
  minPrice: number = 0; 
  maxPrice: number = 1000; 
  session: Session | null = null;
  user: User | null = null;
  
  constructor(private jeuDeposeService: JeuDeposeService, private sessionService: SessionService, private userService: UserService) {}

  ngOnInit(): void {
    this.session = this.sessionService.getCurrentSession();

    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
        });
      }
    });
    
    this.jeuDeposeService.getAllGames().subscribe((data: GameDeposit[]) => {
      this.games = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredGames = this.games.filter(game => {
      const matchStatut = this.statutFilter ? game.statut === this.statutFilter : true;
      const matchPrice = game.prix >= this.minPrice && game.prix <= this.maxPrice;
      return matchStatut && matchPrice;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  downloadCSV(): void {
    const headers = ["ID", "Nom du Jeu", "Statut", "Prix"];
    const rows = this.filteredGames.map(game => [
      game.id, 
      game.name,
      game.editeur,
      game.etat, 
      game.statut, 
      game.prix
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "jeux_filtrés.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
