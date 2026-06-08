import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonButton, IonButtons, IonIcon, IonList, IonItem, IonLabel, IonText,
  IonFooter, IonSegment, IonSegmentButton, IonNote, IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline, shareOutline, statsChartOutline, homeOutline,
  walletOutline, personOutline, add, arrowDownOutline, arrowUpOutline,
  downloadOutline, gridOutline,
} from 'ionicons/icons';

type Period = 'Dia' | 'Semana' | 'Mês' | 'Ano';

interface DataPoint { label: string; value: number; }
interface ChartPoint { x: number; y: number; label: string; value: number; }
interface ExpenseItem { id: string; name: string; date: string; amount: number; icon: string; color: string; }

const EXPENSE_DATA: Record<Period, DataPoint[]> = {
  'Dia': [
    { label: '08h', value: 45 }, { label: '10h', value: 120 },
    { label: '12h', value: 85 }, { label: '14h', value: 200 },
    { label: '16h', value: 60 }, { label: '18h', value: 150 },
    { label: '20h', value: 95 },
  ],
  'Semana': [
    { label: 'Seg', value: 230 }, { label: 'Ter', value: 85 },
    { label: 'Qua', value: 320 }, { label: 'Qui', value: 150 },
    { label: 'Sex', value: 410 }, { label: 'Sáb', value: 280 },
    { label: 'Dom', value: 120 },
  ],
  'Mês': [
    { label: '01', value: 450 }, { label: '05', value: 820 },
    { label: '10', value: 630 }, { label: '15', value: 1200 },
    { label: '20', value: 890 }, { label: '25', value: 1050 },
    { label: '30', value: 760 },
  ],
  'Ano': [
    { label: 'Jan', value: 2800 }, { label: 'Fev', value: 3200 },
    { label: 'Mar', value: 2600 }, { label: 'Abr', value: 3800 },
    { label: 'Mai', value: 3100 }, { label: 'Jun', value: 2900 },
    { label: 'Jul', value: 4200 }, { label: 'Ago', value: 3600 },
    { label: 'Set', value: 3300 }, { label: 'Out', value: 2700 },
    { label: 'Nov', value: 3900 }, { label: 'Dez', value: 4500 },
  ],
};

const PERIOD_DAYS: Record<Period, number> = {
  'Dia': 2, 'Semana': 7, 'Mês': 30, 'Ano': 365,
};

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule, DecimalPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonButton, IonButtons, IonIcon, IonList, IonItem, IonLabel, IonText,
    IonFooter, IonSegment, IonSegmentButton, IonNote, IonSpinner,
  ],
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  activeTab = 'stats';
  selectedPeriod: Period = 'Mês';
  loadingUsd = false;
  generatingPdf = false;

  expensePoints: ChartPoint[] = [];
  usdPoints: ChartPoint[] = [];

  private readonly SVG_W = 400;
  private readonly SVG_H = 200;
  private readonly MARGIN_X = 30;
  private readonly MARGIN_TOP = 20;
  private readonly MARGIN_BOTTOM = 35;

  expenses: ExpenseItem[] = [
    { id: '1', name: 'Starbucks', date: 'Jan 12, 2026', amount: 50, icon: 'starbucks', color: '#27ae60' },
    { id: '2', name: 'Transferência', date: 'Ontem', amount: 85, icon: '💳', color: '#3D4EAF' },
    { id: '3', name: 'Youtube', date: 'Jan 16, 2026', amount: 29.99, icon: 'youtube', color: '#e74c3c' },
  ];

  constructor(private router: Router, private http: HttpClient) {
    addIcons({
      chevronBackOutline, shareOutline, statsChartOutline, homeOutline,
      walletOutline, personOutline, add, arrowDownOutline, arrowUpOutline,
      downloadOutline, gridOutline,
    });
  }

  ngOnInit(): void {
    this.loadPeriod(this.selectedPeriod);
  }

  setPeriod(period: Period): void {
    this.selectedPeriod = period;
    this.loadPeriod(period);
  }

  private loadPeriod(period: Period): void {
    this.expensePoints = this.computePoints(EXPENSE_DATA[period]);
    this.fetchUsd(PERIOD_DAYS[period], EXPENSE_DATA[period].length);
  }

  private fetchUsd(days: number, targetCount: number): void {
    this.loadingUsd = true;
    this.http.get<any[]>(`https://economia.awesomeapi.com.br/json/daily/USD-BRL/${days}`).subscribe({
      next: (data) => {
        this.usdPoints = this.mapApiToPoints(data, targetCount);
        this.loadingUsd = false;
      },
      error: () => { this.loadingUsd = false; },
    });
  }

  private mapApiToPoints(apiData: any[], targetCount: number): ChartPoint[] {
    const reversed = [...apiData].reverse();
    const step = Math.max(1, Math.floor(reversed.length / targetCount));
    const sampled: DataPoint[] = [];
    for (let i = 0; i < reversed.length && sampled.length < targetCount; i += step) {
      const d = reversed[i];
      const date: string = d.create_date ?? '';
      sampled.push({ label: date.slice(5, 10), value: parseFloat(d.bid) });
    }
    while (sampled.length < targetCount && sampled.length > 0) {
      sampled.push({ ...sampled[sampled.length - 1] });
    }
    // Use same X positions as expense points (shared X axis)
    const pts = this.computePoints(sampled);
    return pts.map((p, i) => ({
      ...p,
      x: this.expensePoints[i]?.x ?? p.x,
    }));
  }

  private computePoints(data: DataPoint[]): ChartPoint[] {
    if (data.length === 0) return [];
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const chartW = this.SVG_W - this.MARGIN_X * 2;
    const chartH = this.SVG_H - this.MARGIN_TOP - this.MARGIN_BOTTOM;
    return data.map((d, i) => ({
      x: this.MARGIN_X + (i / Math.max(data.length - 1, 1)) * chartW,
      y: this.MARGIN_TOP + (1 - (d.value - min) / range) * chartH,
      label: d.label,
      value: d.value,
    }));
  }

  generatePath(points: ChartPoint[]): string {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      d += ` C ${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
  }

  generateAreaPath(points: ChartPoint[]): string {
    if (points.length < 2) return '';
    const bottomY = this.SVG_H - this.MARGIN_BOTTOM;
    return `${this.generatePath(points)} L ${points[points.length - 1].x},${bottomY} L ${points[0].x},${bottomY} Z`;
  }

  private svg(content: string): string {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${content}</svg>`
    );
  }

  private readonly svgIcons: Record<string, string> = {
    youtube: `<rect width="48" height="48" rx="10" fill="white"/><rect x="3" y="11" width="42" height="26" rx="6" fill="#FF0000"/><polygon points="19,16 19,32 34,24" fill="white"/>`,
    paypal: `<rect width="48" height="48" rx="10" fill="white"/><text x="11" y="33" font-size="26" font-weight="900" fill="#003087" font-family="Arial,sans-serif">P</text><text x="23" y="33" font-size="26" font-weight="900" fill="#009CDE" font-family="Arial,sans-serif">P</text>`,
    upwork: `<rect width="48" height="48" rx="10" fill="#6FDA44"/><text x="24" y="30" font-size="18" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">Up</text>`,
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

  exportarPlanilha(): void {
    const linhas = [
      ['Nome', 'Data', 'Valor (R$)', 'Período'],
      ...this.expenses.map(e => [e.name, e.date, e.amount.toFixed(2), this.selectedPeriod]),
      [],
      ['Resumo por período', this.selectedPeriod],
      ...EXPENSE_DATA[this.selectedPeriod].map(p => [p.label, p.value.toFixed(2)]),
    ];

    const csv = linhas
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      .join('\r\n');

    const bom = '﻿';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fluxo-gastos-${this.selectedPeriod.toLowerCase()}-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async downloadPDF(): Promise<void> {
    this.generatingPdf = true;

    const element = document.querySelector('ion-content') as HTMLElement;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f5f6fa',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.setFontSize(16);
    pdf.setTextColor(78, 94, 179);
    pdf.text('Relatório de Estatísticas — Fluxo', pdfWidth / 2, 12, { align: 'center' });
    pdf.setFontSize(10);
    pdf.setTextColor(150);
    pdf.text(
      `Período: ${this.selectedPeriod} • Gerado em ${new Date().toLocaleDateString('pt-BR')}`,
      pdfWidth / 2, 18, { align: 'center' }
    );

    pdf.addImage(imgData, 'PNG', 0, 22, pdfWidth, pdfHeight);
    pdf.save(`fluxo-estatisticas-${this.selectedPeriod.toLowerCase()}.pdf`);

    this.generatingPdf = false;
  }

  goBack(): void { this.router.navigate(['/home']); }

  setActiveTab(tab: string): void {
    if (tab === 'home') this.router.navigate(['/home']);
    else if (tab === 'wallet') this.router.navigate(['/carteira']);
    else if (tab === 'profile') this.router.navigate(['/perfil']);
  }

  onFabClick(): void { this.router.navigate(['/adicionar-gasto']); }
}
