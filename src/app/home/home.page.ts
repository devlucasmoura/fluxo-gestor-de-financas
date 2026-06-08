import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { BalanceService } from '../services/balance.service';
import { TransactionService } from '../services/transaction.service';
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
  IonSpinner,
  AlertController,
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
  pencilOutline,
  trashOutline,
} from 'ionicons/icons';

type Currency = 'BRL' | 'USD' | 'EUR';

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
  isBrand?: boolean;
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
    IonSpinner,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  activeTab: string = 'home';
  userName = 'Usuário';
  greeting = 'Bom dia';

  currentCurrency: Currency = 'BRL';
  rates = { USD: 1, EUR: 1 };
  loadingRates = false;

  balanceBRL = 2548.00;
  incomeBRL = 1840.00;
  expensesBRL = 284.00;
  transactions: Transaction[] = [];

  expenseCategories: ExpenseCategory[] = [];
  editMode: boolean = false;

  private readonly categoryMeta: Record<string, { color: string; icon: string }> = {
    'Alimentação':    { color: '#FF9F43', icon: '🍔' },
    'Transporte':     { color: '#3498DB', icon: '🚗' },
    'Entretenimento': { color: '#9B59B6', icon: '🎬' },
    'Conta':          { color: '#E74C3C', icon: '📄' },
    'Outros':         { color: '#95A5A6', icon: '📦' },
  };

  private readonly brandColors: Record<string, string> = {
    netflix: '#E50914', spotify: '#1DB954', uber: '#000000',
    ifood: '#EA1D2C', amazon: '#FF9900', nubank: '#820AD1',
    mcdonalds: '#DA291C', steam: '#1B2838', youtube: '#FF0000',
    paypal: '#003087', starbucks: '#00704A',
  };

  private readonly brandSvgs: Record<string, string> = {
    netflix:   `<rect width="48" height="48" rx="10" fill="#E50914"/><text x="24" y="36" font-size="30" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">N</text>`,
    spotify:   `<rect width="48" height="48" rx="10" fill="#1DB954"/><path d="M13 19 Q24 13 35 17" stroke="white" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M14 25 Q24 20 34 23" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M16 31 Q24 27 32 29" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    uber:      `<rect width="48" height="48" rx="10" fill="#000000"/><text x="24" y="31" font-size="17" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">UBER</text>`,
    ifood:     `<rect width="48" height="48" rx="10" fill="#EA1D2C"/><text x="24" y="33" font-size="22" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">iFood</text>`,
    amazon:    `<rect width="48" height="48" rx="10" fill="#FF9900"/><text x="24" y="26" font-size="13" font-weight="900" fill="#232F3E" text-anchor="middle" font-family="Arial,sans-serif">amazon</text><path d="M13 34 Q24 42 35 34" stroke="#232F3E" stroke-width="2.5" fill="none" stroke-linecap="round"/><polygon points="32,31 35,34 32,37" fill="#232F3E"/>`,
    nubank:    `<rect width="48" height="48" rx="10" fill="#820AD1"/><text x="24" y="32" font-size="22" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">Nu</text>`,
    mcdonalds: `<rect width="48" height="48" rx="10" fill="#DA291C"/><text x="24" y="38" font-size="34" font-weight="900" fill="#FFC72C" text-anchor="middle" font-family="Arial,sans-serif">M</text>`,
    steam:     `<rect width="48" height="48" rx="10" fill="#1B2838"/><text x="24" y="31" font-size="12" font-weight="700" fill="white" text-anchor="middle" font-family="Arial,sans-serif">STEAM</text>`,
    youtube:   `<rect width="48" height="48" rx="10" fill="white"/><rect x="3" y="11" width="42" height="26" rx="6" fill="#FF0000"/><polygon points="19,16 19,32 34,24" fill="white"/>`,
    paypal:    `<rect width="48" height="48" rx="10" fill="white"/><text x="11" y="33" font-size="26" font-weight="900" fill="#003087" font-family="Arial,sans-serif">P</text><text x="23" y="33" font-size="26" font-weight="900" fill="#009CDE" font-family="Arial,sans-serif">P</text>`,
  };

  getBrandSvg(key: string): string {
    if (key === 'starbucks') return 'assets/starbucks.png';
    const content = this.brandSvgs[key] ?? '';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${content}</svg>`
    );
  }

  isBrandIcon(icon: string): boolean {
    return icon in this.brandSvgs || icon === 'starbucks';
  }

  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private balanceService: BalanceService, private alertCtrl: AlertController, private transactionService: TransactionService) {
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
      pencilOutline,
      trashOutline,
    });
  }

  ngOnInit(): void {
    this.greeting = this.getGreeting();
    this.fetchRates();
  }

  ionViewWillEnter(): void {
    this.authService.user$.pipe(take(1)).subscribe((u) => {
      const displayName = u?.displayName || u?.email?.split('@')[0] || 'Usuário';
      this.userName = displayName.split(' ')[0];
    });
    this.balanceBRL = this.balanceService.current;
    this.incomeBRL = this.balanceService.currentRenda;
    this.transactions = this.transactionService.all.slice(0, 4);
    this.expensesBRL = this.transactionService.totalExpenses;
    this.expenseCategories = this.computeCategories();
  }

  async editarRenda(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar renda',
      cssClass: 'edit-name-alert',
      inputs: [
        {
          name: 'valor',
          type: 'number',
          value: this.incomeBRL,
          placeholder: 'Valor da renda',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (data) => {
            const novo = parseFloat(data.valor);
            if (!isNaN(novo) && novo >= 0) {
              this.balanceService.setRenda(novo);
              this.incomeBRL = novo;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  private computeCategories(): ExpenseCategory[] {
    const all = this.transactionService.all;
    const total = all.reduce((s, t) => s + t.amount, 0);
    if (total === 0) return [];

    const grouped: Record<string, { amount: number; icon: string }> = {};
    for (const t of all) {
      const key = t.category || 'Outros';
      if (!grouped[key]) grouped[key] = { amount: 0, icon: t.icon };
      grouped[key].amount += t.amount;
    }

    return Object.entries(grouped).map(([name, data], i) => {
      const isBrand = this.isBrandIcon(data.icon);
      const meta = this.categoryMeta[name];
      const color = isBrand
        ? (this.brandColors[data.icon] ?? '#95A5A6')
        : (meta?.color ?? '#95A5A6');
      return {
        id: String(i + 1),
        name,
        amount: data.amount,
        percentage: Math.round((data.amount / total) * 100),
        color,
        icon: data.icon,
        isBrand,
      };
    }).sort((a, b) => b.amount - a.amount);
  }

  private getGreeting(): string {
    const hour = parseInt(
      new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false })
    );
    if (hour >= 6 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  fetchRates(): void {
    this.loadingRates = true;
    this.http
      .get<any>('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL')
      .subscribe({
        next: (data) => {
          this.rates.USD = parseFloat(data.USDBRL.bid);
          this.rates.EUR = parseFloat(data.EURBRL.bid);
          this.loadingRates = false;
        },
        error: () => {
          this.loadingRates = false;
        },
      });
  }

  pagarTotalGastos(): void {
    const total = this.transactionService.totalExpenses;
    if (total <= 0) return;

    const novoSaldo = this.balanceBRL - total;
    this.balanceService.set(novoSaldo);
    this.balanceBRL = novoSaldo;

    this.transactionService.clearAll();
    this.transactions = [];
    this.expensesBRL = 0;
    this.expenseCategories = [];
  }

  toggleCurrency(): void {
    const order: Currency[] = ['BRL', 'USD', 'EUR'];
    const idx = order.indexOf(this.currentCurrency);
    this.currentCurrency = order[(idx + 1) % order.length];
  }

  getCurrencySymbol(): string {
    const symbols: Record<Currency, string> = { BRL: 'R$', USD: '$', EUR: '€' };
    return symbols[this.currentCurrency];
  }

  convert(amountBRL: number): number {
    if (this.currentCurrency === 'USD') return amountBRL / this.rates.USD;
    if (this.currentCurrency === 'EUR') return amountBRL / this.rates.EUR;
    return amountBRL;
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

  verTudo(): void {
    this.router.navigate(['/carteira']);
  }

  editarGastos(): void {
    this.editMode = !this.editMode;
  }

  deletarCategoria(categoryName: string): void {
    this.transactionService.removeByCategory(categoryName);
    this.transactions = this.transactionService.all.slice(0, 4);
    this.expensesBRL = this.transactionService.totalExpenses;
    this.expenseCategories = this.computeCategories();
  }

  async editarCategoria(category: ExpenseCategory): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar gasto',
      cssClass: 'edit-name-alert',
      inputs: [
        { name: 'nome', type: 'text', value: category.name, placeholder: 'Nome' },
        { name: 'valor', type: 'number', value: category.amount, placeholder: 'Valor' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (data) => {
            const novoNome = data.nome?.trim();
            const novoValor = parseFloat(data.valor);
            if (!novoNome || isNaN(novoValor) || novoValor <= 0) return;

            this.transactionService.removeByCategory(category.name);
            this.transactionService.add({
              name: novoNome,
              amount: novoValor,
              date: new Date().toISOString().split('T')[0],
              category: novoNome,
              icon: category.icon,
              type: 'expense',
            });

            this.transactions = this.transactionService.all.slice(0, 4);
            this.expensesBRL = this.transactionService.totalExpenses;
            this.expenseCategories = this.computeCategories();
          },
        },
      ],
    });
    await alert.present();
  }

  isEmojiIcon(icon: string): boolean {
    return icon.length <= 4 && /\p{Emoji}/u.test(icon);
  }

  private svg(content: string): string {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${content}</svg>`
    );
  }

  getTransactionIcon(iconType: string): string {
    if (this.isBrandIcon(iconType)) return this.getBrandSvg(iconType);
    if (iconType === 'transfer') return this.svg(`<rect width="48" height="48" rx="10" fill="#EEF2FF"/><text x="24" y="30" font-size="22" fill="#4E5EB3" text-anchor="middle" font-family="Arial">⇄</text>`);
    if (iconType === 'upwork') return this.svg(`<rect width="48" height="48" rx="10" fill="#6FDA44"/><text x="24" y="30" font-size="18" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">Up</text>`);
    return this.svg(`<rect width="48" height="48" rx="10" fill="#e0e0e0"/>`);
  }
}
