import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
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
  isBrand?: boolean;
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
  categoryIsBrand: boolean = false;
  price: string = '';
  date: string = new Date().toISOString();
  selectedFileName: string | null = null;

  readonly brandIcons: Record<string, string> = {
    netflix:    `<rect width="48" height="48" rx="10" fill="#E50914"/><text x="24" y="36" font-size="30" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">N</text>`,
    spotify:    `<rect width="48" height="48" rx="10" fill="#1DB954"/><path d="M13 19 Q24 13 35 17" stroke="white" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M14 25 Q24 20 34 23" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M16 31 Q24 27 32 29" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    uber:       `<rect width="48" height="48" rx="10" fill="#000000"/><text x="24" y="31" font-size="17" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">UBER</text>`,
    ifood:      `<rect width="48" height="48" rx="10" fill="#EA1D2C"/><text x="24" y="33" font-size="22" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">iFood</text>`,
    amazon:     `<rect width="48" height="48" rx="10" fill="#FF9900"/><text x="24" y="26" font-size="13" font-weight="900" fill="#232F3E" text-anchor="middle" font-family="Arial,sans-serif">amazon</text><path d="M13 34 Q24 42 35 34" stroke="#232F3E" stroke-width="2.5" fill="none" stroke-linecap="round"/><polygon points="32,31 35,34 32,37" fill="#232F3E"/>`,
    nubank:     `<rect width="48" height="48" rx="10" fill="#820AD1"/><text x="24" y="32" font-size="22" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">Nu</text>`,
    mcdonalds:  `<rect width="48" height="48" rx="10" fill="#DA291C"/><text x="24" y="38" font-size="34" font-weight="900" fill="#FFC72C" text-anchor="middle" font-family="Arial,sans-serif">M</text>`,
    steam:      `<rect width="48" height="48" rx="10" fill="#1B2838"/><text x="24" y="31" font-size="12" font-weight="700" fill="white" text-anchor="middle" font-family="Arial,sans-serif">STEAM</text>`,
    youtube:    `<rect width="48" height="48" rx="10" fill="white"/><rect x="3" y="11" width="42" height="26" rx="6" fill="#FF0000"/><polygon points="19,16 19,32 34,24" fill="white"/>`,
    paypal:     `<rect width="48" height="48" rx="10" fill="white"/><text x="11" y="33" font-size="26" font-weight="900" fill="#003087" font-family="Arial,sans-serif">P</text><text x="23" y="33" font-size="26" font-weight="900" fill="#009CDE" font-family="Arial,sans-serif">P</text>`,
  };

  // Categorias pré-definidas
  categories: Category[] = [
    { id: 'food',          name: 'Alimentação',   icon: '🍔',        color: '#FF9F43' },
    { id: 'transport',     name: 'Transporte',    icon: '🚗',        color: '#3498DB' },
    { id: 'entertainment', name: 'Entretenimento',icon: '🎬',        color: '#9B59B6' },
    { id: 'other',         name: 'Outros',        icon: '📦',        color: '#95A5A6' },
    { id: 'netflix',       name: 'Netflix',       icon: 'netflix',   color: '#E50914', isBrand: true },
    { id: 'spotify',       name: 'Spotify',       icon: 'spotify',   color: '#1DB954', isBrand: true },
    { id: 'uber',          name: 'Uber',          icon: 'uber',      color: '#000000', isBrand: true },
    { id: 'ifood',         name: 'iFood',         icon: 'ifood',     color: '#EA1D2C', isBrand: true },
    { id: 'amazon',        name: 'Amazon',        icon: 'amazon',    color: '#FF9900', isBrand: true },
    { id: 'nubank',        name: 'Nubank',        icon: 'nubank',    color: '#820AD1', isBrand: true },
    { id: 'mcdonalds',     name: "McDonald's",    icon: 'mcdonalds', color: '#DA291C', isBrand: true },
    { id: 'steam',         name: 'Steam',         icon: 'steam',     color: '#1B2838', isBrand: true },
    { id: 'youtube',       name: 'YouTube',       icon: 'youtube',   color: '#FF0000', isBrand: true },
    { id: 'paypal',        name: 'PayPal',        icon: 'paypal',    color: '#003087', isBrand: true },
  ];

  constructor(private router: Router, private transactionService: TransactionService) {
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

  getBrandSvg(key: string): string {
    const content = this.brandIcons[key] ?? '';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${content}</svg>`
    );
  }

  selectCategory(category: Category) {
    this.categoryName = category.name;
    this.categoryIcon = category.icon;
    this.categoryIsBrand = !!category.isBrand;
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
    if (!this.price || parseFloat(this.price) <= 0) {
      this.showAlert('Por favor, insira um valor válido');
      return;
    }

    this.transactionService.add({
      name: this.expenseName,
      amount: parseFloat(this.price),
      date: new Date().toISOString().split('T')[0],
      category: this.categoryName,
      icon: this.categoryIcon,
      type: 'expense',
    });

    this.expenseName = '';
    this.categoryName = '';
    this.categoryIcon = '📦';
    this.price = '';
    this.date = new Date().toISOString();
    this.selectedFileName = null;

    this.router.navigate(['/home']);
  }
}