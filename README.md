# 🍔 Lanchonete LM — Sistema de Pedidos

Sistema web de gerenciamento de pedidos de uma lanchonete, desenvolvido como
2ª Avaliação da disciplina de Lógica de Programação (UNI7 — Sistemas de Informação).

Sistema desenvolvido por **LM Soluções Tecnológicas** © 2026 — Todos os direitos reservados.

## ✨ Funcionalidades

- **CRUD completo de pedidos**: criar, listar, atualizar e remover, com persistência em LocalStorage
- **Login e cadastro de usuários**, com sessão que permanece ativa ao recarregar a página
- **Cardápio com preços**: ao escolher um lanche, seus ingredientes padrão são carregados automaticamente e podem ser incluídos ou excluídos livremente
- **Quantidade por pedido**, com cálculo automático do valor total (preço × quantidade)
- **Status do pedido** (Em preparo → Pronto → Entregue), alterável com um clique no cartão
- **Pesquisa em tempo real** por cliente ou lanche e **filtros rápidos por status**
- **Painel de estatísticas**: total de pedidos, em preparo, entregues e total em vendas (R$)
- **Registro do atendente** que criou cada pedido
- **Exportação dos pedidos em CSV** (abre no Excel)
- Notificações rápidas (toast), relógio em tempo real e interface responsiva

## 🚀 Como executar

1. Baixe ou clone este repositório
2. Abra o arquivo `index.html` em qualquer navegador moderno
   (ou use a extensão **Live Server** do VS Code)
3. Crie uma conta na tela inicial e comece a registrar pedidos

Não é necessário instalar nada: o projeto usa apenas HTML, CSS e JavaScript puros,
e os dados ficam salvos no LocalStorage do próprio navegador.

## 🗂️ Estrutura do projeto

```
lanchonete/
├── index.html        # Estrutura da página (HTML semântico)
├── css/
│   └── style.css     # Estilização (tema amarelo)
├── js/
│   └── script.js     # Lógica da aplicação (CRUD + LocalStorage)
└── img/
    └── logo.png      # Logotipo da Lanchonete LM
```

## 🛠️ Tecnologias

- HTML5 (estrutura semântica)
- CSS3 (variáveis, Grid, Flexbox, responsividade)
- JavaScript (manipulação do DOM, eventos, LocalStorage)

## 📌 Observação

Por se tratar de um projeto didático, as senhas dos usuários são armazenadas
em texto puro no LocalStorage. Em um sistema real, elas seriam protegidas com
criptografia (hash) e armazenadas em um servidor.
