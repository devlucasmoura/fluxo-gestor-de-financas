import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-data-privacidade',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon],
  templateUrl: './data-privacidade.page.html',
  styleUrls: ['./data-privacidade.page.scss'],
})
export class DataPrivacidadePage {
  constructor(private router: Router) {
    addIcons({ chevronBackOutline });
  }

  goBack(): void { this.router.navigate(['/perfil']); }
}
