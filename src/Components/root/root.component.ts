import { Component, HostListener,Renderer2, Input, OnInit } from '@angular/core';
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
    darkMode = false;

    constructor(private renderer: Renderer2, private auth: AuthService, private userService: UserService, private sessionService: SessionService) {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            this.darkMode = true;
            this.renderer.addClass(document.body, 'dark-theme');
        }
    }

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

    @HostListener('window:scroll', ['$event'])
    onScroll() {
      const scrollTop = window.scrollY;
      const newSize = 100 + scrollTop / 10; // Ajuste ce facteur selon l'effet voulu
  
      const backgroundElement = document.querySelector('.my-component') as HTMLElement;
  
      if (backgroundElement) {
        backgroundElement.style.backgroundSize = `${newSize}%`;
      }
    }


    logout() {
        this.auth.logout();
        this.sessionService.clearCurrentSession();
    }
}


