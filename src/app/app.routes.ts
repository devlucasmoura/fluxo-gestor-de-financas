import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.page').then((m) => m.OnboardingPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then((m) => m.CadastroPage),
  },
  {
    path: 'esqueci-senha',
    loadComponent: () => import('./pages/esqueci-senha/esqueci-senha.page').then((m) => m.EsqueciSenhaPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
  {
    path: 'statistics',
    loadComponent: () => import('./pages/statistics/statistics.page').then((m) => m.StatisticsPage),
    canActivate: [authGuard],
  },
  {
    path: 'adicionar-gasto',
    loadComponent: () => import('./pages/adicionar-gasto/adicionar-gasto.page').then((m) => m.AdicionarGastoPage),
    canActivate: [authGuard],
  },
  {
    path: 'carteira',
    loadComponent: () => import('./pages/carteira/carteira.page').then((m) => m.CarteiraPage),
    canActivate: [authGuard],
  },
  {
    path: 'adicionar-saldo',
    loadComponent: () => import('./pages/adicionar-saldo/adicionar-saldo.page').then((m) => m.AdicionarSaldoPage),
    canActivate: [authGuard],
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
    canActivate: [authGuard],
  },
  {
    path: 'dados-pessoais',
    loadComponent: () => import('./pages/dados-pessoais/dados-pessoais.page').then((m) => m.DadosPessoaisPage),
    canActivate: [authGuard],
  },
  {
    path: 'gerenciar-contas',
    loadComponent: () => import('./pages/gerenciar-contas/gerenciar-contas.page').then((m) => m.GerenciarContasPage),
    canActivate: [authGuard],
  },
  {
    path: 'mensagens',
    loadComponent: () => import('./pages/mensagens/mensagens.page').then((m) => m.MensagensPage),
    canActivate: [authGuard],
  },
  {
    path: 'senha-seguranca',
    loadComponent: () => import('./pages/senha-seguranca/senha-seguranca.page').then((m) => m.SenhaSegurancaPage),
    canActivate: [authGuard],
  },
  {
    path: 'data-privacidade',
    loadComponent: () => import('./pages/data-privacidade/data-privacidade.page').then((m) => m.DataPrivacidadePage),
    canActivate: [authGuard],
  },
];
