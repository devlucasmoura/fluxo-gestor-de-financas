import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [],
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.authService.user$.pipe(take(1)).subscribe((u) => {
        if (u) {
          this.router.navigate(['/home'], { replaceUrl: true });
        } else {
          this.router.navigate(['/onboarding'], { replaceUrl: true });
        }
      });
    }, 2500);
  }
}
