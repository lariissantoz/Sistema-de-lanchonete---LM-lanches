# 🍔 Lanchonete LM — Sistema de Pedidos

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-success)

Sistema web para gerenciamento de pedidos de uma lanchonete, com operações
completas de **CRUD** (criar, listar, atualizar e remover) e persistência de
dados em **LocalStorage**. O projeto foi desenvolvido como 2ª Avaliação da
disciplina de **codigo de alta performance web** do curso de Sistemas de Informação
da **UNI7**, sob orientação do professor Ronaldo Cysne.

---

## 📸 Capturas de tela

### Tela de login
<img width="1228" height="770" alt="Captura de Tela 2026-06-11 às 18 25 07" src="https://github.com/user-attachments/assets/dc7c92a7-b3e3-4f73-8d9a-edff895a16b3" />


### Painel de pedidos
<img width="1228" height="770" alt="Captura de Tela 2026-06-11 às 18 29 24" src="https://github.com/user-attachments/assets/6d486bc3-65ba-47c6-832e-cd3f2e998fe9" />


## 👥 Equipe de desenvolvimento

| Desenvolvedor(a)    | Responsabilidade                          |
| ------------------- | ----------------------------------------- |
| **Larissa Talmag**  | Desenvolvimento, design e documentação    |
| **Mateus Talmag**   | Desenvolvimento, lógica e testes          |

Projeto da **LM Soluções Tecnológicas** © 2026 — Todos os direitos reservados.

---

## ✨ Funcionalidades

### Requisitos da avaliação
- ✅ Interface construída em HTML semântico
- ✅ Estilização em CSS (tema amarelo, layout responsivo)
- ✅ Interatividade com JavaScript puro
- ✅ Persistência de dados com LocalStorage
- ✅ CRUD completo: criar, listar, atualizar e remover pedidos

### Diferenciais implementados
- 🔐 **Login e cadastro de usuários**, com sessão persistente e validações
- 🧾 **Cardápio com preços**: ao escolher um lanche, os ingredientes padrão
  são carregados e podem ser incluídos ou excluídos livremente
- 🔢 **Quantidade por pedido**, com cálculo automático do valor total
- 🚦 **Status do pedido** (Em preparo → Pronto → Entregue) alterável com um clique
- 🔍 **Pesquisa em tempo real** por cliente ou lanche
- 🏷️ **Filtros rápidos por status**
- 📊 **Painel de estatísticas**: pedidos, em preparo, entregues e total em vendas
- 🧑‍🍳 **Registro do atendente** responsável por cada pedido
- 📁 **Exportação de relatório em CSV** (compatível com Excel)
- 🔔 Notificações (toast), relógio em tempo real e identidade visual própria

---

## 🚀 Como executar

1. Baixe ou clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/lanchonete-lm.git
   ```
2. Abra o arquivo `index.html` em qualquer navegador moderno
   (ou utilize a extensão **Live Server** do VS Code)
3. Crie uma conta na tela inicial e comece a registrar pedidos

> Não é necessário instalar dependências: o projeto utiliza apenas
> HTML, CSS e JavaScript puros, e os dados ficam armazenados no
> LocalStorage do próprio navegador.

---

## 🗂️ Estrutura do projeto

```
lanchonete/
├── index.html        # Estrutura da página (HTML semântico)
├── README.md         # Documentação do projeto
├── css/
│   └── style.css     # Estilização (variáveis CSS, Grid e Flexbox)
├── js/
│   └── script.js     # Lógica da aplicação (CRUD + LocalStorage)
└── img/
    └── logo.png      # Logotipo da Lanchonete LM
```

---

## 🛠️ Tecnologias utilizadas

- **HTML5** — estrutura semântica e acessibilidade
- **CSS3** — variáveis, Grid, Flexbox e design responsivo
- **JavaScript (ES6+)** — manipulação do DOM, eventos, arrow functions,
  métodos de array (`map`, `filter`, `reduce`) e LocalStorage

---

## 🔒 Nota sobre segurança

Por se tratar de um projeto didático, as senhas dos usuários são armazenadas
em texto puro no LocalStorage. Em uma aplicação real, elas seriam protegidas
com criptografia (hash) e armazenadas em um servidor com autenticação adequada.
