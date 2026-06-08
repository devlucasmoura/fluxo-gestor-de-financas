import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, trashOutline, mailOutline, shieldOutline } from 'ionicons/icons';

@Component({
  selector: 'app-gerenciar-contas',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon],
  templateUrl: './gerenciar-contas.page.html',
  styleUrls: ['./gerenciar-contas.page.scss'],
})
export class GerenciarContasPage implements OnInit {
  email = '';
  provider = '';
  criadoEm = '';

  constructor(
    private router: Router,
    private auth: Auth,
    private authService: AuthService,
    private alertCtrl: AlertController,
  ) {
    addIcons({ chevronBackOutline, trashOutline, mailOutline, shieldOutline });
  }

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (user) {
      this.email = user.email ?? '';
      this.provider = user.providerData[0]?.providerId === 'password' ? 'E-mail e senha' : 'Google';
      this.criadoEm = user.metadata.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString('pt-BR')
        : '';
    }
  }

  async confirmarExclusao(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Excluir conta',
      message: 'Digite sua senha para confirmar a exclusão permanente da conta.',
      cssClass: 'edit-name-alert',
      inputs: [{ name: 'senha', type: 'password', placeholder: 'Sua senha' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: async (data) => {
            const user = this.auth.currentUser;
            if (!user || !user.email) return;
            try {
              const cred = EmailAuthProvider.credential(user.email, data.senha);
              await reauthenticateWithCredential(user, cred);
              await deleteUser(user);
              this.router.navigate(['/onboarding'], { replaceUrl: true });
            } catch {
              this.mostrarErro('Senha incorreta. Tente novamente.');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  private async mostrarErro(msg: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Erro',
      message: msg,
      cssClass: 'edit-name-alert',
      buttons: ['OK'],
    });
    await alert.present();
  }

  goBack(): void { this.router.navigate(['/perfil']); }
}
