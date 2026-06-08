import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonIcon, IonCheckbox,
  LoadingController, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonCheckbox],
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  aceitouTermos = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
    addIcons({ chevronBackOutline });
  }

  async criar(): Promise<void> {
    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      await this.showAlert('Preencha todos os campos.');
      return;
    }
    if (this.senha !== this.confirmarSenha) {
      await this.showAlert('As senhas não coincidem.');
      return;
    }
    if (this.senha.length < 6) {
      await this.showAlert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!this.aceitouTermos) {
      await this.showAlert('Aceite os termos para continuar.');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Criando conta...' });
    await loading.present();

    try {
      const cred = await this.authService.register(this.email, this.senha, this.nome);

      await this.userService.saveProfile(cred.user.uid, {
        nome: this.nome,
        email: this.email,
        criadoEm: new Date().toISOString(),
      });

      await loading.dismiss();
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (error: any) {
      await loading.dismiss();
      await this.showAlert(this.getMensagemErro(error.code));
    }
  }

  private async showAlert(message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Atenção',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private getMensagemErro(code: string): string {
    const mensagens: Record<string, string> = {
      'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
      'auth/invalid-email': 'E-mail inválido.',
      'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
    };
    return mensagens[code] ?? 'Ocorreu um erro. Tente novamente.';
  }

  goBack(): void {
    this.router.navigate(['/onboarding']);
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
