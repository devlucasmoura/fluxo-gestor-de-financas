import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService, UserProfile } from '../../services/user.service';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dados-pessoais',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon],
  templateUrl: './dados-pessoais.page.html',
  styleUrls: ['./dados-pessoais.page.scss'],
})
export class DadosPessoaisPage implements OnInit {
  nome = '';
  email = '';
  criadoEm = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) {
    addIcons({ chevronBackOutline });
  }

  async ngOnInit(): Promise<void> {
    const user = this.authService.currentUser;
    if (!user) return;

    this.email = user.email ?? '';

    const profile = await this.userService.getProfile(user.uid);
    if (profile) {
      this.nome = profile.nome;
      this.criadoEm = profile.criadoEm
        ? new Date(profile.criadoEm).toLocaleDateString('pt-BR')
        : '';
    } else {
      this.nome = user.displayName ?? '';
    }
  }

  goBack(): void {
    this.router.navigate(['/perfil']);
  }
}
