import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, lockClosedOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-senha-seguranca',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon],
  templateUrl: './senha-seguranca.page.html',
  styleUrls: ['./senha-seguranca.page.scss'],
})
export class SenhaSegurancaPage {
  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';
  sucesso = false;

  constructor(
    private router: Router,
    private auth: Auth,
    private alertCtrl: AlertController,
  ) {
    addIcons({ chevronBackOutline, lockClosedOutline, checkmarkCircleOutline });
  }

  async alterarSenha(): Promise<void> {
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      return this.alerta('Preencha todos os campos.');
    }
    if (this.novaSenha !== this.confirmarSenha) {
      return this.alerta('As novas senhas não coincidem.');
    }
    if (this.novaSenha.length < 6) {
      return this.alerta('A nova senha deve ter pelo menos 6 caracteres.');
    }

    const user = this.auth.currentUser;
    if (!user || !user.email) return;

    try {
      const cred = EmailAuthProvider.credential(user.email, this.senhaAtual);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, this.novaSenha);
      this.senhaAtual = '';
      this.novaSenha = '';
      this.confirmarSenha = '';
      this.sucesso = true;
      setTimeout(() => (this.sucesso = false), 3000);
    } catch (e: any) {
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        this.alerta('Senha atual incorreta.');
      } else {
        this.alerta('Erro ao alterar senha. Tente novamente.');
      }
    }
  }

  private async alerta(msg: string): Promise<void> {
    const a = await this.alertCtrl.create({
      header: 'Atenção',
      message: msg,
      cssClass: 'edit-name-alert',
      buttons: ['OK'],
    });
    await a.present();
  }

  goBack(): void { this.router.navigate(['/perfil']); }
}
