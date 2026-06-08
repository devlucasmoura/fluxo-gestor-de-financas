import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Auth, updateProfile } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonFooter,
  AlertController,
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
  logOutOutline,
  pencilOutline,
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
export class PerfilPage implements OnInit {
  activeTab: string = 'profile';
  profileImage: string | null = null;
  defaultAvatar: string = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjY2NjYyI+PHBhdGggZD0iTTEyIDJDMi41IDEyIDIuNSAyMS41IDEyIDIxLjVTMjEuNSAxMiAyMS41IDIgMTIgMiAyIDJ6bTAgNWMxLjkzIDAgMy41IDEuNTcgMy41IDMuNVMxMy45MyAxNCAxMiAxNHMtMy41LTEuNTctMy41LTMuNVMxMC4wNyA3IDEyIDd6bTAgMTRjLTIuNjcgMC01LjMzLTEuMzMtNi40Ni0zLjUuMDItMS40OSAyLjk3LTIuNSA0Ljk2LTIuNSAxLjk5IDAgNC45NCAxLjAxIDQuOTYgMi41QTE3LjY3IDE3LjY3IDAgMCAxIDEyIDIxeiIvPjwvc3ZnPg==';
  userName = '';
  userEmail = '';
  userHandle = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private auth: Auth,
  ) {
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
      logOutOutline,
      pencilOutline,
    });
  }

  ngOnInit(): void {
    this.authService.user$.pipe(take(1)).subscribe((u) => {
      this.userName = u?.displayName || u?.email?.split('@')[0] || 'Usuário';
      this.userEmail = u?.email ?? '';
      this.userHandle = '@' + (u?.email?.split('@')[0] ?? 'usuario');

      const uid = u?.uid;
      if (uid) {
        const savedPhoto = localStorage.getItem(`avatar_${uid}`);
        if (savedPhoto) this.profileImage = savedPhoto;
      }
    });
  }

  async editName(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar nome',
      cssClass: 'edit-name-alert',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          value: this.userName,
          placeholder: 'Seu nome completo',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: async (data) => {
            const novoNome = data.nome?.trim();
            if (!novoNome) return;
            const user = this.auth.currentUser;
            if (user) {
              await updateProfile(user, { displayName: novoNome });
              this.userName = novoNome;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64 = e.target.result as string;
      this.profileImage = base64;

      const uid = this.auth.currentUser?.uid;
      if (uid) localStorage.setItem(`avatar_${uid}`, base64);
    };
    reader.readAsDataURL(file);
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

  irParaDadosPessoais(): void { this.router.navigate(['/dados-pessoais']); }
  irParaGerenciarContas(): void { this.router.navigate(['/gerenciar-contas']); }
  irParaMensagens(): void { this.router.navigate(['/mensagens']); }
  irParaSenhaSeguranca(): void { this.router.navigate(['/senha-seguranca']); }
  irParaDataPrivacidade(): void { this.router.navigate(['/data-privacidade']); }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
    });
  }

  onFabClick(): void {
    this.router.navigate(['/adicionar-gasto']);
  }
}