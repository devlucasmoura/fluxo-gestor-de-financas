import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonIcon,
  LoadingController, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  senha = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
    addIcons({ chevronBackOutline });
  }

  async entrar(): Promise<void> {
    if (!this.email || !this.senha) {
      await this.showAlert('Preencha e-mail e senha.');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Entrando...' });
    await loading.present();

    try {
      await this.authService.login(this.email, this.senha);
      await loading.dismiss();
      this.router.navigate(['/home'], { replaceUrl: true });
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
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/invalid-email': 'E-mail inválido.',
      'auth/invalid-credential': 'E-mail ou senha incorretos.',
      'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.',
      'auth/user-disabled': 'Conta desativada.',
    };
    return mensagens[code] ?? 'Ocorreu um erro. Tente novamente.';
  }

  goBack(): void {
    this.router.navigate(['/onboarding']);
  }

  irParaCadastro(): void {
    this.router.navigate(['/cadastro']);
  }

  irParaEsqueciSenha(): void {
    this.router.navigate(['/esqueci-senha']);
  }
}
