import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardContent,
  IonInput,
  IonLabel,
  IonFooter,
  IonModal,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  walletOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  closeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-adicionar-saldo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonCard,
    IonCardContent,
    IonInput,
    IonLabel,
    IonFooter,
    IonModal,
  ],
  templateUrl: './adicionar-saldo.page.html',
  styleUrls: ['./adicionar-saldo.page.scss'],
})
export class AdicionarSaldoPage {
  amount: string = '';
  isAlertModalOpen: boolean = false;
  alertMessage: string = '';

  constructor(private router: Router) {
    addIcons({
      chevronBackOutline,
      walletOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      closeOutline,
    });
  }

  goBack(): void {
    this.router.navigate(['/carteira']);
  }

  showAlert(message: string) {
    this.alertMessage = message;
    this.isAlertModalOpen = true;
  }

  confirmAddBalance() {
    if (!this.amount || parseFloat(this.amount) <= 0) {
      this.showAlert('Por favor, insira um valor válido para adicionar.');
      return;
    }

    // Lógica para salvar o saldo (simulada)
    console.log('Saldo adicionado:', this.amount);
    
    // Navegar de volta para a carteira
    this.router.navigate(['/carteira']);
  }
}