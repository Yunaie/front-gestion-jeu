import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Services/authService';
import { CommonModule } from '@angular/common';
import { User } from '../../Models/User';
import { UserService } from '../../Services/UserService';
import { SessionService } from '../../Services/SessionService';

@Component({
    selector: 'root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './Root.component.html',
    styleUrl: './Root.component.css'
})


export class RootComponent implements OnInit {

    user: User | null = null;

    constructor(private auth: AuthService, private userService: UserService, private sessionService: SessionService) { }

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

    logout() {
        this.auth.logout();
        this.sessionService.clearCurrentSession();

    }
}


