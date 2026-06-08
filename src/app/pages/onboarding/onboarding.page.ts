import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [IonButton],
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage {
  constructor(private router: Router) {}

  comecar(): void {
    this.router.navigate(['/cadastro']);
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
