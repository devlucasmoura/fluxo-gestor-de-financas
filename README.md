<div align="center">
  <img src="resources/icon.png" alt="Fluxo Logo" width="120" />
  <h1>Fluxo</h1>
  <p>Aplicativo mobile de gestão financeira pessoal</p>

  ![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=flat-square&logo=angular)
  ![Ionic](https://img.shields.io/badge/Ionic-8-3880FF?style=flat-square&logo=ionic)
  ![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?style=flat-square&logo=capacitor)
  ![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
  ![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?style=flat-square&logo=android)
</div>

---

## Sobre o projeto

**Fluxo** é um aplicativo mobile desenvolvido para Android que permite ao usuário controlar suas finanças pessoais de forma simples e visual. Com o Fluxo é possível registrar gastos, adicionar saldo, gerenciar contas e acompanhar estatísticas detalhadas dos seus hábitos financeiros.

Desenvolvido como projeto acadêmico utilizando as tecnologias **Ionic**, **Angular** e **Capacitor**, com backend e autenticação via **Firebase**.

---

## Funcionalidades

- **Autenticação** — Cadastro, login e recuperação de senha
- **Onboarding** — Tela de boas-vindas para novos usuários
- **Carteira** — Visão geral do saldo e movimentações
- **Adicionar Gasto** — Registro de despesas por categoria
- **Adicionar Saldo** — Entrada de receitas e depósitos
- **Gerenciar Contas** — Criação e edição de contas financeiras
- **Estatísticas** — Gráficos de gastos com exportação em PDF
- **Perfil** — Dados pessoais e configurações da conta
- **Segurança** — Alteração de senha e configurações de segurança
- **Privacidade** — Política de privacidade de dados

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework Mobile | Ionic 8 + Angular 20 |
| Runtime Nativo | Capacitor 8 |
| Linguagem | TypeScript 5.9 |
| Backend / Auth | Firebase 12 + AngularFire |
| Geração de PDF | jsPDF + html2canvas |
| Plataforma | Android |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Android Studio](https://developer.android.com/studio) com SDK Android instalado
- [Java JDK](https://www.oracle.com/java/technologies/downloads/) 17+

---

## Instalação e execução

### 1. Clone o repositório

```bash
git clone https://github.com/devlucasmoura/fluxo.git
cd fluxo
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute no navegador (desenvolvimento)

```bash
npm start
```

### 4. Gerar e abrir no Android Studio

```bash
ionic build
npx cap sync android
npx cap open android
```

No Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

---

## Estrutura do projeto

```
fluxo/
├── src/
│   └── app/
│       └── pages/
│           ├── login/
│           ├── cadastro/
│           ├── home/
│           ├── carteira/
│           ├── adicionar-gasto/
│           ├── adicionar-saldo/
│           ├── statistics/
│           ├── perfil/
│           └── ...
├── android/          # Projeto Android gerado pelo Capacitor
├── resources/        # Ícones e splash screens
└── capacitor.config.ts
```

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos.

---

<div align="center">
  Desenvolvido por <a href="https://github.com/devlucasmoura">Lucas Moura</a>
</div>
