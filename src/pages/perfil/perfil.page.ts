import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonFooter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  notificationsOutline,
  homeOutline,
  statsChartOutline,
  walletOutline,
  personOutline,
  add,
  personOutline as personIcon,
  peopleOutline,
  mailOutline,
  shieldCheckmarkOutline,
  lockClosedOutline,
  diamondOutline,
  cameraOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonFooter,
  ],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  activeTab: string = 'profile';
  profileImage: string | null = null;
  // Placeholder de avatar padrão
  defaultAvatar: string = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjY2NjYyI+PHBhdGggZD0iTTEyIDJDMi41IDEyIDIuNSAyMS41IDEyIDIxLjVTMjEuNSAxMiAyMS41IDIgMTIgMiAyIDJ6bTAgNWMxLjkzIDAgMy41IDEuNTcgMy41IDMuNVMxMy45MyAxNCAxMiAxNHMtMy41LTEuNTctMy41LTMuNVMxMC4wNyA3IDEyIDd6bTAgMTRjLTIuNjcgMC01LjMzLTEuMzMtNi40Ni0zLjUuMDItMS40OSAyLjk3LTIuNSA0Ljk2LTIuNSAxLjk5IDAgNC45NCAxLjAxIDQuOTYgMi41QTE3LjY3IDE3LjY3IDAgMCAxIDEyIDIxeiIvPjwvc3ZnPg==';

  constructor(private router: Router) {
    addIcons({
      chevronBackOutline,
      notificationsOutline,
      homeOutline,
      statsChartOutline,
      walletOutline,
      personOutline,
      add,
      personIcon,
      peopleOutline,
      mailOutline,
      shieldCheckmarkOutline,
      lockClosedOutline,
      diamondOutline,
      cameraOutline,
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerUpload() {
    const fileInput = document.getElementById('profile-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  setActiveTab(tab: string): void {
    if (tab === 'home') {
      this.router.navigate(['/home']);
    } else if (tab === 'stats') {
      this.router.navigate(['/statistics']);
    } else if (tab === 'wallet') {
      this.router.navigate(['/carteira']);
    } else if (tab === 'profile') {
      // Já estamos aqui
    }
  }

  onFabClick(): void {
    this.router.navigate(['/adicionar-gasto']);
  }
}