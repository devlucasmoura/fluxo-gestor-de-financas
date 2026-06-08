import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'statistics',
    loadComponent: () => import('./pages/statistics/statistics.page').then((m) => m.StatisticsPage),
  },
  {
    path: 'adicionar-gasto',
    loadComponent: () => import('./pages/adicionar-gasto/adicionar-gasto.page').then((m) => m.AdicionarGastoPage),
  },
  {
    path: 'carteira',
    loadComponent: () => import('./pages/carteira/carteira.page').then((m) => m.CarteiraPage),
  },
  {
    path: 'adicionar-saldo',
    loadComponent: () => import('./pages/adicionar-saldo/adicionar-saldo.page').then((m) => m.AdicionarSaldoPage),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];