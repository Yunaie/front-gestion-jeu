import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../Services/SessionService';
import { Router } from '@angular/router';
import { GameDeposit } from '../../Models/GameDeposit';
import { Session } from '../../Models/Session';
import { User } from '../../Models/User';
import { StatutRole } from '../../Models/Session';
import { UserService } from '../../Services/UserService';

@Component({
  selector: 'app-ajt-session',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ajouter-session.component.html',
  styleUrls: ['./ajouter-session.component.css']
})
export class AjouterSessionComponent implements OnInit {
  SessionForm!: FormGroup;

  @Input() public listeSession: Session[] = [];
  Admin: User | null = null;
  @Output() public sessionsMisAJour = new EventEmitter<Session[]>();

  constructor(private auth: AuthService, private userService: UserService, private SessionService: SessionService, private router: Router) { }

  ngOnInit() {

    this.userService.getFireBaseUser().subscribe(userData => {
      this.Admin = userData || null;
      if (this.Admin) {
        this.userService.getUserById(this.Admin.id).subscribe(userData => {
          this.Admin = userData || null;
        });
      }
    });

    this.SessionForm = new FormGroup({
      name: new FormControl('', Validators.required),
      dateDebut: new FormControl('', Validators.required),
      dateFin: new FormControl('', Validators.required),
      frais: new FormControl('', Validators.required),
      commissionsPourcentages: new FormControl('', Validators.required),

    });
  }

  AjouterSession() {
    if (this.SessionForm.valid) {
      const name = this.SessionForm.get('name')?.value;
      const dateDebut = this.SessionForm.get('dateDebut')?.value;
      const dateFin = this.SessionForm.get('dateFin')?.value;
      const frais = this.SessionForm.get('frais')?.value;
      const commissionsPourcentages = this.SessionForm.get('commissionsPourcentages')?.value;
      const adminCreateurId = this.Admin!.id;
      const TotalSommeComissions = 0;
      const TotalSommeFrais = 0;


      this.SessionService.createSession(name, StatutRole.fermer, dateDebut, dateFin, adminCreateurId, frais, commissionsPourcentages, TotalSommeComissions,TotalSommeFrais).then(docRef => {
        const id = docRef.id;

        const nouvelleSession: Session = {
          id,
          name,
          statut: StatutRole.fermer,
          dateDebut: new Date(dateDebut),
          dateFin: new Date(dateFin),
          adminCreateurId,
          frais,
          commissionsPourcentages,
          TotalSommeComissions,
          TotalSommeFrais,
      };
      


        this.listeSession.push(nouvelleSession);

        this.sessionsMisAJour.emit(this.listeSession);

        this.SessionForm.reset();
      }).catch(error => {
        console.error('Erreur lors de la création du jeu:', error);
      });
    } else {
      console.error('Le formulaire n\'est pas valide');
    }
  }
}
