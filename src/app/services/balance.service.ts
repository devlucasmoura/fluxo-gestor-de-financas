import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BalanceService {
  private readonly _balance = new BehaviorSubject<number>(
    parseFloat(localStorage.getItem('fluxo_balance') ?? '2548.00')
  );

  private readonly _renda = new BehaviorSubject<number>(
    parseFloat(localStorage.getItem('fluxo_renda') ?? '1840.00')
  );

  readonly balance$ = this._balance.asObservable();
  readonly renda$ = this._renda.asObservable();

  get current(): number { return this._balance.value; }
  get currentRenda(): number { return this._renda.value; }

  set(value: number): void {
    this._balance.next(value);
    localStorage.setItem('fluxo_balance', value.toString());
  }

  setRenda(value: number): void {
    this._renda.next(value);
    localStorage.setItem('fluxo_renda', value.toString());
  }
}
