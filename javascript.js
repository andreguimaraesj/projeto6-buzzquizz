axios.defaults.headers.common['Authorization'] = 'TumGlLJcWaHWS4AyRV2AOZCy';
let boxTodosOsQuizzes = document.querySelector('.todosQuizzes');
let quizzClicado = {};
let respostasClicadas = 0;
let acertos = 0;

function comparador(){
    return Math.random() -0.5;
}

let todosQuizzesDoServidor;
function renderizaQuizzesDoServidor(){
    todosQuizzesDoServidor = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes");
    todosQuizzesDoServidor.then((quiz) =>{
        todosQuizzesDoServidor = quiz.data;
       console.log(todosQuizzesDoServidor);

        for(let i = 0; i < todosQuizzesDoServidor.length; i++){
            boxTodosOsQuizzes.innerHTML += `<div class="quizzDoServidor" onclick="abreQuizz(${todosQuizzesDoServidor[i].id})">
                <div class="tituloDeCadaQuizzDoServidor">${todosQuizzesDoServidor[i].title}</div>
                <img class="imagemQuizzesDoServidor"  src="${todosQuizzesDoServidor[i].image}" >
            </div>`
        }
    } )
};

function abreQuizz(id){
    axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${id}`)
    .then((qui)=> {
        quizzClicado = qui.data;
        console.log(quizzClicado);

    }) 
}

function mostrarQuizz(response){
    quiz = response.data;
    const header = document.querySelector(".quiz-header");
    header.innerHTML = "";
    header.innerHTML += `
        <img src="${quiz.image}"/>
        <p>${quiz.title}</p>
    `
    const tela2 = document.querySelector(".container-tela-2");
    tela2.innerHTML = "";
    for (let i = 0; i < quiz.questions.length; i++){
        let opcoes = "";
        quiz.questions[i].answers.sort(comparador);
        for (let j = 0; j < quiz.questions[i].answers.length; j++){
            const respCorreta = quiz.questions[i].answers[j].isCorrectAnswer;
            let acertou;
            if (respCorreta){
                acertou = "correto";
            } else {
                acertou = "errado";
            }
            opcoes += `
            <figure class="resposta ${acertou}" onclick="selecionarResposta(this)">
                <img src ="$quiz.questions[i].answers[j].image">
                <p class="resposta-texto">${quiz.questions[i].answers[j].text}</p> 
            </figure>`;
        }
        tela2.innerHTML += `
        <section class = "pergunta pergunta-numero-${i+1}">
            <div class = "pergunta-titulo" style="background-color:${quiz.questions[i].color};">
                <h4>${quiz.questions[i].title}</h4>
            </div>
            <div class = "respostas">
                ${opcoes}    
            </div>
        </section>
        `;
    }
}

function buscarQuizz(id){
    const promise = axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${id}`)
    promise.then(mostrarQuizz);
}

function entrarQuizz(element){
    document.querySelector(".desktop1").classList.add("esconder");
    document.querySelector(".add-quizz").classList.add("esconder");
    document.querySelector(".tela-2").classList.remove("esconder");
    id = element.getAttribute("id");

    buscarQuizz(id);

}

function selecionaResposta(item){
    const campoRespostas = item.parentNode;
    const campoPerguntas = campoRespostas.parentNode;
    const perguntas = document.querySelectorAll(".pergunta");
    const arrayRespostas = document.querySelectorAll(".figure");

    for (let i = 0; i < arrayRespostas.length; i++){
        arrayRespostas[i].style.opacity = "0.5";
    }
    item.style.opacity = "1";
    permiteClique(arrayRespostas);

}

function removeClique(arrayRespostas){
    for (let i = 0; i < arrayRespostas.length; i++){
        arrayRespostas[i].removeAttribute("onclick");
    }
}

function marcarResposta(campoRespostas, item){
    const respostasCertas = campoRespostas.querySelector(".certo");
    const respostasErradas = campoRespostas.querySelectorAll(".errado");

    respostasCertas.querySelector("p").style.color = "#009C22";

    for(let i =0; i < respostasErradas.length; i++){
        respostasErradas[i].querySelector("p").style.color = "#FF4B4B";
    }
    if (confereResposta(item)){
        acertos++;
    }
    respostasClicadas++;
}

function confereResposta(resposta){
    if (resposta.classList.contains("certo")){
        return true;
    }else {
        return false;
    }
}
renderizaQuizzesDoServidor()


const infosBasicas = document.querySelector(".infos-basicas");
const criarPerguntas = document.querySelector(".criar-perguntas");
const criarNiveis = document.querySelector(".criar-niveis");

//verifica se a string é um url
function verificaUrl(termo) {
  try {
    let url = new URL(termo);
    return true;
  } catch (err) {
    return false;
  }
}

let numPerguntas; //numero de perguntas do quizz
let numNiveis = 2; //numero de niveis do quizz
let titulo; //titulo do Quizz
let url; //url da imagem do quizz

function validarInformacoes() {
  let tituloQuizz = document.querySelector(".titulo-quizz").value;
  let urlQuizz = document.querySelector(".url-quizz").value;
  let qntPerguntas = document.querySelector(".qntd-perguntas").value;
  let qntNiveis = document.querySelector(".qntd-niveis").value;

  numPerguntas = qntPerguntas;
  numNiveis = qntNiveis;
  titulo = tituloQuizz;
  url = urlQuizz;

  if (tituloQuizz.length < 20 || tituloQuizz.length > 65) {
    return alert("Preencha o título corretamente");
  } else if (qntPerguntas < 3) {
    return alert("Preencha o número de perguntas corretamente");
  } else if (qntNiveis < 2) {
    return alert("Preencha o número de níveis corretamente");
  } else if (urlQuizz !== "") {
    if (verificaUrl(urlQuizz) === true) {
      dadosCriacaoQuizz.title = tituloQuizz;
      dadosCriacaoQuizz.image = urlQuizz;
      infosBasicas.classList.add("escondido");
      criarPerguntas.classList.remove("escondido");
      inserirPerguntas();
    } else {
      alert("Preencha o url corretamente");
    }
  }
}

//insere o número de Perguntas escolhido pelo usuário na 1ª tela
function inserirPerguntas() {
  const espaco = document.querySelector(".espaco-perguntas");
  for (let i = 0; numPerguntas > i; i++) {
    espaco.innerHTML += `
        <div class="caixa-pergunta n${i + 1}" onclick="editarPergunta(this)">
        <p>Pergunta ${i + 1}</p>
        <button><img src="/projeto6-buzzquizz/vector.svg"></button>
    </div>
    
    <form class="n${i + 1} escondido">
        <div class="caixa 1">
            <p>Pergunta ${i + 1}</p>
            <input type="text" class="texto-pergunta" placeholder="Texto da pergunta">
            <input type="text" class="cor-fundo" placeholder="Cor de fundo da pergunta">
        </div>
        <div class="caixa 2">
            <p>Resposta correta</p>
            <input type="text" class="resposta-certa" placeholder="Resposta correta">
            <input type="text" class="url-imagem" placeholder="URL da imagem">
        </div>
        <div class="caixa 3">
            <p>Respostas incorretas</p>
            <input type="text" class="resposta-errada 1" placeholder="Resposta incorreta 1">
            <input type="text" class="url-imagem" placeholder="URL da imagem 1">
        </div>
        <div class="caixa 4">
            <input type="text" class="resposta-errada 2" placeholder="Resposta incorreta 2">
            <input type="text" class="url-imagem" placeholder="URL da imagem 2">
        </div>
        <div class="caixa 5">
            <input type="text" class="resposta-errada 3" placeholder="Resposta incorreta 3">
            <input type="text" class="url-imagem" placeholder="URL da imagem 3">
        </div>
    </form>
        `;
  }
}

//função para abrir o formulário de perguntas ao clicar no ícone de editar
function editarPergunta(item) {
  const listaClasses = item.classList;
  let classe = listaClasses[1];

  const formulario = document.querySelector(`form.${classe}`);

  formulario.classList.remove("escondido");
  item.classList.add("escondido");
}

// função para validar o formulário de perguntas criadas
function validarPerguntas() {
  let quizzQuestion = [];

  const form = [];
  for (let i = 0; numPerguntas > i; i++) {
    let formulario = document.querySelector(`form.n${i + 1}`);
    form.push(formulario);
  }

  const padrao = new RegExp("^#([A-Fa-f0-9]{6})$");

  for (let i = 0; form.length > i; i++) {
    if (form[i][0].value.length < 20) {
      alert("Preencha a pergunta corretamente");
      return;
    } else if (padrao.test(form[i][1].value) === false) {
      alert("Preencha a cor corretamente");
      return;
    } else if (form[i][2].value === "" || form[i][3].value === "") {
      alert("Preencha a resposta corretamente");
      return;
    } else if (
      form[i][4].value === "" &&
      form[i][6].value === "" &&
      form[i][8].value === ""
    ) {
      alert("Preencha alguma das respostas erradas pelo menos");
      return;
    } else if (form[i][3] !== "") {
      if (verificaUrl(form[i][3].value) === false) {
        alert("Preencha a url corretamente");
        return;
      }
    } else if (form[i][5] !== "") {
      if (verificaUrl(form[i][5].value) === false) {
        alert("Preencha a url corretamente");
        return;
      }
    } else if (form[i][7] !== "") {
      if (verificaUrl(form[i][7].value) === false) {
        alert("Preencha a url corretamente");
        return;
      }
    } else if (form[i][9] !== "") {
      if (verificaUrl(form[i][9].value) === false) {
        alert("Preencha a url corretamente");
        return;
      }
    }
  }

  for (let i = 0; form.length > i; i++) {
    let respostas = [];
    if (form[i][2].value !== "") {
      respostas.push({
        text: form[i][2].value,
        image: form[i][3].value,
        isCorrectAnswer: true
      });
    }
    if (form[i][4].value !== "") {
      respostas.push({
        text: form[i][4].value,
        image: form[i][5].value,
        isCorrectAnswer: false
      });
    }
    if (form[i][6].value !== "") {
      respostas.push({
        text: form[i][6].value,
        image: form[i][7].value,
        isCorrectAnswer: false
      });
    }
    if (form[i][8].value !== "") {
      respostas.push({
        text: form[i][8].value,
        image: form[i][9].value,
        isCorrectAnswer: false
      });
    }

    quizzQuestion.push({
      title: form[i][0].value,
      color: form[i][1].value,
      answers: respostas
    });
  }

  dadosCriacaoQuizz.questions = quizzQuestion;
  mudarTelaNiveis();
}

//função para abri a tela de criação de niveis
function mudarTelaNiveis() {
  criarPerguntas.classList.add("escondido");
  criarNiveis.classList.remove("escondido");
  inserirNiveis();
}

// insere o número de níveis escolhidos pelo usuário
function inserirNiveis() {
  const espacoNiveis = document.querySelector(".espaco-niveis");
  for (let i = 0; numNiveis > i; i++) {
    espacoNiveis.innerHTML += `
    <div class="caixa-nivel z${i + 1}" onclick="editarPergunta(this)">
        <p>Nível ${i + 1}</p>
        <button><img src="/projeto6-buzzquizz/vector.svg"></button>
    </div>
    <form class="z${i + 1} escondido">
        <p>Nível ${i + 1}</p>
        <input type="text" class="titulo-quizz" placeholder="Título do nível">
        <input type="number" class="acerto-minimo" placeholder="% de acerto mínima">
        <input type="text" class="url-nivel" placeholder="URL da imagem do nível">
        <input type="text" class="descrição-nivel" placeholder="Descrição do nível">
    </form>
    `;
  }
}

//função para validar as informações dos nívei
function validarNiveis() {
  let quizzNivel = [];

  const form = [];
  for (let i = 0; numNiveis > i; i++) {
    let formulario = document.querySelector(`form.z${i + 1}`);
    form.push(formulario);
  }

  for (let i = 0; form.length > i; i++) {
    if (form[i][0].value.length < 20) {
      alert("Preencha o título do nível corretamente");
      return;
    } else if (
      Number(form[i][1].value) >= 100 ||
      Number(form[i][1].value) < 0
    ) {
      alert("Porcentagem mínima inválida");
      return;
    } else if (verificaUrl(form[i][2].value) === false) {
      alert("Preencha a url corretamente");
      return;
    } else if (form[i][3].length < 30) {
      alert("Preencha a descrição corretamente");
      return;
    }

    quizzNivel.push({
      title: form[i][0].value,
      image: form[i][2].value,
      text: form[i][3].value,
      minValue: form[i][1].value
    });
  }

  dadosCriacaoQuizz.levels = quizzNivel;

  let listaBool = [];
  for (let i = 0; form.length > i; i++) {
    if (Number(form[i][1].value) === 0) {
      listaBool.push(true);
    }
  }
  if (listaBool.length === 0) {
    alert("Pelo menos um nível com a porcentagem de acerto igual a 0%");
  } else {
    criarNiveis.classList.add("escondido");
    adicionarQuizzServidor();
  }
}

//Adicionar quizzes no local storage para renderizar no espaço quizzes-usuario
function adicionarQuizzServidor() {
  const enviandoQuizz = axios.post(
    "https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes",
    dadosCriacaoQuizz
  );
  enviandoQuizz.then(adicionarQuizzesDoUsuario);
  enviandoQuizz.catch((erro) => {
    alert("Erro ao adicionar quiz no servidor");
  })
}

function adicionarQuizzesDoUsuario(resposta) {
  idUsuarioCadastrado = resposta.data.id;

  // Adicionar id do Quizz do usuários no localStorage
  let idsQuizzesJSON = localStorage.getItem("idsQuizzes");
  idUsuariosLocais = JSON.parse(idsQuizzesJSON);
  if (idUsuariosLocais) {
    idUsuariosLocais.push(idUsuarioCadastrado);
  } else {
    idUsuariosLocais = [idUsuarioCadastrado];
  }
  idsQuizzesJSON = JSON.stringify(idUsuariosLocais);
  localStorage.setItem("idsQuizzes", idsQuizzesJSON);

  inserirQuizzCriado();
}

//insere quizz criado na tela de sucesso
function inserirQuizzCriado() {
  const espacoQuizzCriado = document.querySelector(".quizz-criado");
  espacoQuizzCriado.innerHTML = `
        <h1>Seu quizz está pronto!</h1>
        <div class="quizz"> 
            <img src="${dadosCriacaoQuizz.image}"/>
            <div class="efeito-imagem-adicionar"></div>
            <div class="titulo-quiz">${dadosCriacaoQuizz.title}</div>
        </div>
        <button class='acessar-quizz' onclick="verificarQuizz(${idUsuarioCadastrado})" >Acessar Quizz</button>
        <button class="voltar-home" onclick="voltarParaHome()">Voltar pra home</button>
    `;
  espacoQuizzCriado.classList.remove("escondido");
}

// função acessar home
function volarHome() {
  home.classList.remove("escondido");
}