import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonIcon,
  LoadingController, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon],
  templateUrl: './esqueci-senha.page.html',
  styleUrls: ['./esqueci-senha.page.scss'],
})
export class EsqueciSenhaPage {
  email = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
    addIcons({ chevronBackOutline, lockClosedOutline });
  }

  async enviar(): Promise<void> {
    if (!this.email) {
      await this.showAlert('Informe seu e-mail.');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Enviando...' });
    await loading.present();

    try {
      await this.authService.resetPassword(this.email);
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'E-mail enviado',
        message: 'Verifique sua caixa de entrada para redefinir sua senha.',
        buttons: [{ text: 'OK', handler: () => this.router.navigate(['/login']) }],
      });
      await alert.present();
    } catch (error: any) {
      await loading.dismiss();
      await this.showAlert(this.getMensagemErro(error.code));
    }
  }

  private async showAlert(message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Erro',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private getMensagemErro(code: string): string {
    const mensagens: Record<string, string> = {
      'auth/user-not-found': 'Nenhuma conta encontrada com este e-mail.',
      'auth/invalid-email': 'E-mail inválido.',
    };
    return mensagens[code] ?? 'Ocorreu um erro. Tente novamente.';
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
