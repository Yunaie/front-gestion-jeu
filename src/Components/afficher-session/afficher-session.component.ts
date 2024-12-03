import { Component, Input, OnInit } from '@angular/core';
import { Session, StatutRole } from '../../Models/Session';
import { SessionService } from '../../Services/SessionService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../Services/UserService';
import { User } from '../../Models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-afficher-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './afficher-session.component.html',
  styleUrls: ['./afficher-session.component.css']
})
export class AfficherSessionComponent implements OnInit {

  @Input() public session: Session | null = null;
  errorMessage: string = "";
  private editingSessions: { [id: string]: boolean } = {};
  user!: User | null;
  constructor( private router: Router,public sessionService: SessionService, private userService: UserService) { }

  ngOnInit() {
    this.userService.getFireBaseUser().subscribe(userData => {
      this.user = userData || null;
      if (this.user) {
        this.userService.getUserById(this.user.id).subscribe(userData => {
          this.user = userData || null;
        });
      }
    });
  
  }

  redirectToSessionPage() {
    if (this.session) {
      this.router.navigate(['/modifierSession'], { queryParams: { idsession: this.session.id } });
    } else {
      console.error('L\'ID de la session est introuvable');
      alert('Impossible de rediriger : aucune session sélectionnée.');
    }
  }
  


  isAdmin(user: User): boolean {
    return this.userService.IsAdmin(user);
  }

  isSessionOpen(session: Session): boolean {
    return session.statut === StatutRole.ouvert;
  }

  toggleEdit(session: Session) {
    if (!this.isSessionOpen(session)) {
      this.editingSessions[session.id] = !this.isEditing(session);
      this.errorMessage = "";
    } else {
      this.errorMessage = "Cette session est ouverte, vous ne pouvez pas la modifier.";
    }
  }

  isEditing(session: Session): boolean {
    return this.editingSessions[session.id] || false;
  }

  isFieldEditable(session: Session, field: string): boolean {
    return !this.isSessionOpen(session) && this.isEditing(session);
  }

  saveChanges(session: Session) {
    const sessionData = {
      name: session.name,
      dateDebut: session.dateDebut,
      dateFin: session.dateFin,
      frais: session.frais,
      commissionsPourcentages: session.commissionsPourcentages,
      TotalSommeComissions: session.TotalSommeComissions,
      TotalSommeFrais : session.TotalSommeFrais,
      statut : session.statut
    };

    console.log('Données envoyées à Firebase :', sessionData);

    this.sessionService.modifySession(session.id, sessionData)
      .then(() => {
        console.log('Session modifiée avec succès');
        alert('Modifications sauvegardées avec succès !');
        this.toggleEdit(session);
      })
      .catch(error => {
        console.error('Erreur lors de la modification de la session:', error);
        alert('Erreur lors de la sauvegarde des modifications.');
      });
  }

}
