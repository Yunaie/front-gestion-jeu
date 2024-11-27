import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common'; 
import { User } from '../../Models/User';
import { UserService } from '../../Services/UserService';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent implements OnInit {

  user!: User | null; 

  constructor(private afAuth: AngularFireAuth, private userService: UserService) {}

  ngOnInit(): void {
    
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
