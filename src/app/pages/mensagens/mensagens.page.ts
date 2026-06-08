import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, notificationsOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mensagens',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon],
  templateUrl: './mensagens.page.html',
  styleUrls: ['./mensagens.page.scss'],
})
export class MensagensPage {
  constructor(private router: Router) {
    addIcons({ chevronBackOutline, notificationsOffOutline });
  }

  goBack(): void { this.router.navigate(['/perfil']); }
}
