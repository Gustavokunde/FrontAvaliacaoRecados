window.onload = function () {
  mostrarRecados();
};

const api = axios.create({
  baseURL: "http://localhost:5500",
});

function cadastrarUsuario(event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const form = {
    nome: nome,
    email: email,
    senha: senha,
  };

  api
    .post("/cadastro", form)
    .then((res) => alert(res)) // certo
    .catch((err) => console.log(err)); //errado
}

function entrar(event) {
  event.preventDefault();
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;
  const form = {
    email: email,
    senha: senha,
  };

  api
    .post("/login", form)
    .then((res) => {
      const id = res.data.id;
      sessionStorage.setItem("usuario", id);
      alert("Usuario Logado!");
    })
    .catch((err) => alert(err.response.data));
}
function getIdUsuario() {
  // const idUsuario = sessionStorage.getItem("usuario");
  // return idUsuario;
  return 4;
}

function criarRecado(event) {
  event.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;

  api
    .post(`/usuarios/${getIdUsuario()}/recados`, { titulo, descricao })
    .then((res) => alert("recado criado"))
    .catch((err) => alert(err.response.data));
}

let recados = [];
let page = 1;
let pages = 0;
let totalRecados = 0;
function paginaAnterior() {
  if (page > 1) {
    page--;
    mostrarRecados(page);
  }
}

function proximaPagina() {
  if (pages > page) {
    page++;
    mostrarRecados(page);
  }
}

function mostrarRecados(page) {
  api
    .get(`usuarios/${getIdUsuario()}/recados`, {
      params: { page },
    })
    .then((res) => {
      // res só é usado caso precise pegar a resposta
      // res.data sao os dados que retornam da requisicao
      recados = res.data.recados;
      totalRecados = res.data.total;
      pages = res.data.pages;
      let cards = document.getElementById("containerCards");
      cards.innerHTML = "";
      recados.forEach((recado) => {
        cards.innerHTML += `<div class="card">
        <span>${recado.titulo}</span> 
        <p>${recado.descricao}</p>
        <button onclick="mostrarEdicaoRecado(\'${recado.titulo}\', \'${recado.descricao}\',  \'${recado.id}\')">
        Editar</button></div>`;
      });
    })
    .catch((err) => {
      alert(err);
    });
}

function mostrarEdicaoRecado(titulo, descricao, id) {
  const formularioEdicao = document.getElementById("formEdicao");
  formularioEdicao.classList.remove("hidden");
  //setando valores no html
  document.getElementById("tituloEdicaoForm").value = titulo;
  document.getElementById("descricaoEdicaoForm").value = descricao;
  document.getElementById("idRecado").value = id; // escondido
}

function atualizarRecado(event) {
  event.preventDefault();

  //pegando valores do html
  const titulo = document.getElementById("tituloEdicaoForm").value;
  const descricao = document.getElementById("descricaoEdicaoForm").value;
  const idRecado = document.getElementById("idRecado").value;
  //id do session
  const idUsuario = sessionStorage.getItem("usuario");

  //comunicação front com back
  //idUsuario = sessionStorage (back)

  api
    .put(`/pessoas/${idUsuario}/recados/${idRecado}`, { titulo, descricao })
    .then((res) => {
      alert("Recado Atualizado");
    })
    .catch((err) => {
      alert("Ocorreu um erro, verifique as informações");
    });
}

// PAGINACAO

//<tr><td>${recado.titulo}</td><td>${recado.descricao} </td></tr>
