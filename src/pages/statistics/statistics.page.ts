import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  shareOutline,
  statsChartOutline,
  homeOutline,
  walletOutline,
  personOutline,
  add,
  arrowDownOutline,
  arrowUpOutline,
} from 'ionicons/icons';

interface ExpenseItem {
  id: string;
  name: string;
  date: string;
  amount: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
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
    DecimalPipe
  ],
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage {
  activeTab: string = 'stats';
  selectedPeriod: string = 'Dia';

  // Dados do gráfico (simulado)
  chartData = [
    { month: 'Mar', value: 1200 },
    { month: 'Abr', value: 1900 },
    { month: 'Mai', value: 1230 },
    { month: 'Jun', value: 2200 },
    { month: 'Jul', value: 1800 },
    { month: 'Ago', value: 2100 },
    { month: 'Set', value: 1600 },
  ];

  expenses: ExpenseItem[] = [
    {
      id: '1',
      name: 'Starbucks',
      date: 'Jan 12, 2026',
      amount: 50,
      icon: '☕',
      color: '#27ae60',
    },
    {
      id: '2',
      name: 'Transferência',
      date: 'Ontem',
      amount: 85,
      icon: '💳',
      color: '#3D4EAF',
    },
    {
      id: '3',
      name: 'Youtube',
      date: 'Jan 16, 2026',
      amount: 29.99,
      icon: '▶️',
      color: '#e74c3c',
    },
  ];

  constructor(private router: Router) {
    addIcons({
      chevronBackOutline,
      shareOutline,
      statsChartOutline,
      homeOutline,
      walletOutline,
      personOutline,
      add,
      arrowDownOutline,
      arrowUpOutline,
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  setPeriod(period: string): void {
    this.selectedPeriod = period;
  }

  setActiveTab(tab: string): void {
    if (tab === 'home') {
      this.router.navigate(['/home']);
    } else if (tab === 'stats') {
      // Já estamos aqui
    } else if (tab === 'wallet') {
      this.router.navigate(['/carteira']);
    } else if (tab === 'profile') {
      this.router.navigate(['/perfil']);
    }
  }

  onFabClick(): void {
    this.router.navigate(['/adicionar-gasto']);
  }
}