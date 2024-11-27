import { Component, Input } from '@angular/core';
import { GameDeposit } from '../../Models/GameDeposit';
import { User } from '../../Models/User';
import { UserService } from '../../Services/UserService';
import { Session } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';

@Component({
  selector: 'app-afficher-jeu',
  standalone: true,
  imports: [],
  templateUrl: './afficher-jeu.component.html',
  styleUrl: './afficher-jeu.component.css'
})
export class AfficherJeuComponent {

  user: User | null = null;
  sessionChose!: Session | null;
  @Input() public listeJeu: GameDeposit[] = [];

  constructor(private userService: UserService, private sessionService : SessionService) {}
  ngOnInit(){
    this.sessionChose = this.sessionService.getCurrentSession();
 
    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
        });
      }
    });
  }

}
