import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { BalanceService } from '../../services/balance.service';
import { TransactionService } from '../../services/transaction.service';
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
  pencilOutline,
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

const BILLS_KEY = 'fluxo_upcoming_bills';

const DEFAULT_BILLS: UpcomingBill[] = [
  {
    id: '1',
    name: 'Youtube',
    dueDate: 'Fev 28, 2026',
    amount: 29.99,
    icon: 'youtube',
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
export class CarteiraPage implements OnInit {
  activeTab: string = 'wallet';
  selectedSegment: string = 'transactions';
  balance: number = 0;

  transactions: Transaction[] = [];
  upcomingBills: UpcomingBill[] = [];

  constructor(
    private router: Router,
    private balanceService: BalanceService,
    private transactionService: TransactionService,
    private alertCtrl: AlertController,
  ) {
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
      pencilOutline,
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  ionViewWillEnter(): void {
    this.refresh();
  }

  private refresh(): void {
    this.balance = this.balanceService.current;
    this.transactions = this.transactionService.all;
    this.upcomingBills = this.loadBills();
  }

  private loadBills(): UpcomingBill[] {
    try {
      const saved = localStorage.getItem(BILLS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_BILLS;
    } catch {
      return DEFAULT_BILLS;
    }
  }

  private saveBills(): void {
    localStorage.setItem(BILLS_KEY, JSON.stringify(this.upcomingBills));
  }

  payBill(bill: UpcomingBill): void {
    const newBalance = this.balance - bill.amount;
    this.balanceService.set(newBalance);
    this.balance = newBalance;

    this.transactionService.add({
      name: bill.name,
      amount: bill.amount,
      date: new Date().toLocaleDateString('pt-BR'),
      category: 'Conta',
      icon: bill.icon,
      type: 'expense',
    });

    this.upcomingBills = this.upcomingBills.filter(b => b.id !== bill.id);
    this.saveBills();
    this.transactions = this.transactionService.all;
  }

  isEmojiIcon(icon: string): boolean {
    return icon.length <= 4 && /\p{Emoji}/u.test(icon);
  }

  async editarSaldo(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar saldo',
      cssClass: 'edit-name-alert',
      inputs: [
        {
          name: 'valor',
          type: 'number',
          value: this.balance,
          placeholder: 'Novo saldo',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (data) => {
            const novo = parseFloat(data.valor);
            if (!isNaN(novo) && novo >= 0) {
              this.balanceService.set(novo);
              this.balance = novo;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  private svg(content: string): string {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${content}</svg>`
    );
  }

  private readonly svgIcons: Record<string, string> = {
    youtube:   `<rect width="48" height="48" rx="10" fill="white"/><rect x="3" y="11" width="42" height="26" rx="6" fill="#FF0000"/><polygon points="19,16 19,32 34,24" fill="white"/>`,
    paypal:    `<rect width="48" height="48" rx="10" fill="white"/><text x="11" y="33" font-size="26" font-weight="900" fill="#003087" font-family="Arial,sans-serif">P</text><text x="23" y="33" font-size="26" font-weight="900" fill="#009CDE" font-family="Arial,sans-serif">P</text>`,
    upwork:    `<rect width="48" height="48" rx="10" fill="#6FDA44"/><text x="24" y="30" font-size="18" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">Up</text>`,
    netflix:   `<rect width="48" height="48" rx="10" fill="#E50914"/><text x="24" y="36" font-size="30" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">N</text>`,
    spotify:   `<rect width="48" height="48" rx="10" fill="#1DB954"/><path d="M13 19 Q24 13 35 17" stroke="white" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M14 25 Q24 20 34 23" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M16 31 Q24 27 32 29" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    uber:      `<rect width="48" height="48" rx="10" fill="#000000"/><text x="24" y="31" font-size="17" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">UBER</text>`,
    ifood:     `<rect width="48" height="48" rx="10" fill="#EA1D2C"/><text x="24" y="33" font-size="22" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">iFood</text>`,
    amazon:    `<rect width="48" height="48" rx="10" fill="#FF9900"/><text x="24" y="26" font-size="13" font-weight="900" fill="#232F3E" text-anchor="middle" font-family="Arial,sans-serif">amazon</text><path d="M13 34 Q24 42 35 34" stroke="#232F3E" stroke-width="2.5" fill="none" stroke-linecap="round"/><polygon points="32,31 35,34 32,37" fill="#232F3E"/>`,
    nubank:    `<rect width="48" height="48" rx="10" fill="#820AD1"/><text x="24" y="32" font-size="22" font-weight="900" fill="white" text-anchor="middle" font-family="Arial,sans-serif">Nu</text>`,
    mcdonalds: `<rect width="48" height="48" rx="10" fill="#DA291C"/><text x="24" y="38" font-size="34" font-weight="900" fill="#FFC72C" text-anchor="middle" font-family="Arial,sans-serif">M</text>`,
    steam:     `<rect width="48" height="48" rx="10" fill="#1B2838"/><text x="24" y="31" font-size="12" font-weight="700" fill="white" text-anchor="middle" font-family="Arial,sans-serif">STEAM</text>`,
  };

  private readonly assetIcons: Record<string, string> = {
    starbucks: 'assets/starbucks.png',
  };

  isImageIcon(icon: string): boolean {
    return icon in this.svgIcons || icon in this.assetIcons;
  }

  getIcon(icon: string): string {
    if (icon in this.assetIcons) return this.assetIcons[icon];
    return this.svg(this.svgIcons[icon]);
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
