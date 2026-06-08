import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  icon: string;
  type: 'expense';
}

const KEY = 'fluxo_transactions';

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: '1', name: 'YouTube', amount: 29.99, date: '2026-05-28', category: 'Entretenimento', icon: 'youtube', type: 'expense' },
  { id: '2', name: 'PayPal', amount: 150.00, date: '2026-05-27', category: 'Transferência', icon: 'paypal', type: 'expense' },
  { id: '3', name: 'Starbucks', amount: 32.50, date: '2026-05-26', category: 'Alimentação', icon: 'starbucks', type: 'expense' },
];

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly _transactions = new BehaviorSubject<Transaction[]>(this.load());

  readonly transactions$ = this._transactions.asObservable();

  get all(): Transaction[] {
    return this._transactions.value;
  }

  get totalExpenses(): number {
    return this.all.reduce((sum, t) => sum + t.amount, 0);
  }

  add(transaction: Omit<Transaction, 'id'>): void {
    const updated = [{ ...transaction, id: Date.now().toString() }, ...this.all];
    this._transactions.next(updated);
    this.save(updated);
  }

  remove(id: string): void {
    const updated = this.all.filter(t => t.id !== id);
    this._transactions.next(updated);
    this.save(updated);
  }

  removeByCategory(category: string): void {
    const updated = this.all.filter(t => t.category !== category);
    this._transactions.next(updated);
    this.save(updated);
  }

  clearAll(): void {
    this._transactions.next([]);
    this.save([]);
  }

  private load(): Transaction[] {
    try {
      const saved = localStorage.getItem(KEY);
      return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
    } catch {
      return DEFAULT_TRANSACTIONS;
    }
  }

  private save(data: Transaction[]): void {
    localStorage.setItem(KEY, JSON.stringify(data));
  }
}
