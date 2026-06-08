import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonInput,
  IonLabel,
  IonItem,
  IonText,
  IonNote,
  IonFooter,
  IonModal,
  IonList,
  IonSelect,
  IonSelectOption,
  IonDatetime,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  homeOutline,
  statsChartOutline,
  walletOutline,
  personOutline,
  add,
  calendarOutline,
  closeOutline,
  checkmarkCircle,
  chevronDownOutline,
  alertCircleOutline,
  attachOutline,
  documentOutline,
  trashOutline,
} from 'ionicons/icons';

interface Expense {
  id: string;
  name: string;
  price: number;
  date: string;
  category: string;
  icon: string;
  receipt?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-adicionar-gasto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonInput,
    IonLabel,
    IonItem,
    IonText,
    IonNote,
    IonFooter,
    IonModal,
    IonList,
    IonSelect,
    IonSelectOption,
    IonDatetime,
  ],
  templateUrl: './adicionar-gasto.page.html',
  styleUrls: ['./adicionar-gasto.page.scss'],
})
export class AdicionarGastoPage {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  activeTab: string = 'add';
  
  // Modal states
  isCategoryModalOpen: boolean = false;
  isAlertModalOpen: boolean = false;
  isDateModalOpen: boolean = false;
  alertMessage: string = '';

  // Form data
  expenseName: string = '';
  categoryName: string = '';
  categoryIcon: string = '📦';
  price: string = '';
  date: string = new Date().toISOString();
  selectedFileName: string | null = null;

  // Categorias pré-definidas
  categories: Category[] = [
    {
      id: 'food',
      name: 'Alimentação',
      icon: '🍔',
      color: '#FF9F43',
    },
    {
      id: 'transport',
      name: 'Transporte',
      icon: '🚗',
      color: '#3498DB',
    },
    {
      id: 'entertainment',
      name: 'Entretenimento',
      icon: '🎬',
      color: '#9B59B6',
    },
    {
      id: 'other',
      name: 'Outros',
      icon: '📦',
      color: '#95A5A6',
    },
  ];

  constructor(private router: Router) {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      chevronDownOutline,
      calendarOutline,
      closeOutline,
      checkmarkCircle,
      alertCircleOutline,
      homeOutline,
      statsChartOutline,
      add,
      walletOutline,
      personOutline,
      attachOutline,
      documentOutline,
      trashOutline,
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  setActiveTab(tab: string): void {
    if (tab === 'home') {
      this.router.navigate(['/home']);
    } else if (tab === 'stats') {
      this.router.navigate(['/statistics']);
    } else if (tab === 'wallet') {
      this.router.navigate(['/carteira']);
    } else if (tab === 'profile') {
      this.router.navigate(['/perfil']);
    }
  }

  onFabClick(): void {
    this.router.navigate(['/adicionar-gasto']);
  }

  openCategoryModal() {
    this.isCategoryModalOpen = true;
  }

  selectCategory(category: Category) {
    this.categoryName = category.name;
    this.categoryIcon = category.icon;
    this.isCategoryModalOpen = false;
  }

  openDateModal() {
    this.isDateModalOpen = true;
  }

  closeDateModal() {
    this.isDateModalOpen = false;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }

  removeFile() {
    this.selectedFileName = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  showAlert(message: string) {
    this.alertMessage = message;
    this.isAlertModalOpen = true;
  }

  saveExpense(): void {
    if (!this.expenseName) {
      this.showAlert('Por favor, digite o nome do gasto');
      return;
    }

    if (!this.categoryName) {
      this.showAlert('Por favor, selecione uma categoria');
      return;
    }

    if (!this.price) {
      this.showAlert('Por favor, insira um valor');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      name: this.expenseName,
      price: parseFloat(this.price),
      date: this.date,
      category: this.categoryName,
      icon: this.categoryIcon,
      receipt: this.selectedFileName || undefined
    };

    console.log('Expense saved:', expense);
    this.router.navigate(['/home']);
  }
}