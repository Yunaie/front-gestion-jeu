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
  imports: [AfficherJeuComponent,FormsModule],
  templateUrl: './liste-jeux.component.html',
  styleUrls: ['./liste-jeux.component.css']
})
export class ListeJeuxComponent implements OnInit {
  games: GameDeposit[] = []; 
  filteredGames: GameDeposit[] = []; 
  statutFilter: string = ''; 
  minPrice: number = 0; 
  maxPrice: number = 1000; 
  session : Session | null = null;
  user: User | null = null;
  
  constructor(private jeuDeposeService: JeuDeposeService,private sessionService : SessionService, private userService: UserService, private gameService: JeuDeposeService) {}

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
}
