import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonFooter,
  IonSegment,
  IonSegmentButton,
  IonNote,
  IonAvatar,
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
  bulbOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';

interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  icon: string;
}

interface UpcomingBill {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  icon: string;
  tip?: string;
}

@Component({
  selector: 'app-carteira',
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
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonFooter,
    IonSegment,
    IonSegmentButton,
    IonNote,
    IonAvatar,
    DecimalPipe
  ],
  templateUrl: './carteira.page.html',
  styleUrls: ['./carteira.page.scss'],
})
export class CarteiraPage {
  activeTab: string = 'wallet';
  selectedSegment: string = 'transactions';
  balance: number = 2548.00;

  transactions: Transaction[] = [
    { id: '1', name: 'Upwork', date: 'Hoje', amount: 850.00, type: 'income', icon: 'UP' },
    { id: '2', name: 'Transferência', date: 'Ontem', amount: 85.00, type: 'expense', icon: '💳' },
    { id: '3', name: 'Paypal', date: 'Jan 30, 2026', amount: 1406.00, type: 'income', icon: 'PP' },
    { id: '4', name: 'Youtube', date: 'Jan 16, 2026', amount: 29.99, type: 'expense', icon: '▶️' },
  ];

  upcomingBills: UpcomingBill[] = [
    { 
      id: '1', 
      name: 'Youtube', 
      dueDate: 'Fev 28, 2026', 
      amount: 29.99, 
      icon: '▶️',
      tip: 'Considere o plano familiar para economizar se dividir com amigos.'
    },
    { 
      id: '2', 
      name: 'Eletricidade', 
      dueDate: 'Mar 28, 2026', 
      amount: 150.00, 
      icon: '⚡',
      tip: 'Evite usar aparelhos de alto consumo nos horários de pico.'
    },
    { 
      id: '3', 
      name: 'Aluguel', 
      dueDate: 'Mar 31, 2026', 
      amount: 1200.00, 
      icon: '🏠',
      tip: 'Pagando antecipado você evita juros e organiza melhor seu mês.'
    },
    { 
      id: '4', 
      name: 'Spotify', 
      dueDate: 'Fev 28, 2026', 
      amount: 21.90, 
      icon: '🎵',
      tip: 'Verifique se você tem direito ao desconto universitário.'
    },
  ];

  constructor(private router: Router) {
    addIcons({
      chevronBackOutline,
      notificationsOutline,
      homeOutline,
      statsChartOutline,
      walletOutline,
      personOutline,
      add,
      bulbOutline,
      checkmarkCircleOutline,
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  setActiveTab(tab: string): void {
    if (tab === 'home') {
      this.router.navigate(['/home']);
    } else if (tab === 'stats') {
      this.router.navigate(['/statistics']);
    } else if (tab === 'wallet') {
      // Já estamos aqui
    } else if (tab === 'profile') {
      this.router.navigate(['/perfil']);
    }
  }

  onFabClick(): void {
    this.router.navigate(['/adicionar-gasto']);
  }

  addBalance() {
    this.router.navigate(['/adicionar-saldo']);
  }
}