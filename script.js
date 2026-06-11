/* ============================================================
   Lanchonete LM — Lógica da aplicação (CRUD + LocalStorage)
   ------------------------------------------------------------
   CREATE  -> adicionar um novo pedido
   READ    -> listar os pedidos salvos
   UPDATE  -> editar um pedido (incluindo/excluindo ingredientes)
   DELETE  -> remover um pedido
   Os dados são persistidos no LocalStorage do navegador.
   ============================================================ */

// Chaves usadas para salvar/ler dados no LocalStorage
const CHAVE_STORAGE  = "lanchonete.pedidos";
const CHAVE_USUARIOS = "lanchonete.usuarios";
const CHAVE_SESSAO   = "lanchonete.sessao";

// ---------- Referências aos elementos da página ----------
const formPedido        = document.getElementById("form-pedido");
const campoIdPedido     = document.getElementById("pedido-id");
const campoCliente      = document.getElementById("cliente");
const campoLanche       = document.getElementById("lanche");
const campoIngrediente  = document.getElementById("ingrediente");
const campoObservacao   = document.getElementById("observacao");
const campoStatus       = document.getElementById("status");
const campoQuantidade   = document.getElementById("quantidade");
const campoBusca        = document.getElementById("campo-busca");
const botoesFiltro      = document.querySelectorAll(".filtro");
const statTotal         = document.getElementById("stat-total");
const statPreparo       = document.getElementById("stat-preparo");
const statEntregues     = document.getElementById("stat-entregues");
const statVendas        = document.getElementById("stat-vendas");

// ---------- Elementos da tela de login e do cabeçalho ----------
const telaLogin       = document.getElementById("tela-login");
const tituloLogin     = document.getElementById("login-titulo");
const formLogin       = document.getElementById("form-login");
const formCadastro    = document.getElementById("form-cadastro");
const loginUsuario    = document.getElementById("login-usuario");
const loginSenha      = document.getElementById("login-senha");
const loginErro       = document.getElementById("login-erro");
const cadastroNome    = document.getElementById("cadastro-nome");
const cadastroUsuario = document.getElementById("cadastro-usuario");
const cadastroSenha   = document.getElementById("cadastro-senha");
const cadastroErro    = document.getElementById("cadastro-erro");
const irCadastro      = document.getElementById("ir-cadastro");
const irLogin         = document.getElementById("ir-login");
const nomeUsuario     = document.getElementById("nome-usuario");
const btnSair         = document.getElementById("btn-sair");
const relogio         = document.getElementById("relogio");
const toast           = document.getElementById("toast");
const btnAddIngrediente = document.getElementById("btn-add-ingrediente");
const btnSalvar         = document.getElementById("btn-salvar");
const btnCancelar       = document.getElementById("btn-cancelar");
const tituloFormulario  = document.getElementById("titulo-form");
const listaIngredientes = document.getElementById("lista-ingredientes");
const listaPedidos      = document.getElementById("lista-pedidos");
const contadorPedidos   = document.getElementById("contador-pedidos");
const estadoVazio       = document.getElementById("estado-vazio");

// Lista temporária de ingredientes do pedido que está no formulário
let ingredientesAtuais = [];

// ---------- Cardápio: ingredientes padrão de cada lanche ----------
// Ao escolher um lanche no formulário, esses ingredientes são
// carregados automaticamente e podem ser incluídos/excluídos.
const CARDAPIO = {
  "X-Burguer":       ["Pão", "Hambúrguer", "Queijo"],
  "X-Salada":        ["Pão", "Hambúrguer", "Queijo", "Alface", "Tomate"],
  "X-Bacon":         ["Pão", "Hambúrguer", "Queijo", "Bacon"],
  "X-Tudo":          ["Pão", "Hambúrguer", "Queijo", "Bacon", "Ovo", "Presunto", "Alface", "Tomate", "Milho"],
  "X-Frango":        ["Pão", "Filé de frango", "Queijo", "Alface"],
  "Cachorro-Quente": ["Pão", "Salsicha", "Molho", "Milho", "Batata palha"],
  "Misto Quente":    ["Pão de forma", "Presunto", "Queijo"],
  "Bauru":           ["Pão francês", "Rosbife", "Queijo", "Tomate"],
};

// ---------- Status possíveis de um pedido (em ordem de andamento) ----------
// Clicar na etiqueta de status do cartão avança para o próximo da lista.
const STATUS_PEDIDO = ["Em preparo", "Pronto", "Entregue"];

// ---------- Tabela de preços do cardápio (em reais) ----------
const PRECOS = {
  "X-Burguer":       15.0,
  "X-Salada":        17.0,
  "X-Bacon":         19.0,
  "X-Tudo":          24.0,
  "X-Frango":        18.0,
  "Cachorro-Quente": 12.0,
  "Misto Quente":    10.0,
  "Bauru":           16.0,
};

// Status selecionado nos botões de filtro ("Todos" mostra tudo)
let filtroStatus = "Todos";

// Formata um número como moeda brasileira (ex.: 15 -> "R$ 15,00")
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Calcula o valor total de um pedido (preço do lanche x quantidade)
function calcularTotalPedido(pedido) {
  const precoUnitario = PRECOS[pedido.lanche] || 0;
  return precoUnitario * pedido.quantidade;
}

/* ============================================================
   LOGIN E SESSÃO DE USUÁRIO
   ------------------------------------------------------------
   Os usuários cadastrados ficam salvos no LocalStorage, e a
   sessão também — assim, ao recarregar a página, o usuário
   continua logado. (Obs.: em um sistema real a senha nunca
   seria salva em texto puro; aqui é apenas para fins didáticos.)
   ============================================================ */

function carregarUsuarios() {
  const dados = localStorage.getItem(CHAVE_USUARIOS);
  return dados ? JSON.parse(dados) : [];
}

function salvarUsuarios(usuarios) {
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

// Retorna o usuário logado no momento (ou null se ninguém logou)
function sessaoAtual() {
  const dados = localStorage.getItem(CHAVE_SESSAO);
  return dados ? JSON.parse(dados) : null;
}

// Esconde a tela de login e mostra o nome do usuário no cabeçalho
function entrarNoSistema(usuario) {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
  nomeUsuario.textContent = usuario.nome;
  telaLogin.classList.add("escondido");
  mostrarToast(`Bem-vindo(a), ${usuario.nome}!`);
}

// Encerra a sessão e volta para a tela de login
function sairDoSistema() {
  localStorage.removeItem(CHAVE_SESSAO);
  telaLogin.classList.remove("escondido");
  formLogin.reset();
}

// ---------- Envio do formulário de LOGIN ----------
formLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const usuarios = carregarUsuarios();
  const encontrado = usuarios.find(
    (u) =>
      u.usuario.toLowerCase() === loginUsuario.value.trim().toLowerCase() &&
      u.senha === loginSenha.value
  );

  if (!encontrado) {
    loginErro.textContent = "Usuário ou senha incorretos. Tente novamente.";
    loginErro.classList.remove("escondido");
    return;
  }

  loginErro.classList.add("escondido");
  entrarNoSistema({ nome: encontrado.nome, usuario: encontrado.usuario });
});

// ---------- Envio do formulário de CADASTRO ----------
formCadastro.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const usuarios = carregarUsuarios();
  const usuarioDigitado = cadastroUsuario.value.trim();

  // Não permite dois cadastros com o mesmo nome de usuário
  const jaExiste = usuarios.some(
    (u) => u.usuario.toLowerCase() === usuarioDigitado.toLowerCase()
  );
  if (jaExiste) {
    cadastroErro.textContent = "Esse usuário já existe. Escolha outro.";
    cadastroErro.classList.remove("escondido");
    return;
  }

  const novoUsuario = {
    nome: cadastroNome.value.trim(),
    usuario: usuarioDigitado,
    senha: cadastroSenha.value,
  };
  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  cadastroErro.classList.add("escondido");
  entrarNoSistema({ nome: novoUsuario.nome, usuario: novoUsuario.usuario });
});

// ---------- Alternância entre os formulários de login e cadastro ----------
irCadastro.addEventListener("click", () => {
  formLogin.classList.add("escondido");
  formCadastro.classList.remove("escondido");
  tituloLogin.textContent = "Criar conta";
});

irLogin.addEventListener("click", () => {
  formCadastro.classList.add("escondido");
  formLogin.classList.remove("escondido");
  tituloLogin.textContent = "Entrar no sistema";
});

// Botão "Sair" do cabeçalho
btnSair.addEventListener("click", sairDoSistema);

/* ============================================================
   EXPORTAÇÃO DOS PEDIDOS EM CSV
   ------------------------------------------------------------
   Gera um arquivo .csv (que abre no Excel) com todos os pedidos
   salvos e inicia o download no navegador.
   ============================================================ */

function exportarCSV() {
  const pedidos = carregarPedidos();

  if (pedidos.length === 0) {
    mostrarToast("Não há pedidos para exportar.");
    return;
  }

  // Cabeçalho do arquivo + uma linha por pedido.
  // O ponto e vírgula é o separador padrão do Excel em português.
  const linhas = [
    "Cliente;Lanche;Quantidade;Ingredientes;Observação;Status;Atendente;Total (R$);Criado em",
  ];

  pedidos.forEach((p) => {
    const colunas = [
      p.cliente,
      p.lanche,
      p.quantidade,
      p.ingredientes.join(" | "),
      p.observacao,
      p.status,
      p.atendente || "",
      calcularTotalPedido(p).toFixed(2).replace(".", ","),
      p.criadoEm,
    ];
    // Aspas em volta de cada coluna evitam problemas com ; no texto
    linhas.push(colunas.map((c) => `"${String(c).replaceAll('"', "'")}"`).join(";"));
  });

  // O "\uFEFF" (BOM) garante que os acentos apareçam certos no Excel
  const conteudo = "\uFEFF" + linhas.join("\n");
  const arquivo = new Blob([conteudo], { type: "text/csv;charset=utf-8" });

  // Cria um link temporário e simula o clique para baixar o arquivo
  const link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "pedidos-lanchonete-lm.csv";
  link.click();
  URL.revokeObjectURL(link.href);

  mostrarToast("Relatório CSV exportado!");
}

document.getElementById("btn-exportar").addEventListener("click", exportarCSV);

/* ============================================================
   NOTIFICAÇÕES (toast) E RELÓGIO DO CABEÇALHO
   ============================================================ */

// Mostra uma mensagem rápida no canto da tela por alguns segundos
let temporizadorToast = null;
function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.classList.remove("escondido");
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => {
    toast.classList.add("escondido");
  }, 2600);
}

// Relógio em tempo real no cabeçalho, atualizado a cada segundo
function atualizarRelogio() {
  relogio.textContent = new Date().toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

/* ============================================================
   FUNÇÕES DE PERSISTÊNCIA (LocalStorage)
   ============================================================ */

// Lê todos os pedidos salvos. Se não houver nada, retorna lista vazia.
// Pedidos antigos salvos sem status recebem "Em preparo" como padrão.
function carregarPedidos() {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  const pedidos = dados ? JSON.parse(dados) : [];
  pedidos.forEach((p) => {
    if (!p.status) p.status = "Em preparo";
    if (!p.quantidade) p.quantidade = 1;
  });
  return pedidos;
}

// Grava a lista de pedidos no LocalStorage (convertida para texto JSON)
function salvarPedidos(pedidos) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pedidos));
}

/* ============================================================
   INGREDIENTES (etiquetas do formulário)
   ============================================================ */

// Adiciona o ingrediente digitado à lista temporária e redesenha as etiquetas
function adicionarIngrediente() {
  const nome = campoIngrediente.value.trim();

  // Não adiciona vazio nem duplicado (comparação sem diferenciar maiúsculas)
  if (nome === "") return;
  const jaExiste = ingredientesAtuais.some(
    (ing) => ing.toLowerCase() === nome.toLowerCase()
  );
  if (jaExiste) {
    campoIngrediente.value = "";
    return;
  }

  ingredientesAtuais.push(nome);
  campoIngrediente.value = "";
  campoIngrediente.focus();
  renderizarIngredientes();
}

// Remove um ingrediente da lista temporária pelo índice
function removerIngrediente(indice) {
  ingredientesAtuais.splice(indice, 1);
  renderizarIngredientes();
}

// Desenha as etiquetas de ingredientes dentro do formulário
function renderizarIngredientes() {
  listaIngredientes.innerHTML = "";

  ingredientesAtuais.forEach((ingrediente, indice) => {
    const item = document.createElement("li");
    item.className = "etiqueta";
    item.textContent = ingrediente;

    // Botão "×" para excluir o ingrediente
    const botaoRemover = document.createElement("button");
    botaoRemover.type = "button";
    botaoRemover.className = "etiqueta__remover";
    botaoRemover.textContent = "✕";
    botaoRemover.setAttribute("aria-label", `Remover ${ingrediente}`);
    botaoRemover.addEventListener("click", () => removerIngrediente(indice));

    item.appendChild(botaoRemover);
    listaIngredientes.appendChild(item);
  });
}

/* ============================================================
   CREATE / UPDATE — envio do formulário
   ============================================================ */

formPedido.addEventListener("submit", (evento) => {
  evento.preventDefault(); // impede o recarregamento da página

  const pedidos = carregarPedidos();
  const idEmEdicao = campoIdPedido.value;

  if (idEmEdicao) {
    // ---------- UPDATE: localiza o pedido e atualiza os dados ----------
    const indice = pedidos.findIndex((p) => p.id === idEmEdicao);
    if (indice !== -1) {
      pedidos[indice].cliente      = campoCliente.value.trim();
      pedidos[indice].lanche       = campoLanche.value.trim();
      pedidos[indice].quantidade   = Number(campoQuantidade.value) || 1;
      pedidos[indice].ingredientes = [...ingredientesAtuais];
      pedidos[indice].observacao   = campoObservacao.value.trim();
      pedidos[indice].status       = campoStatus.value;
    }
  } else {
    // ---------- CREATE: monta um novo objeto de pedido ----------
    // Observação: o mesmo cliente pode fazer quantos pedidos quiser —
    // cada pedido recebe um id próprio e é salvo separadamente.
    const novoPedido = {
      id: Date.now().toString(),            // id único baseado no horário
      cliente: campoCliente.value.trim(),
      lanche: campoLanche.value.trim(),
      quantidade: Number(campoQuantidade.value) || 1,
      ingredientes: [...ingredientesAtuais], // cópia da lista temporária
      observacao: campoObservacao.value.trim(),
      status: campoStatus.value,             // "Em preparo", "Pronto" ou "Entregue"
      atendente: sessaoAtual() ? sessaoAtual().nome : "",
      criadoEm: new Date().toLocaleString("pt-BR"),
    };
    pedidos.push(novoPedido);
  }

  salvarPedidos(pedidos);   // persiste no LocalStorage
  mostrarToast(idEmEdicao ? "Pedido atualizado!" : "Pedido adicionado!");
  limparFormulario();       // volta o formulário ao estado inicial
  renderizarPedidos();      // atualiza a listagem na tela
});

/* ============================================================
   READ — listagem dos pedidos
   ============================================================ */

function renderizarPedidos() {
  const pedidos = carregarPedidos();

  // ---------- Painel de resumo (estatísticas) ----------
  // Os números são recalculados a cada alteração nos pedidos.
  statTotal.textContent = pedidos.length;
  statPreparo.textContent = pedidos.filter((p) => p.status === "Em preparo").length;
  statEntregues.textContent = pedidos.filter((p) => p.status === "Entregue").length;
  const totalVendas = pedidos.reduce(
    (soma, p) => soma + calcularTotalPedido(p), 0
  );
  statVendas.textContent = formatarMoeda(totalVendas);

  // ---------- Filtros ----------
  // 1) Busca: compara o termo digitado com o cliente e o lanche;
  // 2) Status: respeita o botão de filtro selecionado.
  const termo = campoBusca.value.trim().toLowerCase();
  const pedidosFiltrados = pedidos.filter((p) => {
    const combinaBusca =
      p.cliente.toLowerCase().includes(termo) ||
      p.lanche.toLowerCase().includes(termo);
    const combinaStatus =
      filtroStatus === "Todos" || p.status === filtroStatus;
    return combinaBusca && combinaStatus;
  });

  // Atualiza o contador (mostra "x de y" quando algum filtro está ativo)
  const filtroAtivo = termo !== "" || filtroStatus !== "Todos";
  if (filtroAtivo) {
    contadorPedidos.textContent = `${pedidosFiltrados.length} de ${pedidos.length} pedidos`;
  } else {
    contadorPedidos.textContent =
      pedidos.length === 1 ? "1 pedido" : `${pedidos.length} pedidos`;
  }

  // Mensagem de lista vazia: muda conforme há filtro ativo ou não
  estadoVazio.classList.toggle("escondido", pedidosFiltrados.length > 0);
  estadoVazio.textContent =
    pedidos.length === 0
      ? "Nenhum pedido por aqui ainda. Preencha o formulário ao lado para registrar o primeiro!"
      : "Nenhum pedido encontrado para essa pesquisa ou filtro.";

  listaPedidos.innerHTML = "";

  // Pedidos mais recentes aparecem primeiro na lista
  [...pedidosFiltrados].reverse().forEach((pedido) => {
    const cartao = document.createElement("li");
    cartao.className = "pedido";

    // Destaca o cartão que está sendo editado no momento
    if (pedido.id === campoIdPedido.value) {
      cartao.classList.add("pedido--editando");
    }

    // Monta as etiquetas de ingredientes do pedido (apenas leitura)
    const etiquetas = pedido.ingredientes
      .map((ing) => `<li class="etiqueta">${ing}</li>`)
      .join("");

    // Classe de cor da etiqueta de status (ex.: "status--em-preparo")
    const classeStatus =
      "status--" + pedido.status.toLowerCase().replace(" ", "-");

    cartao.innerHTML = `
      <div class="pedido__topo">
        <div>
          <h3 class="pedido__lanche">${pedido.quantidade}× ${pedido.lanche}</h3>
          <p class="pedido__cliente">Cliente: ${pedido.cliente}</p>
        </div>
        <div class="pedido__topo-direita">
          <button type="button" class="status ${classeStatus}"
                  title="Clique para avançar o status">${pedido.status}</button>
          <span class="pedido__hora">${pedido.criadoEm}</span>
        </div>
      </div>

      ${
        pedido.ingredientes.length > 0
          ? `<ul class="etiquetas pedido__ingredientes">${etiquetas}</ul>`
          : `<p class="pedido__observacao">Sem ingredientes informados.</p>`
      }

      ${
        pedido.observacao
          ? `<p class="pedido__observacao">Obs.: ${pedido.observacao}</p>`
          : ""
      }

      <p class="pedido__preco">Total: ${formatarMoeda(calcularTotalPedido(pedido))}</p>

      ${
        pedido.atendente
          ? `<p class="pedido__atendente">Atendido por ${pedido.atendente}</p>`
          : ""
      }

      <div class="pedido__acoes">
        <button type="button" class="botao botao--editar">Editar</button>
        <button type="button" class="botao botao--remover">Remover</button>
      </div>
    `;

    // Liga os botões de cada cartão às suas ações
    cartao.querySelector(".status")
          .addEventListener("click", () => avancarStatus(pedido.id));
    cartao.querySelector(".botao--editar")
          .addEventListener("click", () => iniciarEdicao(pedido.id));
    cartao.querySelector(".botao--remover")
          .addEventListener("click", () => removerPedido(pedido.id));

    listaPedidos.appendChild(cartao);
  });
}

/* ============================================================
   UPDATE — avançar o status do pedido
   (Em preparo -> Pronto -> Entregue -> Em preparo)
   ============================================================ */

function avancarStatus(id) {
  const pedidos = carregarPedidos();
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido) return;

  // Descobre a posição do status atual e passa para o próximo da lista
  const posicaoAtual = STATUS_PEDIDO.indexOf(pedido.status);
  const proximaPosicao = (posicaoAtual + 1) % STATUS_PEDIDO.length;
  pedido.status = STATUS_PEDIDO[proximaPosicao];

  salvarPedidos(pedidos);
  renderizarPedidos();
}

/* ============================================================
   UPDATE — carregar um pedido no formulário para edição
   ============================================================ */

function iniciarEdicao(id) {
  const pedidos = carregarPedidos();
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido) return;

  // Preenche o formulário com os dados do pedido escolhido
  campoIdPedido.value     = pedido.id;
  campoCliente.value      = pedido.cliente;
  campoLanche.value       = pedido.lanche;
  campoQuantidade.value   = pedido.quantidade;
  campoObservacao.value   = pedido.observacao;
  campoStatus.value       = pedido.status;
  ingredientesAtuais      = [...pedido.ingredientes];

  // Ajusta os textos do formulário para o modo de edição
  tituloFormulario.textContent = "Editar pedido";
  btnSalvar.textContent = "Salvar alterações";
  btnCancelar.classList.remove("escondido");

  renderizarIngredientes();
  renderizarPedidos(); // redesenha para destacar o cartão em edição
  campoCliente.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============================================================
   DELETE — remover um pedido
   ============================================================ */

function removerPedido(id) {
  const confirmar = confirm("Deseja realmente remover este pedido?");
  if (!confirmar) return;

  // Mantém apenas os pedidos com id diferente do removido
  const pedidos = carregarPedidos().filter((p) => p.id !== id);
  salvarPedidos(pedidos);

  // Se o pedido removido estava em edição, limpa o formulário
  if (campoIdPedido.value === id) limparFormulario();

  mostrarToast("Pedido removido.");
  renderizarPedidos();
}

/* ============================================================
   FUNÇÕES AUXILIARES
   ============================================================ */

// Retorna o formulário ao estado de "novo pedido"
function limparFormulario() {
  formPedido.reset();
  campoIdPedido.value = "";
  ingredientesAtuais = [];
  tituloFormulario.textContent = "Novo pedido";
  btnSalvar.textContent = "Adicionar pedido";
  btnCancelar.classList.add("escondido");
  renderizarIngredientes();
}

/* ============================================================
   EVENTOS GERAIS
   ============================================================ */

// Botão "Adicionar" do campo de ingrediente
btnAddIngrediente.addEventListener("click", adicionarIngrediente);

// Ao escolher um lanche, carrega os ingredientes padrão do cardápio.
// A partir daí o usuário pode incluir novos ou excluir os que quiser.
campoLanche.addEventListener("change", () => {
  ingredientesAtuais = [...(CARDAPIO[campoLanche.value] || [])];
  renderizarIngredientes();
});

// Pressionar Enter no campo de ingrediente adiciona sem enviar o formulário
campoIngrediente.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    evento.preventDefault();
    adicionarIngrediente();
  }
});

// Botão "Cancelar edição" volta ao modo de novo pedido
btnCancelar.addEventListener("click", () => {
  limparFormulario();
  renderizarPedidos();
});

// Campo de pesquisa: filtra a lista a cada letra digitada
campoBusca.addEventListener("input", renderizarPedidos);

// Botões de filtro por status: marca o botão clicado como ativo
// e redesenha a lista mostrando apenas os pedidos daquele status.
botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    filtroStatus = botao.dataset.status;
    botoesFiltro.forEach((b) => b.classList.remove("filtro--ativo"));
    botao.classList.add("filtro--ativo");
    renderizarPedidos();
  });
});

// Ao abrir a página: se já existe uma sessão salva, o usuário
// continua logado; caso contrário, a tela de login é exibida.
const sessao = sessaoAtual();
if (sessao) {
  nomeUsuario.textContent = sessao.nome;
  telaLogin.classList.add("escondido");
}

// Carrega e exibe os pedidos já salvos
renderizarPedidos();
