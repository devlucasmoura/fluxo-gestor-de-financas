import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonButton,
  IonButtons,
  IonFooter,
  IonThumbnail,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  notificationsOutline,
  chevronUpOutline,
  ellipsisHorizontal,
  arrowDownOutline,
  arrowUpOutline,
  homeOutline,
  statsChartOutline,
  walletOutline,
  personOutline,
  add,
} from 'ionicons/icons';

interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  icon: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonIcon,
    IonButton,
    IonButtons,
    IonFooter,
    IonThumbnail,
    IonNote,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  activeTab: string = 'home';

  transactions: Transaction[] = [
    {
      id: '1',
      name: 'Upwork',
      date: 'Hoje',
      amount: 850,
      type: 'income',
      icon: 'upwork',
    },
    {
      id: '2',
      name: 'Transferência',
      date: 'Ontem',
      amount: 85,
      type: 'expense',
      icon: 'transfer',
    },
    {
      id: '3',
      name: 'Paypal',
      date: 'Jan 30, 2026',
      amount: 1406,
      type: 'income',
      icon: 'paypal',
    },
    {
      id: '4',
      name: 'Youtube',
      date: 'Jan 16, 2026',
      amount: 29.99,
      type: 'expense',
      icon: 'youtube',
    },
  ];

  expenseCategories: ExpenseCategory[] = [
    {
      id: '1',
      name: 'Alimentação',
      amount: 450,
      percentage: 35,
      color: '#FF9F43',
      icon: '🍔',
    },
    {
      id: '2',
      name: 'Transporte',
      amount: 280,
      percentage: 22,
      color: '#3498DB',
      icon: '🚗',
    },
    {
      id: '3',
      name: 'Entretenimento',
      amount: 200,
      percentage: 15,
      color: '#9B59B6',
      icon: '🎬',
    },
    {
      id: '4',
      name: 'Outros',
      amount: 154,
      percentage: 12,
      color: '#95A5A6',
      icon: '📦',
    },
  ];

  constructor(private router: Router) {
    addIcons({
      notificationsOutline,
      chevronUpOutline,
      ellipsisHorizontal,
      arrowDownOutline,
      arrowUpOutline,
      homeOutline,
      statsChartOutline,
      walletOutline,
      personOutline,
      add,
    });
  }

  setActiveTab(tab: string): void {
    if (tab === 'stats') {
      this.router.navigate(['/statistics']);
    } else if (tab === 'wallet') {
      this.router.navigate(['/carteira']);
    } else if (tab === 'home') {
      this.activeTab = 'home';
    } else if (tab === 'profile') {
      this.router.navigate(['/perfil']);
    }
  }

  onFabClick(): void {
    this.router.navigate(['/adicionar-gasto']);
  }

  getTransactionIcon(iconType: string): string {
    const iconMap: { [key: string]: string } = {
      upwork: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iIzZGQzU3MCIvPjx0ZXh0IHg9IjI0IiB5PSIyNCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VXA8L3RleHQ+PC9zdmc+',
      transfer: 'https://i.pravatar.cc/150?u=transfer',
      paypal: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iIzAwMzA4NyIvPjx0ZXh0IHg9IjI0IiB5PSIyNCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UDwvdGV4dD48L3N2Zz4=',
      youtube: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iI0ZGMDAwMCIvPjx0ZXh0IHg9IjI0IiB5PSIyNCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4pyGPC90ZXh0Pjwvc3ZnPg==',
    };
    return iconMap[iconType] || 'https://i.pravatar.cc/150?u=default';
  }
}